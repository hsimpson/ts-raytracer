export type DoneCallback = (duration: number) => void;

export abstract class RaytracerBase {
  protected _isRunning = false;
  protected _startTime = 0;
  protected _doneCallback: DoneCallback;

  public constructor(
    protected _canvas: HTMLCanvasElement,
    protected _imageWidth: number,
    protected _imageHeight: number,
    protected _samplesPerPixel: number,
    protected _maxBounces: number
  ) {}

  public abstract async start(doneCallback?: DoneCallback): Promise<void>;
  public abstract stop(): void;

  protected static msToTimeString(duration: number): string {
    duration = Math.floor(duration);
    const ms = duration % 1000;
    duration = (duration - ms) / 1000;
    const secs = duration % 60;
    duration = (duration - secs) / 60;
    const mins = duration % 60;
    const hrs = (duration - mins) / 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
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
}
