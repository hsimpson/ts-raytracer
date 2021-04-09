import { vec3 } from 'gl-matrix';
// import { snoise } from './simplex3dnoise';
import SimplexNoise from 'simplex-noise';
import { serializable } from '../serializing';
import { Perlin } from './perlin';
import { Texture } from './texture';

const RANDOMSEED = 'just a random seed string';
@serializable
export class NoiseTexture extends Texture {
  private _noise = new Perlin();
  private _scale: number;
  private _simplexNoise: SimplexNoise;

  public constructor(scale: number) {
    super();
    this._scale = scale;
  }

  public get scale(): number {
    return this._scale;
  }

  public turb(p: vec3, depth = 7): number {
    if (!this._simplexNoise) {
      this._simplexNoise = new SimplexNoise(RANDOMSEED);
    }

    let accum = 0.0;
    const tempP = p;
    let weight = 1.0;
    for (let i = 0; i < depth; i++) {
      // accum += weight * snoise(tempP);
      accum += weight * this._simplexNoise.noise3D(p[0], p[1], p[2]);
      weight *= 0.5;
      vec3.scale(tempP, tempP, 2.0);
    }

    return Math.abs(accum);
  }

  public value(u: number, v: number, p: vec3): vec3 {
    return vec3.scale(
      vec3.create(),
      vec3.scale(vec3.create(), vec3.fromValues(1, 1, 1), 0.5),
      1.0 + Math.sin(this._scale * p[2] + 10.0 * this.turb(p))
    );
  }
}
