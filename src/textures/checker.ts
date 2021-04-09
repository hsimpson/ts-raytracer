import { vec3 } from 'gl-matrix';
import { serializable } from '../serializing';
import { SolidColor } from './solidcolor';
import { Texture } from './texture';

@serializable
export class CheckerTexture extends Texture {
  private _odd: Texture;
  private _even: Texture;
  private _scale: number;

  public constructor(odd: vec3, even: vec3, scale?: number) {
    super();
    this._odd = new SolidColor(odd);
    this._even = new SolidColor(even);
    this._scale = scale || 5;
  }

  private modulo(x: number): number {
    return x - Math.floor(x);
  }

  public value(u: number, v: number, p: vec3): vec3 {
    const x = this.modulo(u * this._scale) < 0.5;
    const y = this.modulo(v * this._scale) < 0.5;

    if (x ? !y : y) {
      return this._even.value(u, v, p);
    } else {
      return this._odd.value(u, v, p);
    }
  }

  public get odd(): vec3 {
    return (this._odd as SolidColor).color;
  }

  public get even(): vec3 {
    return (this._even as SolidColor).color;
  }

  public get scale(): number {
    return this._scale;
  }
}
