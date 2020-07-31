import Vec3 from '../vec3';
import { serializable } from '../serializing';

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
    const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
    if (sines < 0) {
      return this._odd.value(u, v, p);
    } else {
      return this._even.value(u, v, p);
    }
  }
}
