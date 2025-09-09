import { vec3 } from 'gl-matrix';
import { Texture } from './texture';

export class SolidColor extends Texture {
  private readonly _color: vec3;

  public constructor(color: vec3) {
    super();
    this._color = color;
  }

  public value(_u: number, _v: number, _p: vec3): vec3 {
    return this._color;
  }

  public get color(): vec3 {
    return this._color;
  }
}
