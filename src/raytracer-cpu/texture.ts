import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';
import Perlin from './perlin';
import { clamp } from '../util';

export abstract class Texture {
  public abstract value(u: number, v: number, p: Vec3): Vec3;
}

@serializable
export class SolidColor extends Texture {
  private _color: Vec3;

  public constructor(color: Vec3) {
    super();
    this._color = color;
  }

  public value(_u: number, _v: number, _p: Vec3): Vec3 {
    return this._color;
  }

  public get color(): Vec3 {
    return this._color;
  }
}

@serializable
export class CheckerTexture extends Texture {
  private _odd: Texture;
  private _even: Texture;

  public constructor(odd: Vec3, even: Vec3) {
    super();
    this._odd = new SolidColor(odd);
    this._even = new SolidColor(even);
  }

  public value(u: number, v: number, p: Vec3): Vec3 {
    const sines = Math.sin(10 * p[0]) * Math.sin(10 * p[1]) * Math.sin(10 * p[2]);
    if (sines < 0) {
      return this._odd.value(u, v, p);
    } else {
      return this._even.value(u, v, p);
    }
  }

  public get odd(): Vec3 {
    return (this._odd as SolidColor).color;
  }

  public get even(): Vec3 {
    return (this._even as SolidColor).color;
  }
}

@serializable
export class NoiseTexture extends Texture {
  private _noise = new Perlin();
  private _scale: number;

  public constructor(scale: number) {
    super();
    this._scale = scale;
  }

  public get scale(): number {
    return this._scale;
  }

  public value(u: number, v: number, p: Vec3): Vec3 {
    // return Vec3.multScalarVec3(
    //   Vec3.multScalarVec3(new Vec3(1, 1, 1), 0.5),
    //   1.0 + this._noise.noise(Vec3.multScalarVec3(p, this._scale))
    // );

    //return Vec3.multScalarVec3(new Vec3(1, 1, 1), this._noise.turb(Vec3.multScalarVec3(p, this._scale)));

    return Vector.multScalarVec3(
      Vector.multScalarVec3([1, 1, 1], 0.5),
      1.0 + Math.sin(this._scale * p[2] + 10 * this._noise.turb(p))
    );
  }
}

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

  public value(u: number, v: number, _p: Vec3): Vec3 {
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
