import type { Vec3 } from '../vec3';
import Ray from './ray';
import { serializable } from '../serializing';

@serializable
export class AABB {
  private _min: Vec3;
  private _max: Vec3;

  public constructor(min?: Vec3, max?: Vec3) {
    this._min = min ?? [0, 0, 0];
    this._max = max ?? [0, 0, 0];
  }

  public copyTo(dest: AABB): void {
    dest._min = this._min;
    dest._max = this._max;
  }

  public get min(): Vec3 {
    return this._min;
  }

  public get max(): Vec3 {
    return this._max;
  }

  /*
  public hit(r: Ray, tmin: number, tmax: number): boolean {
    for (let a = 0; a < 3; a++) {
      const rOriginA = r.origin.array[a];
      const rDirectionA = r.direction.array[a];
      const t0 = Math.min((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);
      const t1 = Math.max((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);

      tmin = Math.max(t0, tmin);
      tmax = Math.min(t1, tmax);

      if (tmax <= tmin) {
        return false;
      }
    }

    return true;
  }*/

  public hit(r: Ray, tmin: number, tmax: number): boolean {
    for (let a = 0; a < 3; a++) {
      const invD = 1.0 / r.direction[a];
      let t0 = (this._min[a] - r.origin[a]) * invD;
      let t1 = (this._max[a] - r.origin[a]) * invD;

      if (invD < 0.0) {
        const tmp = t0;
        t0 = t1;
        t1 = tmp;
      }
      tmin = t0 > tmin ? t0 : tmin;
      tmax = t1 < tmax ? t1 : tmax;
      if (tmax <= tmin) {
        return false;
      }
    }

    return true;
  }

  public static surroundingBox(box0: AABB, box1: AABB): AABB {
    const small: Vec3 = [
      Math.min(box0.min[0], box1.min[0]),
      Math.min(box0.min[1], box1.min[1]),
      Math.min(box0.min[2], box1.min[2]),
    ];

    const big: Vec3 = [
      Math.max(box0.max[0], box1.max[0]),
      Math.max(box0.max[1], box1.max[1]),
      Math.max(box0.max[2], box1.max[2]),
    ];

    return new AABB(small, big);
  }
}
