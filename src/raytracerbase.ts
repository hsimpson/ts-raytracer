export type DoneCallback = (stats: string) => void;

export abstract class RaytracerBase {
  protected _isRunning = false;
  protected _startTime = 0;
  protected _doneCallback: DoneCallback;

  public constructor(
    protected _canvas: HTMLCanvasElement,
    protected _imageWidth: number,
    protected _imageHeight: number,
    protected _samplesPerPixel: number,
    protected _maxBounces: number,
    protected _scene: number
  ) {}

  public abstract async start(doneCallback?: DoneCallback): Promise<void>;
  public abstract stop(): void;

  private static msToTimeString(duration: number): string {
    duration |= 0; // integer cast (like std::trunc ;-) )
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

  protected getStats(duration: number): string {
    const stats = `spp: ${this._samplesPerPixel}, max-bounces: ${
      this._maxBounces
    }, rendertime: ${RaytracerBase.msToTimeString(duration)}`;
    console.log(stats);
    return stats;
  }

  protected writeStatsToImage(stats: string, context2D: CanvasRenderingContext2D): void {
    context2D.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context2D.fillRect(0, 0, this._canvas.width, 22);
    context2D.fillStyle = 'rgb(0, 0, 0)';
    context2D.strokeStyle = 'rgb(0, 0, 0)';
    context2D.font = '16px Arial';
    context2D.textBaseline = 'top';
    context2D.fillText(stats, 5, 5);
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

  public set scene(scene: number) {
    this._scene = scene;
  }
}
