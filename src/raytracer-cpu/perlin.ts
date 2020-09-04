import { randomNumber, randomInt } from '../util';
import Vec3 from '../vec3';
import { serializable } from '../serializing';

@serializable
export default class Perlin {
  private static _pointCount = 256;
  private _ranVecs: Array<Vec3>;
  private _permX: Array<number>;
  private _permY: Array<number>;
  private _permZ: Array<number>;

  public constructor() {
    this._ranVecs = new Array<Vec3>(Perlin._pointCount);
    for (let i = 0; i < Perlin._pointCount; i++) {
      this._ranVecs[i] = Vec3.unitVector(Vec3.randomRange(-1, 1));
    }

    this._permX = Perlin.perlinGeneratePerm();
    this._permY = Perlin.perlinGeneratePerm();
    this._permZ = Perlin.perlinGeneratePerm();
  }

  public noise(p: Vec3): number {
    let u = p.x - Math.floor(p.x);
    let v = p.y - Math.floor(p.y);
    let w = p.z - Math.floor(p.z);

    // const i = Math.trunc(4 * p.x) & 255;
    // const j = Math.trunc(4 * p.y) & 255;
    // const k = Math.trunc(4 * p.z) & 255;

    u = u * u * (3 - 2 * u);
    v = v * v * (3 - 2 * v);
    w = w * w * (3 - 2 * w);

    const i = Math.floor(p.x);
    const j = Math.floor(p.y);
    const k = Math.floor(p.z);

    const c: Vec3[][][] = [
      [[], []],
      [[], []],
    ];

    for (let di = 0; di < 2; di++)
      for (let dj = 0; dj < 2; dj++)
        for (let dk = 0; dk < 2; dk++)
          c[di][dj][dk] = this._ranVecs[
            this._permX[(i + di) & 255] ^ this._permY[(j + dj) & 255] ^ this._permZ[(k + dk) & 255]
          ];

    // const noise = this._ranFloat[this._permX[i] ^ this._permY[j] ^ this._permZ[k]];
    const noise = trilinearInterp(c, u, v, w);
    return noise;
  }

  public turb(p: Vec3, depth = 7): number {
    let accum = 0.0;
    let temp_p = p;
    let weight = 1.0;
    for (let i = 0; i < depth; i++) {
      accum += weight * this.noise(temp_p);
      weight *= 0.5;
      temp_p = Vec3.multScalarVec3(temp_p, 2);
    }

    return Math.abs(accum);
  }

  private static perlinGeneratePerm(): Array<number> {
    const array = new Array<number>(Perlin._pointCount);

    for (let i = 0; i < Perlin._pointCount; i++) {
      array[i] = i;
    }

    Perlin.permute(array, Perlin._pointCount);

    return array;
  }

  private static permute(array: Array<number>, n: number): void {
    for (let i = n - 1; i > 0; i--) {
      const target = randomInt(0, i);
      const tmp = array[i];
      array[i] = array[target];
      array[target] = tmp;
    }
  }
}

function trilinearInterp(c: Vec3[][][], u: number, v: number, w: number): number {
  const uu = u * u * (3 - 2 * u);
  const vv = v * v * (3 - 2 * v);
  const ww = w * w * (3 - 2 * w);
  let accum = 0.0;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const weight = new Vec3(u - i, v - j, w - k);
        // prettier-ignore
        accum += (i * uu + (1 - i) * (1 - uu))
               * (j * vv + (1 - j) * (1 - vv))
               * (k * ww + (1 - k) * (1 - ww))
               * Vec3.dot(c[i][j][k], weight);
      }
    }
  }

  return accum;
}
