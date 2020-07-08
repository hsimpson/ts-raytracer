import ControllerWorker from 'worker-loader!./controller.worker';
import {
  ControllerCommands,
  ControllerEndMessage,
  ControllerStartMessage,
  ControllerStopMessage,
  WorkerMessage,
} from './workerinterfaces';

export default class Raytracer {
  private _isRunning = false;
  private _imageWidth: number;
  private _imageHeight: number;
  private _samplesPerPixel: number;
  private _maxBounces: number;
  private _onScreenCanvas: HTMLCanvasElement;
  private _context2D: CanvasRenderingContext2D;
  private _controllerWorker: ControllerWorker;
  private _startTime = 0;
  private _numOfWorkers = 1;

  public constructor(
    canvas: HTMLCanvasElement,
    imageWidth: number,
    imageHeight: number,
    samplesPerPixel: number,
    maxBounces: number,
    numOfWorkers: number
  ) {
    this._onScreenCanvas = canvas;
    this._imageWidth = imageWidth;
    this._imageHeight = imageHeight;
    this._samplesPerPixel = samplesPerPixel;
    this._maxBounces = maxBounces;
    this._numOfWorkers = numOfWorkers;

    this._context2D = this._onScreenCanvas.getContext('2d');
  }

  private msToTimeString(duration: number): string {
    duration = Math.floor(duration);
    const ms = duration % 1000;
    duration = (duration - ms) / 1000;
    const secs = duration % 60;
    duration = (duration - secs) / 60;
    const mins = duration % 60;
    const hrs = (duration - mins) / 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms}`;
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
    }, rendertime: ${this.msToTimeString(duration)}`;
    console.log(renderTime);
    this._context2D.font = '16px Arial';
    this._context2D.textBaseline = 'top';
    this._context2D.fillText(renderTime, 5, 5);

    // TODO: send back to GUI
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

  public start(): void {
    this._isRunning = true;
    this._startTime = performance.now();

    this._controllerWorker = new ControllerWorker();

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

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public set imageWidth(imageWidth: number) {
    this._imageWidth = imageWidth;
  }

  public set imageHeight(imageHeight: number) {
    this._imageHeight = imageHeight;
  }

  public set samplesPerPixel(samplesPerPixel: number) {
    this._samplesPerPixel = samplesPerPixel;
  }

  public set maxBounces(maxBounces: number) {
    this._maxBounces = maxBounces;
  }

  public set numOfWorkers(numOfWorkers: number) {
    this._numOfWorkers = numOfWorkers;
  }
}
