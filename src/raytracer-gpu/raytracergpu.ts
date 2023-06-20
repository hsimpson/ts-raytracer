import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { ComputeTile, createComputeTiles } from '../tiles';
import { WebGPUBuffer } from './webgpubuffer';
import { WebGPUComputePipline } from './webgpucomputepipeline';
import { WebGPUContext } from './webgpucontext';
import { WebGPURenderPipeline } from './webgpurenderpipeline';
// import { sleep } from '../util';

const LOCAL_SIZE = 8;

export type RayTracerGPUOptions = RayTracerBaseOptions;

export class RaytracerGPU extends RaytracerBase {
  private _initialized = false;

  private _presentationFormat: GPUTextureFormat;
  // private _renderTarget: GPUTexture;
  // private _renderTargetView: GPUTextureView;

  public constructor(rayTracerGPUOptions: RayTracerGPUOptions) {
    super();
    this._rayTracerOptions = rayTracerGPUOptions;
  }

  public static supportsWebGPU(): boolean {
    if (navigator.gpu) {
      return true;
    }
    return false;
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    console.time('RaytracerGPU initialization');
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

    const textureSize: GPUExtent3D = {
      width: this._rayTracerOptions.imageWidth,
      height: this._rayTracerOptions.imageHeight,
      depthOrArrayLayers: 1,
    };

    const colorTextureDesc: GPUTextureDescriptor = {
      size: textureSize,
      sampleCount: 1,
      format: 'bgra8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    };

    const colorTexture = WebGPUContext.device.createTexture(colorTextureDesc);
    // this._renderTargetView = colorTexture.createView();

    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;

    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene);

    const camera = new Camera();
    camera.init(
      cameraOptions.lookFrom,
      cameraOptions.lookAt,
      cameraOptions.vUp,
      cameraOptions.fovY,
      aspectRatio,
      cameraOptions.aperture,
      cameraOptions.focusDist,
      0.0,
      0.1,
    );

    const baseUrl = window.location.href;

    const computePipeline = new WebGPUComputePipline({
      computeShaderUrl: new URL('assets/shaders/raytracer.comp.wgsl', baseUrl),
      uniformParams: {
        background: cameraOptions.background,
        tileOffsetX: 0,
        tileOffsetY: 0,
        imageWidth: this._rayTracerOptions.imageWidth,
        imageHeight: this._rayTracerOptions.imageHeight,
        currentSample: 1,
        maxBounces: this._rayTracerOptions.maxBounces,
        padding_0: 0,
        padding_1: 0,
        padding_2: 0,
      },
      camera,
      world,
    });

    await computePipeline.initialize();

    const renderPipeline = new WebGPURenderPipeline({
      vertexShaderUrl: new URL('assets/shaders/renderer.vert.wgsl', baseUrl),
      fragmentShaderUrl: new URL('assets/shaders/renderer.frag.wgsl', baseUrl),
      sharedPixelBuffer: computePipeline.pixelBuffer,
      uniformParams: {
        width: this._rayTracerOptions.imageWidth,
        height: this._rayTracerOptions.imageHeight,
      },
    });

    await renderPipeline.initialize();

    // const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);

    const raytracing = async (): Promise<void> => {
      return new Promise(resolve => {
        const computeTiles = createComputeTiles(
          this._rayTracerOptions.imageWidth,
          this._rayTracerOptions.imageHeight,
          this._rayTracerOptions.tileSize,
        );

        const frequency = 100;
        let sample = 1;
        let tile: ComputeTile;
        const frame = (): void => {
          const frameStartTime = window.performance.now();
          let duration = 0;
          do {
            if (sample === 1) {
              tile = computeTiles.shift();
            }
            this.computePass(computePipeline, sample++, tile);
            if (sample > this._rayTracerOptions.samplesPerPixel) {
              sample = 1;
            }
            duration += window.performance.now() - frameStartTime;
          } while (computeTiles.length && duration < frequency);
          // console.log(duration);
          this.renderPass(renderPipeline);

          if (computeTiles.length || sample < this._rayTracerOptions.samplesPerPixel - 1) {
            window.requestAnimationFrame(frame);
          } else {
            resolve();
          }
        };
        window.requestAnimationFrame(frame);
      });
    };

    console.timeEnd('RaytracerGPU initialization');
    // raytracer finished
    await raytracing();

    const duration = performance.now() - this._startTime;
    const stats = `WebGPU -- ${this.getStats(duration)}`;

    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer(computePipeline);

      const canvas2d = document.createElement('canvas') as HTMLCanvasElement;
      canvas2d.width = this._rayTracerOptions.imageWidth;
      canvas2d.height = this._rayTracerOptions.imageHeight;
      const canvas2dContext = canvas2d.getContext('2d');

      const imageData = canvas2dContext.createImageData(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight);

      for (let i = 0; i < pixelBuffer.length; i++) {
        imageData.data[i] = pixelBuffer[i] * 255;
      }

      canvas2dContext.putImageData(imageData, 0, 0);
      await this.downloadImage(canvas2dContext, stats);
    }

    if (this._doneCallback) {
      this._doneCallback(stats);
    }
    this._isRunning = false;
  }

  public stop(): void {
    //
  }

  private async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    const gpu = navigator.gpu;

    try {
      const adapter = await gpu.requestAdapter();
      const device = await adapter.requestDevice();
      const queue = device.queue;

      const context: GPUCanvasContext = this._rayTracerOptions.canvas.getContext('webgpu');
      this._presentationFormat = gpu.getPreferredCanvasFormat();
      WebGPUContext.createContext(device, queue, context);

      // const canvasConfigure: GPUCanvasConfiguration = {
      //   device,
      //   format: this._presentationFormat,
      //   usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      // };
      context.configure({
        device,
        format: this._presentationFormat,
      });

      this._initialized = true;
    } catch (error: unknown) {
      console.log(error);
    }
  }

  private computePass(computePipeline: WebGPUComputePipline, sample: number, tile: ComputeTile): void {
    // console.log('computePass', sample, tile);
    const commandEncoder = WebGPUContext.device.createCommandEncoder();

    computePipeline.updateUniformBuffer(sample, tile);
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline.gpuPipeline);
    passEncoder.setBindGroup(0, computePipeline.bindGroup);
    passEncoder.dispatchWorkgroups(tile.width / LOCAL_SIZE, tile.height / LOCAL_SIZE, 1);
    passEncoder.end();

    WebGPUContext.queue.submit([commandEncoder.finish()]);
  }

  private renderPass(renderPipeLine: WebGPURenderPipeline): void {
    // console.log('renderPass');
    const commandEncoder = WebGPUContext.device.createCommandEncoder();

    // renderPipeLine.updateUniformBuffer(sample);
    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: WebGPUContext.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(renderPipeLine.gpuPipeline);
    passEncoder.setBindGroup(0, renderPipeLine.bindGroup);
    passEncoder.setVertexBuffer(0, renderPipeLine.vertexPostionBuffer);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    WebGPUContext.queue.submit([commandEncoder.finish()]);
  }

  private async copyBuffer(computePipeline: WebGPUComputePipline): Promise<Float32Array> {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();

    const bufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4 * 4;
    const gpuDestBuffer = new WebGPUBuffer();
    gpuDestBuffer.create(bufferSize, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);

    commandEncoder.copyBufferToBuffer(computePipeline.pixelBuffer.gpuBuffer, 0, gpuDestBuffer.gpuBuffer, 0, bufferSize);

    WebGPUContext.queue.submit([commandEncoder.finish()]);
    const arrayBuffer = await gpuDestBuffer.mapRead();

    return new Float32Array(arrayBuffer);
  }
}
