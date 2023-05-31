import { Camera } from '../camera';
import { HittableList } from '../hittables';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { serialize } from '../serializing';
import { ComputeTile, createComputeTiles } from '../tiles';
import ComputeWorker from './compute.worker?worker';
import ControllerWorker from './controller.worker?worker';
import {
  ComputeCommands,
  ComputeEndMessage,
  ComputeInitMessage,
  ComputeReadyMessage,
  ComputeStartMessage,
  ControllerCommands,
  ControllerStartMessage,
  ControllerStopMessage,
  ControllerUpdateMessage,
  WorkerMessage,
} from './workerinterfaces';

export interface RayTracerCPUOptions extends RayTracerBaseOptions {
  numOfWorkers: number;
}

export class RaytracerCPU extends RaytracerBase {
  private _controllerWorker = new ControllerWorker();
  private _context2D: CanvasRenderingContext2D;
  private _computeWorkers: Map<number, Worker> = new Map<number, Worker>();
  private _computeTiles: ComputeTile[] = [];
  private _imageArray: Uint8ClampedArray;

  public constructor(rayTracerCPUOptions: RayTracerCPUOptions) {
    super();
    this._rayTracerOptions = rayTracerCPUOptions;
  }

  private updateImage(): void {
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

        imageData.data[imageIndex] = this._imageArray[j++];
        imageData.data[imageIndex + 1] = this._imageArray[j++];
        imageData.data[imageIndex + 2] = this._imageArray[j++];
        imageData.data[imageIndex + 3] = this._imageArray[j++];
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
      await this.downloadImage(this._context2D, stats);
    }

    if (this._doneCallback) {
      this._doneCallback(stats);
    }
  }

  private async onControllerMessage(event: MessageEvent): Promise<void> {
    const msg = event.data as WorkerMessage;
    switch (msg.cmd as ControllerCommands) {
      case ControllerCommands.READY:
        await this.createComputeWorkers();
        break;
      case ControllerCommands.END:
        await this.onControllerFinshed();
        break;
      case ControllerCommands.UPDATE:
        this._imageArray = (msg as ControllerUpdateMessage).data.imageArray;
        this.updateImage();
        break;
      default:
        break;
    }
  }

  private onWorkerMessage(event: MessageEvent): void {
    const workerMsg = event.data as WorkerMessage;

    switch (workerMsg.cmd as ComputeCommands) {
      case ComputeCommands.READY: {
        const readyMsg = workerMsg as ComputeReadyMessage;
        this.startComputeWorker(readyMsg.data.workerId);
        break;
      }
      case ComputeCommands.END: {
        const endMsg = workerMsg as ComputeEndMessage;
        endMsg.cmd = ControllerCommands.WORKERDONE;

        this._controllerWorker.postMessage(workerMsg);

        if (this._computeTiles.length) {
          this.startComputeWorker(endMsg.data.workerId);
        } else {
          this.stopComputeWorker(endMsg.data.workerId); // no more tiles to render
        }
        break;
      }

      default:
        break;
    }
  }

  private async createComputeWorkers(): Promise<void> {
    const options = this._rayTracerOptions as RayTracerCPUOptions;

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

    for (let workerId = 0; workerId < options.numOfWorkers; workerId++) {
      const worker = new ComputeWorker();
      worker.onmessage = (event) => this.onWorkerMessage(event);
      this._computeWorkers.set(workerId, worker);

      const computeInitMessage: ComputeInitMessage = {
        cmd: ComputeCommands.INIT,
        data: {
          workerId,
          camera: serialize(Camera, camera),
          world: serialize(HittableList, world),
          background: cameraOptions.background,
          imageWidth: options.imageWidth,
          imageHeight: options.imageHeight,
          samplesPerPixel: options.samplesPerPixel,
          maxBounces: options.maxBounces,
        },
      };
      worker.postMessage(computeInitMessage);
    }
  }

  private startComputeWorker(workerId: number): void {
    const worker = this._computeWorkers.get(workerId);
    const tile = this._computeTiles.shift();

    const computeStartMessage: ComputeStartMessage = {
      cmd: ComputeCommands.START,
      data: {
        ...tile,
      },
    };
    worker.postMessage(computeStartMessage);
  }

  private stopComputeWorker(workerId: number): void {
    this._computeWorkers.get(workerId).terminate();
    this._computeWorkers.delete(workerId);

    if (this._computeWorkers.size === 0) {
      this.updateImage();
      this.stop();
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async start(doneCallback?: DoneCallback): Promise<void> {
    this._doneCallback = doneCallback;
    this._context2D = this._rayTracerOptions.canvas.getContext('2d');
    this._isRunning = true;
    this._startTime = performance.now();

    this._controllerWorker.onmessage = async (event) => this.onControllerMessage(event);

    const controllerStartMessage: ControllerStartMessage = {
      cmd: ControllerCommands.START,
      data: {
        imageWidth: this._rayTracerOptions.imageWidth,
        imageHeight: this._rayTracerOptions.imageHeight,
        samplesPerPixel: this._rayTracerOptions.samplesPerPixel,
        maxBounces: this._rayTracerOptions.maxBounces,
        computeWorkers: (this._rayTracerOptions as RayTracerCPUOptions).numOfWorkers,
        sceneIdx: this._rayTracerOptions.scene,
        tileSize: this._rayTracerOptions.tileSize,
      },
    };

    this._controllerWorker.postMessage(controllerStartMessage);

    this._computeTiles = createComputeTiles(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight,
      this._rayTracerOptions.tileSize
    );
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
