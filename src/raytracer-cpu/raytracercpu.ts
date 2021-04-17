import ControllerWorker from 'worker-loader!./controller.worker';
import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { serialize } from '../serializing';
import { HittableList } from '../hittables';
import {
  ControllerCommands,
  ControllerEndMessage,
  ControllerStartMessage,
  ControllerStopMessage,
  ControllerUpdateMessage,
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

  private updateImage(imageArray: Uint8ClampedArray): void {
    const imageData = this._context2D.createImageData(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight
    );

    let j = 0;
    // for (let y = 0; y < this._rayTracerOptions.imageHeight; y++) {
    for (let y = this._rayTracerOptions.imageHeight - 1; y >= 0; y--) {
      for (let x = 0; x < this._rayTracerOptions.imageWidth; x++) {
        const imageIndex = (y * this._rayTracerOptions.imageWidth + x) * 4;
        // const arrayIndex = (y * this._rayTracerOptions.imageWidth + x) * 3;

        imageData.data[imageIndex] = imageArray[j++];
        imageData.data[imageIndex + 1] = imageArray[j++];
        imageData.data[imageIndex + 2] = imageArray[j++];
        imageData.data[imageIndex + 3] = imageArray[j++];
      }
    }
    this._context2D.putImageData(imageData, 0, 0);
  }

  private async onControllerFinshed(): Promise<void> {
    this._isRunning = false;

    const duration = performance.now() - this._startTime;
    const cores = (this._rayTracerOptions as RayTracerCPUOptions).numOfWorkers;
    const stats = `CPU, cores: ${cores} -- ${this.getStats(duration)}`;

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
        await this.onControllerFinshed();
        break;
      case ControllerCommands.UPDATE:
        this.updateImage((msg as ControllerUpdateMessage).data.imageArray);
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

    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene, true);

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
        tileSize: this._rayTracerOptions.tileSize,
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
