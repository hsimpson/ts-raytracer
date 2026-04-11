import { BufferDataTypeKind, ScalarType, WebGPUBuffer, WebGPUContext } from '@donnerknalli/webgpu-utils';
import { vec2n } from 'wgpu-matrix';
import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { ComputeTile, createComputeTiles } from '../tiles';
import { WebGPUComputePipeline } from './webgpucomputepipeline';
import { WebGPURenderPipeline } from './webgpurenderpipeline';

const LOCAL_SIZE = 8;

export type RayTracerGPUOptions = RayTracerBaseOptions;

export class RaytracerGPU extends RaytracerBase {
  private _initialized = false;
  private readonly _webGpuContext: WebGPUContext;

  private _presentationFormat!: GPUTextureFormat;

  public constructor(rayTracerGPUOptions: RayTracerGPUOptions) {
    super();
    this._rayTracerOptions = rayTracerGPUOptions;
    this._webGpuContext = new WebGPUContext(this._rayTracerOptions.canvas);
  }

  public static supportsWebGPU(): boolean {
    return 'gpu' in navigator;
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    console.time('RaytracerGPU initialization');
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

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

    const computePipeline = new WebGPUComputePipeline({
      computeShaderUrl: new URL('assets/shaders/raytracer.comp.wgsl', baseUrl),
      computeUniformParams: {
        background: cameraOptions.background,
        tileOffset: vec2n.zero(),
        imageSize: vec2n.create(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight),
        currentSample: 1,
        maxBounces: this._rayTracerOptions.maxBounces,
      },
      webGpuContext: this._webGpuContext,
      camera,
      world,
    });

    await computePipeline.initialize();

    const renderPipeline = new WebGPURenderPipeline({
      vertexShaderUrl: new URL('assets/shaders/renderer.vert.wgsl', baseUrl),
      fragmentShaderUrl: new URL('assets/shaders/renderer.frag.wgsl', baseUrl),
      sharedPixelBuffer: computePipeline.pixelBuffer,
      renderUniformParams: {
        size: vec2n.create(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight),
      },
      webGpuContext: this._webGpuContext,
    });

    await renderPipeline.initialize();

    const computeTiles = createComputeTiles(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight,
      this._rayTracerOptions.tileSize,
    );
    console.timeEnd('RaytracerGPU initialization');

    await this.renderTiles(computeTiles, computePipeline, renderPipeline);

    const duration = performance.now() - this._startTime;
    const stats = `WebGPU -- ${this.getStats(duration)}`;

    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer(computePipeline);

      const canvas2d = document.createElement('canvas');
      canvas2d.width = this._rayTracerOptions.imageWidth;
      canvas2d.height = this._rayTracerOptions.imageHeight;
      const canvas2dContext = canvas2d.getContext('2d');

      if (!canvas2dContext) {
        throw new Error('Failed to get 2D context');
      }

      const imageData = canvas2dContext.createImageData(
        this._rayTracerOptions.imageWidth,
        this._rayTracerOptions.imageHeight,
      );

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

  private async renderTiles(
    tiles: ComputeTile[],
    computePipeline: WebGPUComputePipeline,
    renderPipeline: WebGPURenderPipeline,
  ): Promise<void> {
    return new Promise((resolve) => {
      const numOfTiles = tiles.length;
      console.log(`Number of tiles: ${numOfTiles}`);

      let tileIndex = 0;
      let sample = 1;
      const frequency = 16;
      const frame = (): void => {
        const frameStartTime = window.performance.now();
        let duration = 0;
        do {
          this.computePass(computePipeline, sample, tiles[tileIndex]);

          if (sample === this._rayTracerOptions.samplesPerPixel) {
            sample = 1;
            tileIndex++;
            if (tileIndex === numOfTiles) {
              this.renderPass(renderPipeline);
              resolve();
              return;
            }
          } else {
            sample++;
          }
          duration += window.performance.now() - frameStartTime;
        } while (duration < frequency);
        this.renderPass(renderPipeline);

        if (tileIndex < numOfTiles - 1 || sample < this._rayTracerOptions.samplesPerPixel) {
          window.requestAnimationFrame(frame);
        }
      };

      window.requestAnimationFrame(frame);
    });
  }

  private async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    await this._webGpuContext.create();
    this._presentationFormat = this._webGpuContext.preferredCanvasFormat;

    this._webGpuContext.gpuCanvasContext.configure({
      device: this._webGpuContext.device,
      format: this._presentationFormat,
    });

    this._initialized = true;
  }

  private computePass(computePipeline: WebGPUComputePipeline, sample: number, tile: ComputeTile): void {
    // console.log('computePass sample:', sample, tile);
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    computePipeline.updateUniformBuffer(sample, tile);
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline.gpuPipeline);
    passEncoder.setBindGroup(0, computePipeline.bindGroup);
    passEncoder.dispatchWorkgroups(tile.width / LOCAL_SIZE, tile.height / LOCAL_SIZE, 1);
    passEncoder.end();

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private renderPass(renderPipeLine: WebGPURenderPipeline): void {
    // console.log('renderPass');
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    // renderPipeLine.updateUniformBuffer(sample);
    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this._webGpuContext.gpuCanvasContext.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(renderPipeLine.gpuPipeline);
    passEncoder.setBindGroup(0, renderPipeLine.bindGroup);
    passEncoder.setVertexBuffer(0, renderPipeLine.vertexPositionBuffer);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private async copyBuffer(computePipeline: WebGPUComputePipeline): Promise<Float32Array> {
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    const bufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4;

    const gpuDestBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      label: 'gpuDestBuffer',
    });

    gpuDestBuffer.setData('copyBuffer', {
      data: new Float32Array(bufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    gpuDestBuffer.writeBuffer();

    commandEncoder.copyBufferToBuffer(
      computePipeline.pixelBuffer.getRawBuffer(),
      0,
      gpuDestBuffer.getRawBuffer(),
      0,
      bufferSize * Float32Array.BYTES_PER_ELEMENT,
    );

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
    const arrayBuffer = await gpuDestBuffer.mapRead();

    return new Float32Array(arrayBuffer);
  }
}
