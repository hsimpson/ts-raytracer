import ControllerWorker from 'worker-loader!./controller.worker';
import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { serialize } from '../serializing';
import { HittableList } from './hittablelist';
import {
  ControllerCommands,
  ControllerEndMessage,
  ControllerStartMessage,
  ControllerStopMessage,
  WorkerMessage,
} from './workerinterfaces';

export interface RayTracerCPUOptions extends RayTracerBaseOptions {
  numOfWorkers: number;
}

export class RaytracerCPU extends RaytracerBase {
  private _controllerWorker: ControllerWorker;
  private _context2D: CanvasRenderingContext2D;

  public constructor(rayTracerCPUOptions: RayTracerCPUOptions) {
    super();
    this._rayTracerOptions = rayTracerCPUOptions;
    this._controllerWorker = new ControllerWorker();
  }

  private async onControllerFinshed(msg: ControllerEndMessage): Promise<void> {
    this._isRunning = false;
    const imageData = this._context2D.createImageData(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight
    );

    let j = 0;
    for (let i = 0; i < imageData.data.length; ) {
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = 255;
    }

    this._context2D.putImageData(imageData, 0, 0);

    const duration = performance.now() - this._startTime;
    const stats = this.getStats(duration);

    if (this._rayTracerOptions.download) {
      await this.downloadImage(this._rayTracerOptions.canvas, this._context2D, stats);
    }

    if (this._doneCallback) {
      this._doneCallback(stats);
    }
  }

  private async onControllerMessage(event): Promise<void> {
    const msg = event.data as WorkerMessage;
    switch (msg.cmd as ControllerCommands) {
      case ControllerCommands.END:
        await this.onControllerFinshed(msg as ControllerEndMessage);
        break;

      default:
        break;
    }
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    this._doneCallback = doneCallback;
    this._context2D = this._rayTracerOptions.canvas.getContext('2d');
    this._isRunning = true;
    this._startTime = performance.now();

    this._controllerWorker.onmessage = async (event) => this.onControllerMessage(event);

    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene);

    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;

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

    const controllerStartMessage: ControllerStartMessage = {
      cmd: ControllerCommands.START,
      data: {
        imageWidth: this._rayTracerOptions.imageWidth,
        imageHeight: this._rayTracerOptions.imageHeight,
        samplesPerPixel: this._rayTracerOptions.samplesPerPixel,
        maxBounces: this._rayTracerOptions.maxBounces,
        computeWorkers: (this._rayTracerOptions as RayTracerCPUOptions).numOfWorkers,
        sceneIdx: this._rayTracerOptions.scene,
        world: serialize(HittableList, world),
        camera: serialize(Camera, camera),
        background: cameraOptions.background,
      },
    };

    this._controllerWorker.postMessage(controllerStartMessage);
  }

  public stop(): void {
    const controllerStopMessage: ControllerStopMessage = {
      cmd: ControllerCommands.STOP,
      data: {},
    };

    this._controllerWorker.postMessage(controllerStopMessage);
  }

  public set numOfWorkers(numOfWorkers: number) {
    (this._rayTracerOptions as RayTracerCPUOptions).numOfWorkers = numOfWorkers;
  }
}
