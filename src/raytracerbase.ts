export type DoneCallback = (stats: string) => void;

export interface RayTracerBaseOptions {
  canvas: HTMLCanvasElement;
  imageWidth: number;
  imageHeight: number;
  samplesPerPixel: number;
  maxBounces: number;
  scene: number;
  download: boolean;
  addStatsToImage: boolean;
}

export abstract class RaytracerBase {
  protected _isRunning = false;
  protected _startTime = 0;
  protected _rayTracerOptions: RayTracerBaseOptions;
  protected _doneCallback: DoneCallback;

  // public constructor(rayTracerOptions: RayTracerBaseOptions) {
  //   this._rayTracerOptions = rayTracerOptions;
  // }

  public abstract start(doneCallback?: DoneCallback): Promise<void>;
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
    const stats = `spp: ${this._rayTracerOptions.samplesPerPixel}, max-bounces: ${
      this._rayTracerOptions.maxBounces
    }, rendertime: ${RaytracerBase.msToTimeString(duration)}`;
    console.log(stats);
    return stats;
  }

  protected writeStatsToImage(stats: string, context2D: CanvasRenderingContext2D): void {
    context2D.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context2D.fillRect(0, 0, this._rayTracerOptions.canvas.width, 22);
    context2D.fillStyle = 'rgb(0, 0, 0)';
    context2D.strokeStyle = 'rgb(0, 0, 0)';
    context2D.font = '16px Arial';
    context2D.textBaseline = 'top';
    context2D.fillText(stats, 5, 5);
  }

  protected async downloadImage(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    stats: string
  ): Promise<void> {
    const canvasDownload = async (): Promise<Blob> => {
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/png',
          1.0
        );
      });
    };

    if (this._rayTracerOptions.addStatsToImage) {
      this.writeStatsToImage(stats, context);
    }

    const blob = await canvasDownload();
    const anchor = document.createElement('a');
    anchor.download = 'rendering.png'; // optional, but you can give the file a name
    anchor.href = URL.createObjectURL(blob);
    anchor.click(); // ✨ magic!

    URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory!
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public set imageWidth(imageWidth: number) {
    this._rayTracerOptions.imageWidth = imageWidth;
  }

  public set imageHeight(imageHeight: number) {
    this._rayTracerOptions.imageHeight = imageHeight;
  }

  public set samplesPerPixel(samplesPerPixel: number) {
    this._rayTracerOptions.samplesPerPixel = samplesPerPixel;
  }

  public set maxBounces(maxBounces: number) {
    this._rayTracerOptions.maxBounces = maxBounces;
  }

  public set scene(scene: number) {
    this._rayTracerOptions.scene = scene;
  }

  public set download(download: boolean) {
    this._rayTracerOptions.download = download;
  }

  public set addStatsToImage(addStatsToImage: boolean) {
    this._rayTracerOptions.addStatsToImage = addStatsToImage;
  }
}
