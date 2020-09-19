import { serializable } from '../serializing';
import { degreeToRadians } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
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

    const min: Vec3 = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
    const max: Vec3 = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const x = i * this._bbBox.max[0] + (1 - i) * this._bbBox.min[0];
          const y = j * this._bbBox.max[0] + (1 - j) * this._bbBox.min[0];
          const z = k * this._bbBox.max[2] + (1 - k) * this._bbBox.min[2];

          const newx = this._cosTheta * x + this._sinTheta * z;
          const newz = -this._sinTheta * x + this._cosTheta * z;

          const tester = [newx, y, newz];

          min[0] = Math.min(min[0], tester[0]);
          max[0] = Math.max(max[0], tester[0]);

          min[1] = Math.min(min[1], tester[1]);
          max[1] = Math.max(max[1], tester[1]);

          min[2] = Math.min(min[2], tester[2]);
          max[2] = Math.max(max[2], tester[2]);
        }
      }
    }

    this._bbBox = new AABB(min, max);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const origin = Vector.clone(r.origin);
    const direction = Vector.clone(r.direction);

    origin[0] = this._cosTheta * r.origin[0] - this._sinTheta * r.origin[2];
    origin[2] = this._sinTheta * r.origin[0] + this._cosTheta * r.origin[2];

    direction[0] = this._cosTheta * r.direction[0] - this._sinTheta * r.direction[2];
    direction[2] = this._sinTheta * r.direction[0] + this._cosTheta * r.direction[2];

    const rotatedRay = new Ray(origin, direction, r.time);

    if (!this._p.hit(rotatedRay, t_min, t_max, rec)) {
      return false;
    }

    const p = rec.p;
    const normal = rec.normal;

    p[0] = this._cosTheta * rec.p[0] + this._sinTheta * rec.p[2];
    p[2] = -this._sinTheta * rec.p[0] + this._cosTheta * rec.p[2];

    normal[0] = this._cosTheta * rec.normal[0] + this._sinTheta * rec.normal[2];
    normal[2] = -this._sinTheta * rec.normal[0] + this._cosTheta * rec.normal[2];

    rec.p = p;
    rec.setFaceNormal(rotatedRay, normal);

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    this._bbBox.copyTo(outputBox);
    return this._hasBox;
  }
}
