import { vec3 } from 'gl-matrix';
import { serializable } from '../serializing';
import { Texture } from './texture';
import { clamp } from '../util';

@serializable
export class ImageTexture extends Texture {
  private _width = 0;
  private _height = 0;
  private _bytesPerScanLine = 0;
  private _data: Uint8ClampedArray;
  private _url = '';
  private static BytesPerPixel = 4;

  public constructor() {
    super();
  }

  public async load(imageUrl: string): Promise<void> {
    this._url = imageUrl;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imgBitmap = await window.createImageBitmap(blob);

    // Firefox do not support 2D context on OffscreenCanvas :-(
    //const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0);

    const imgData = ctx.getImageData(0, 0, imgBitmap.width, imgBitmap.height);
    this._width = imgData.width;
    this._height = imgData.height;
    this._data = imgData.data;
    this._bytesPerScanLine = ImageTexture.BytesPerPixel * this._width;
  }

  public value(u: number, v: number, _p: vec3): vec3 {
    // If we have no texture data, then return solid cyan as a debugging aid.
    if (!this._data || this._data.length === 0) {
      return [0, 1, 1];
    }

    // Clamp input texture coordinates to [0,1] x [1,0]
    u = clamp(u, 0.0, 1.0);
    v = 1.0 - clamp(v, 0.0, 1.0); // Flip V to image coordinates

    let i = Math.trunc(u * this._width);
    let j = Math.trunc(v * this._height);

    // Clamp integer mapping, since actual coordinates should be less than 1.0
    if (i >= this._width) i = this._width - 1;
    if (j >= this._height) j = this._height - 1;

    const colorScale = 1.0 / 255.0;

    let pixelOffset = j * this._bytesPerScanLine + i * ImageTexture.BytesPerPixel;

    return [
      this._data[pixelOffset++] * colorScale,
      this._data[pixelOffset++] * colorScale,
      this._data[pixelOffset++] * colorScale,
    ];
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get data(): Uint8ClampedArray {
    return this._data;
  }

  public get url(): string {
    return this._url;
  }
}
