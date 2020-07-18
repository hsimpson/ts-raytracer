// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@webgpu/types/dist/index.d.ts" />

import { DoneCallback, RaytracerBase } from '../raytracerbase';
import WebGPUContext from './webgpucontext';
import WebGPUComputePipline from './webgpucomputepipeline';
import Vec3 from '../vec3';
import { randomNumberRange } from '../util';
import Camera from '../camera';

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
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

    const randomSceneArray = this.createRandomScene();
    const aspectRatio = this._imageWidth / this._imageHeight;
    const lookFrom = new Vec3(13, 2, 3);
    const lookAt = new Vec3(0, 0, 0);
    const vUp = new Vec3(0, 1, 0);
    const focusDist = 10;
    const aperture = 0.1;
    const fovY = 20;
    const camera = new Camera(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist);

    const pipeline = new WebGPUComputePipline({
      computeShaderUrl: 'raytracer.comp.spv',
      unformParams: {
        fWidth: this._imageWidth,
        fHeight: this._imageHeight,
        fSamplesPerPixel: this._samplesPerPixel,
        fMaxBounces: this._maxBounces,
        fSphereCount: randomSceneArray.length / 12,
      },
      randomScene: randomSceneArray,
      camera,
    });

    await pipeline.initialize(this._webGPUContext);

    const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);
    const rawArray = new Float32Array(this._imageWidth * this._imageHeight * 4);

    for (let sample = 0; sample < this._samplesPerPixel; sample++) {
      // const lastframe = sample === this._samplesPerPixel - 1;
      const lastframe = true;
      console.log(`Sample pass ${sample + 1} of ${this._samplesPerPixel}`);
      console.time('compute');
      const rayTracedArray = await this.compute(pipeline, lastframe);
      console.timeEnd('compute');

      // if (lastframe) {
      for (let j = 0; j <= rayTracedArray.length; j++) {
        rawArray[j] += rayTracedArray[j];
        imageData.data[j] = (rawArray[j] / (sample + 1)) * 255;
      }
      this._context2D.putImageData(imageData, 0, 0);
      // }
    }

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

  private createSphere(
    center: Vec3,
    radius: number,
    material: number,
    albedo: Vec3,
    roughness: number,
    refractIdx: number
  ): number[] {
    const array: number[] = [];
    array.push(...center.array, radius, material, ...albedo.array, roughness, refractIdx);

    // padding;
    array.push(0, 0);

    return array;
  }

  private createRandomScene(): Float32Array {
    const array: number[] = [];

    array.push(...this.createSphere(new Vec3(0.0, -1000, 0.0), 1000, 0.5, new Vec3(0.5, 0.5, 0.5), 0.0, 1.0));
    array.push(...this.createSphere(new Vec3(0.0, 1.0, 0.0), 1.0, 1.0, new Vec3(1.0, 1.0, 1.0), 1.0, 1.5));
    array.push(...this.createSphere(new Vec3(-4.0, 1.0, 0.0), 1.0, 0.5, new Vec3(0.4, 0.2, 0.1), 0.0, 1.0));
    array.push(...this.createSphere(new Vec3(4.0, 1.0, 0.0), 1.0, 0.9, new Vec3(0.7, 0.7, 0.5), 0.0, 1.0));

    for (let a = -11; a < 11; a++) {
      for (let b = -11; b < 11; b++) {
        const chooseMat = Math.random();

        const center = new Vec3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());

        if (Vec3.subVec3(center, new Vec3(4, 0.2, 0)).length() > 0.9) {
          let albedo: Vec3;
          let roughness = 0.0;
          let refIdx = 1.0;

          if (chooseMat < 0.8) {
            albedo = Vec3.multVec3(Vec3.random(), Vec3.random());
          } else if (chooseMat < 0.95) {
            roughness = randomNumberRange(0, 0.5);
            albedo = Vec3.randomRange(0.5, 1);
          } else {
            albedo = new Vec3(1.0, 1.0, 1.0);
            refIdx = 1.5;
          }

          array.push(...this.createSphere(center, 0.2, chooseMat, albedo, roughness, refIdx));
        }
      }
    }

    return new Float32Array(array);
  }

  private async compute(pipeline: WebGPUComputePipline, copyBuffer = false): Promise<Float32Array> {
    // encode commands
    const commandEncoder = this._webGPUContext.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline.gpuPipeline);
    passEncoder.setBindGroup(0, pipeline.bindGroup);
    //passEncoder.dispatch(this._imageWidth, this._imageHeight, 1);
    passEncoder.dispatch(this._imageWidth * this._imageHeight, 1, 1);
    passEncoder.endPass();

    pipeline.updateUniformBuffer();

    if (copyBuffer) {
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
    return new Float32Array();
  }
}
