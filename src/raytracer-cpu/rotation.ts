import { serializable } from '../serializing';
import { degreeToRadians } from '../util';
import Vec3 from '../vec3';
import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import Ray from './ray';

@serializable
export class RotateY extends Hittable {
  private _p: Hittable;
  private _sinTheta: number;
  private _cosTheta: number;
  private _hasBox: boolean;
  private _bbBox: AABB = new AABB();

  public constructor(p: Hittable, angle: number) {
    super();
    this._p = p;
    const radians = degreeToRadians(angle);
    this._sinTheta = Math.sin(radians);
    this._cosTheta = Math.cos(radians);
    this._hasBox = this._p.boundingBox(0, 1, this._bbBox);

    const min = new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const max = new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const x = i * this._bbBox.max.x + (1 - i) * this._bbBox.min.x;
          const y = j * this._bbBox.max.y + (1 - j) * this._bbBox.min.y;
          const z = k * this._bbBox.max.z + (1 - k) * this._bbBox.min.z;

          const newx = this._cosTheta * x + this._sinTheta * z;
          const newz = -this._sinTheta * x + this._cosTheta * z;

          const tester = new Vec3(newx, y, newz);

          min.x = Math.min(min.x, tester.x);
          max.x = Math.max(max.x, tester.x);

          min.y = Math.min(min.y, tester.y);
          max.y = Math.max(max.y, tester.y);

          min.z = Math.min(min.z, tester.z);
          max.z = Math.max(max.z, tester.z);
        }
      }
    }

    this._bbBox = new AABB(min, max);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const origin = r.origin.clone();
    const direction = r.direction.clone();

    origin.x = this._cosTheta * r.origin.x - this._sinTheta * r.origin.z;
    origin.z = this._sinTheta * r.origin.x + this._cosTheta * r.origin.z;

    direction.x = this._cosTheta * r.direction.x - this._sinTheta * r.direction.z;
    direction.z = this._sinTheta * r.direction.x + this._cosTheta * r.direction.z;

    const rotatedRay = new Ray(origin, direction, r.time);

    if (!this._p.hit(rotatedRay, t_min, t_max, rec)) {
      return false;
    }

    const p = rec.p;
    const normal = rec.normal;

    p.x = this._cosTheta * rec.p.x + this._sinTheta * rec.p.z;
    p.z = -this._sinTheta * rec.p.x + this._cosTheta * rec.p.z;

    normal.x = this._cosTheta * rec.normal.x + this._sinTheta * rec.normal.z;
    normal.z = -this._sinTheta * rec.normal.x + this._cosTheta * rec.normal.z;

    rec.p = p;
    rec.setFaceNormal(rotatedRay, normal);

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    this._bbBox.copyTo(outputBox);
    return this._hasBox;
  }
}
