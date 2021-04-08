import { vec3 } from 'gl-matrix';
import { serializable } from '../serializing';
import { Perlin } from './perlin';
import { Texture } from './texture';

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

  public value(u: number, v: number, p: vec3): vec3 {
    // return vec3.multScalarvec3(
    //   vec3.multScalarvec3(new vec3(1, 1, 1), 0.5),
    //   1.0 + this._noise.noise(vec3.multScalarvec3(p, this._scale))
    // );

    //return vec3.multScalarvec3(new vec3(1, 1, 1), this._noise.turb(vec3.multScalarvec3(p, this._scale)));

    return vec3.scale(
      vec3.create(),
      vec3.scale(vec3.create(), vec3.fromValues(1, 1, 1), 0.5),
      1.0 + Math.sin(this._scale * p[2] + 10 * this._noise.turb(p))
    );
  }
}
