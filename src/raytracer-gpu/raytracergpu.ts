// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@webgpu/types/dist/index.d.ts" />

import { DoneCallback, RaytracerBase } from '../raytracerbase';
import WebGPUContext from './webgpucontext';
import WebGPUComputePipline from './webgpucomputepipeline';

export default class RaytracerGPU extends RaytracerBase {
  private _initialized = false;
  private _webGPUContext: WebGPUContext;

  public constructor(
    canvas: HTMLCanvasElement,
    imageWidth: number,
    imageHeight: number,
    samplesPerPixel: number,
    maxBounces: number
  ) {
    super(canvas, imageWidth, imageHeight, samplesPerPixel, maxBounces);
  }

  public static supportsWebGPU(): boolean {
    if (navigator.gpu) {
      return true;
    }
    return false;
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;
    this._startTime = performance.now();

    const pipeline = new WebGPUComputePipline({
      computeShaderUrl: 'raytracer.comp.spv',
      unformParams: {
        iWidth: this._imageWidth,
        iHeight: this._imageHeight,
        iSamplesPerPixel: this._samplesPerPixel,
        iMaxBounces: this._maxBounces,
      },
    });

    await pipeline.initialize(this._webGPUContext);

    const floatArray = await this.compute(pipeline);

    const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);

    for (let i = 0; i <= floatArray.length; i++) {
      imageData.data[i] = floatArray[i] * 255;
    }

    this._context2D.putImageData(imageData, 0, 0);

    // raytracer finished
    const duration = performance.now() - this._startTime;
    const renderTime = `spp: ${this._samplesPerPixel}, max-bounces: ${
      this._maxBounces
    }, rendertime: ${RaytracerBase.msToTimeString(duration)}`;
    console.log(renderTime);
    this._context2D.font = '16px Arial';
    this._context2D.textBaseline = 'top';
    this._context2D.fillText(renderTime, 5, 5);

    if (this._doneCallback) {
      this._doneCallback(duration);
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

    const adapter = await gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const queue = device.defaultQueue;

    this._webGPUContext = new WebGPUContext(device, queue);
    this._initialized = true;
  }

  private async compute(pipeline: WebGPUComputePipline): Promise<Float32Array> {
    // encode commands
    const commandEncoder = this._webGPUContext.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline.gpuPipeline);
    passEncoder.setBindGroup(0, pipeline.bindGroup);
    // passEncoder.dispatch(this._imageWidth, this._imageHeight, 1);
    passEncoder.dispatch(this._imageWidth * this._imageHeight, 1, 1);
    passEncoder.endPass();

    const gpuReadBuffer = this._webGPUContext.device.createBuffer({
      size: this._imageWidth * this._imageHeight * 4 * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    commandEncoder.copyBufferToBuffer(
      pipeline.pixelBuffer,
      0,
      gpuReadBuffer,
      0,
      this._imageWidth * this._imageHeight * 4 * 4
    );

    this._webGPUContext.queue.submit([commandEncoder.finish()]);

    const arrayBuffer = await gpuReadBuffer.mapReadAsync();
    return new Float32Array(arrayBuffer);
  }
}
