// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@webgpu/types/dist/index.d.ts" />

import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { WebGPUBuffer } from './webgpubuffer';
import WebGPUComputePipline from './webgpucomputepipeline';
import { WebGPUContext } from './webgpucontext';
import WebGPURenderPipeline from './webgpurenderpipeline';
import { sleep } from '../util';

const LOCAL_SIZE = 8;

export type RayTracerGPUOptions = RayTracerBaseOptions;

export class RaytracerGPU extends RaytracerBase {
  private _initialized = false;

  private _colorTextureView: GPUTextureView;
  private _colorAttachment: GPURenderPassColorAttachmentDescriptor;
  private _swapchain: GPUSwapChain;

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
      depth: 1,
    };

    const colorTextureDesc: GPUTextureDescriptor = {
      size: textureSize,
      sampleCount: 1,
      format: 'bgra8unorm',
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    };

    const colorTexture = WebGPUContext.device.createTexture(colorTextureDesc);
    this._colorTextureView = colorTexture.createView();

    this._colorAttachment = {
      attachment: null,
      loadValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: 'store',
    };

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
      0.1
    );

    const computePipeline = new WebGPUComputePipline({
      computeShaderUrl: 'raytracer.comp.spv',
      uniformParams: {
        background: cameraOptions.background,
        width: this._rayTracerOptions.imageWidth,
        height: this._rayTracerOptions.imageHeight,
        currentSample: 1,
        maxBounces: this._rayTracerOptions.maxBounces,
        randomSeed: 0,
      },
      camera,
      world,
    });

    await computePipeline.initialize();

    const renderPipeline = new WebGPURenderPipeline({
      vertexShaderUrl: 'renderer.vert.spv',
      fragmentShaderUrl: 'renderer.frag.spv',
      sharedPixelBuffer: computePipeline.pixelBuffer,
      uniformParams: {
        width: this._rayTracerOptions.imageWidth,
        height: this._rayTracerOptions.imageHeight,
      },
    });

    await renderPipeline.initialize();

    // const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);

    const raytracing = async (): Promise<void> => {
      return new Promise((resolve) => {
        let sample = 1;
        let prevTime = performance.now();
        const frame = async (): Promise<void> => {
          const currentTime = performance.now();
          console.log(`duration: ${(currentTime - prevTime).toFixed(3)} ms`);
          prevTime = currentTime;
          console.log(`Sample pass ${sample} of ${this._rayTracerOptions.samplesPerPixel}`);

          // async without render pipeline
          /*
          this.compute(computePipeline, true).then((rayTracedArray) => {
            for (let j = 0; j <= rayTracedArray.length; j++) {
              // imageData.data[j] = (rayTracedArray[j] / sample) * 255;
              imageData.data[j] = rayTracedArray[j] * 255;
            }
            this._context2D.putImageData(imageData, 0, 0);
            if (sample < this._samplesPerPixel) {
              sample++;
              window.requestAnimationFrame(frame);
            } else {
              resolve();
            }
          });
          */

          // async with render pipeline
          this.compute2(computePipeline, renderPipeline);
          if (sample < this._rayTracerOptions.samplesPerPixel) {
            sample++;
            await sleep(25);
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
    const stats = this.getStats(duration);

    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer(computePipeline);

      const canvas2d = document.createElement('canvas') as HTMLCanvasElement;
      canvas2d.width = this._rayTracerOptions.imageWidth;
      canvas2d.height = this._rayTracerOptions.imageHeight;
      const canvas2dContext = canvas2d.getContext('2d');

      const imageData = canvas2dContext.createImageData(
        this._rayTracerOptions.imageWidth,
        this._rayTracerOptions.imageHeight
      );

      for (let i = 0; i < pixelBuffer.length; i++) {
        imageData.data[i] = pixelBuffer[i] * 255;
      }

      canvas2dContext.putImageData(imageData, 0, 0);
      this.downloadImage(canvas2d, canvas2dContext, stats);
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
      const queue = device.defaultQueue;

      WebGPUContext.createContext(device, queue);

      const context: GPUCanvasContext = (this._rayTracerOptions.canvas.getContext(
        'gpupresent'
      ) as unknown) as GPUCanvasContext;
      const swapChainDesc: GPUSwapChainDescriptor = {
        device,
        format: 'bgra8unorm',
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      };
      this._swapchain = context.configureSwapChain(swapChainDesc);

      this._initialized = true;
    } catch (error: unknown) {
      console.log(error);
    }
  }

  /*
  private async compute(computePipeline: WebGPUComputePipline, copyBuffer = false): Promise<Float32Array> {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();

    // compute pass
    {
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline.gpuPipeline);
      passEncoder.setBindGroup(0, computePipeline.bindGroup);
      passEncoder.dispatch(this._imageWidth / LOCAL_SIZE, this._imageHeight / LOCAL_SIZE, 1);
      passEncoder.endPass();

      computePipeline.updateUniformBuffer();
    }

    if (copyBuffer) {
      // FIXME: probably reuse buffer (maybe performance increase)
      const gpuReadBuffer = new WebGPUBuffer();
      gpuReadBuffer.create(
        this._imageWidth * this._imageHeight * 4 * 4,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      );

      commandEncoder.copyBufferToBuffer(
        computePipeline.pixelBuffer.gpuBuffer,
        0,
        gpuReadBuffer.gpuBuffer,
        0,
        this._imageWidth * this._imageHeight * 4 * 4
      );
      WebGPUContext.queue.submit([commandEncoder.finish()]);
      const arrayBuffer = await gpuReadBuffer.mapRead();

      return new Float32Array(arrayBuffer);
    } else {
      WebGPUContext.queue.submit([commandEncoder.finish()]);
    }
    return new Float32Array(this._imageWidth * this._imageHeight * 4 * 4);
  }
  */

  // unused at the moment
  private compute2(computePipeline: WebGPUComputePipline, renderPipeLine: WebGPURenderPipeline): void {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();

    // compute pass
    {
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline.gpuPipeline);
      passEncoder.setBindGroup(0, computePipeline.bindGroup);
      passEncoder.dispatch(
        this._rayTracerOptions.imageWidth / LOCAL_SIZE,
        this._rayTracerOptions.imageHeight / LOCAL_SIZE,
        1
      );
      passEncoder.endPass();

      computePipeline.updateUniformBuffer();
    }

    // render pass
    {
      // renderPipeLine.updateUniformBuffer(sample);
      this._colorAttachment.attachment = this._swapchain.getCurrentTexture().createView();
      const renderPassDesc: GPURenderPassDescriptor = {
        colorAttachments: [this._colorAttachment],
        //depthStencilAttachment: this._depthAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(renderPipeLine.gpuPipeline);
      passEncoder.setBindGroup(0, renderPipeLine.bindGroup);
      passEncoder.setVertexBuffer(0, renderPipeLine.vertexPostionBuffer);
      passEncoder.draw(6, 1, 0, 0);
      passEncoder.endPass();
    }

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
