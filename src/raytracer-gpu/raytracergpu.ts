// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@webgpu/types/dist/index.d.ts" />
import { DoneCallback, RaytracerBase } from '../raytracerbase';

export default class RaytracerGPU extends RaytracerBase {
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

  public start(doneCallback?: DoneCallback): void {
    this._doneCallback = doneCallback;
    this._isRunning = true;
    this._startTime = performance.now();

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
}
