import Vec3 from '../vec3';
import Ray from './ray';
import { serializable } from '../serializing';

@serializable
export default class AABB {
  private _min: Vec3;
  private _max: Vec3;

  public constructor(min?: Vec3, max?: Vec3) {
    this._min = min ?? new Vec3();
    this._max = max ?? new Vec3();
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
      const invD = 1.0 / r.direction.array[a];
      let t0 = (this._min.array[a] - r.origin.array[a]) * invD;
      let t1 = (this._max.array[a] - r.origin.array[a]) * invD;

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
    const small = new Vec3(
      Math.min(box0.min.x, box1.min.x),
      Math.min(box0.min.y, box1.min.y),
      Math.min(box0.min.z, box1.min.z)
    );

    const big = new Vec3(
      Math.max(box0.max.x, box1.max.x),
      Math.max(box0.max.y, box1.max.y),
      Math.max(box0.max.z, box1.max.z)
    );

    return new AABB(small, big);
  }
}
