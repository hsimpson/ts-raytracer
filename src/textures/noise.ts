// import { snoise } from './simplex3dnoise';
import alea from 'alea';
import { createNoise3D } from 'simplex-noise';
import { vec3, Vec3 } from 'wgpu-matrix';
import { Texture } from './texture';

// create a random number generator based on a seed string
const prng = alea('just a random seed string');
const noise3D = createNoise3D(prng);

export class NoiseTexture extends Texture {
  // private readonly _noise = new Perlin();
  private readonly _scale: number;
  // private _simplexNoise: SimplexNoise;

  public constructor(scale: number) {
    super();
    this._scale = scale;
  }

  public get scale(): number {
    return this._scale;
  }

  public turb(p: Vec3, depth = 7): number {
    // if (!this._simplexNoise) {
    //   this._simplexNoise = new SimplexNoise(RANDOMSEED);
    // }

    let accum = 0.0;
    const tempP = p;
    let weight = 1.0;
    for (let i = 0; i < depth; i++) {
      // accum += weight * snoise(tempP);
      accum += weight * noise3D(p[0], p[1], p[2]);
      weight *= 0.5;
      vec3.scale(tempP, 2.0, tempP);
    }

    return Math.abs(accum);
  }

  public value(_u: number, _v: number, p: Vec3): Vec3 {
    return vec3.scale(
      vec3.scale(vec3.fromValues(1, 1, 1), 0.5),
      1.0 + Math.sin(this._scale * p[2] + 10.0 * this.turb(p)),
    );
  }
}
