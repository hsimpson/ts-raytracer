import ControllerWorker from 'worker-loader!./controller.worker';
import { Camera } from '../camera';
import { DoneCallback, RaytracerBase } from '../raytracerbase';
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

export default class RaytracerCPU extends RaytracerBase {
  private _controllerWorker: ControllerWorker;

  public constructor(
    canvas: HTMLCanvasElement,
    imageWidth: number,
    imageHeight: number,
    samplesPerPixel: number,
    maxBounces: number,
    scene: number,
    private _numOfWorkers: number
  ) {
    super(canvas, imageWidth, imageHeight, samplesPerPixel, maxBounces, scene);
    this._controllerWorker = new ControllerWorker();
  }

  private onControllerFinshed(msg: ControllerEndMessage): void {
    this._isRunning = false;
    const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);

    let j = 0;
    for (let i = 0; i < imageData.data.length; ) {
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = msg.data.imageArray[j++];
      imageData.data[i++] = 255;
    }

    this._context2D.putImageData(imageData, 0, 0);

    const duration = performance.now() - this._startTime;
    this.writeStatsToImage(duration);

    if (this._doneCallback) {
      this._doneCallback(duration);
    }
  }

  private onControllerMessage(event): void {
    const msg = event.data as WorkerMessage;
    switch (msg.cmd as ControllerCommands) {
      case ControllerCommands.END:
        this.onControllerFinshed(msg as ControllerEndMessage);
        break;

      default:
        break;
    }
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    this._doneCallback = doneCallback;
    this._context2D = this._canvas.getContext('2d');
    this._isRunning = true;
    this._startTime = performance.now();

    this._controllerWorker.onmessage = (event) => this.onControllerMessage(event);

    const { world, cameraOptions } = await getScene(this._scene);

    const aspectRatio = this._imageWidth / this._imageHeight;

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
        imageWidth: this._imageWidth,
        imageHeight: this._imageHeight,
        samplesPerPixel: this._samplesPerPixel,
        maxBounces: this._maxBounces,
        computeWorkers: this._numOfWorkers,
        sceneIdx: this._scene,
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
    this._numOfWorkers = numOfWorkers;
  }
}
