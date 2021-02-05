import { serializable } from '../serializing';
import { vec3 } from 'gl-matrix';
import { Ray } from './ray';

@serializable
export class AABB {
  private _min: vec3;
  private _max: vec3;
  private _size: vec3;
  private _center: vec3;

  public constructor(min?: vec3, max?: vec3) {
    this._min = min ?? [0, 0, 0];
    this._max = max ?? [0, 0, 0];

    this._size = [this._max[0] - this._min[0], this._max[1] - this._min[1], this._max[2] - this._min[2]];

    this._center = [
      this._min[0] + this._size[0] / 2,
      this._min[1] + this._size[1] / 2,
      this._min[2] + this._size[2] / 2,
    ];
  }

  public copyTo(dest: AABB): void {
    dest._min = this._min;
    dest._max = this._max;
    dest._size = this._size;
    dest._center = this._center;
  }

  public logBox(): string {
    return `center: ${this._center.toString()} | size: ${this._size.toString()}`;
  }

  public get min(): vec3 {
    return this._min;
  }

  public get max(): vec3 {
    return this._max;
  }

  public hit(ray: Ray, tMin: number, tMax: number): boolean {
    for (let a = 0; a < 3; a++) {
      const rOriginA = ray.origin[a];
      const rDirectionA = ray.direction[a];
      const t0 = Math.min((this._min[a] - rOriginA) / rDirectionA, (this._max[a] - rOriginA) / rDirectionA);
      const t1 = Math.max((this._min[a] - rOriginA) / rDirectionA, (this._max[a] - rOriginA) / rDirectionA);

      tMin = Math.max(t0, tMin);
      tMax = Math.min(t1, tMax);

      if (tMax <= tMin) {
        return false;
      }
    }

    return true;
  }

  // public hit(ray: Ray, tMin: number, tMax: number): boolean {
  //   for (let a = 0; a < 3; a++) {
  //     const invD = 1.0 / ray.direction[a];
  //     let t0 = (this._min[a] - ray.origin[a]) * invD;
  //     let t1 = (this._max[a] - ray.origin[a]) * invD;

  //     if (invD < 0.0) {
  //       const tmp = t0;
  //       t0 = t1;
  //       t1 = tmp;
  //     }
  //     tMin = t0 > tMin ? t0 : tMin;
  //     tMax = t1 < tMax ? t1 : tMax;
  //     if (tMax <= tMin) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  public static surroundingBox(box0: AABB, box1: AABB): AABB {
    const small: vec3 = [
      Math.min(box0.min[0], box1.min[0]),
      Math.min(box0.min[1], box1.min[1]),
      Math.min(box0.min[2], box1.min[2]),
    ];

    const big: vec3 = [
      Math.max(box0.max[0], box1.max[0]),
      Math.max(box0.max[1], box1.max[1]),
      Math.max(box0.max[2], box1.max[2]),
    ];

    return new AABB(small, big);
  }
}
