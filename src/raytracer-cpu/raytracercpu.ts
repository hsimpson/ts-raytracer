import ControllerWorker from 'worker-loader!./controller.worker';
import { DoneCallback, RaytracerBase } from '../raytracerbase';
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
    private _numOfWorkers: number
  ) {
    super(canvas, imageWidth, imageHeight, samplesPerPixel, maxBounces);
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
    this._isRunning = true;
    this._startTime = performance.now();

    this._controllerWorker.onmessage = (event) => this.onControllerMessage(event);

    const controllerStartMessage: ControllerStartMessage = {
      cmd: ControllerCommands.START,
      data: {
        imageWidth: this._imageWidth,
        imageHeight: this._imageHeight,
        samplesPerPixel: this._samplesPerPixel,
        maxBounces: this._maxBounces,
        computeWorkers: this._numOfWorkers,
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
