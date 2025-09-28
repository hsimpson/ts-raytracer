import { Vec3 } from 'wgpu-matrix';
import { Texture } from './texture';

export class SolidColor extends Texture {
  private readonly _color: Vec3;

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
