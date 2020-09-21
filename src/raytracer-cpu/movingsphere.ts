import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import Material from './material';
import Ray from './ray';

@serializable
export default class MovingSphere extends Hittable {
  private _center0: Vec3;
  private _center1: Vec3;
  private _time0: number;
  private _time1: number;
  private _radius: number;
  private _material: Material;

  public constructor(center0: Vec3, center1: Vec3, t0: number, t1: number, radius: number, mat: Material) {
    super();
    this._center0 = center0;
    this._center1 = center1;
    this._time0 = t0;
    this._time1 = t1;
    this._radius = radius;
    this._material = mat;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const oc = Vector.subVec3(r.origin, this.center(r.time));
    const a = Vector.lengthSquared(r.direction);
    const half_b = Vector.dot(oc, r.direction);
    const c = Vector.lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this.center(r.time)), this._radius);
        rec.setFaceNormal(r, outward_normal);
        rec.mat = this._material;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this.center(r.time)), this._radius);
        rec.setFaceNormal(r, outward_normal);
        rec.mat = this._material;
        return true;
      }
    }
    return false;
  }

  public center(time: number): Vec3 {
    const timeDiff = (time - this._time0) / (this._time1 - this._time0);
    const centerDiff = Vector.subVec3(this._center1, this._center0);

    return Vector.addVec3(this._center0, Vector.multScalarVec3(centerDiff, timeDiff));
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const box0 = new AABB(
      Vector.subVec3(this.center(t0), [this._radius, this._radius, this._radius]),
      Vector.addVec3(this.center(t0), [this._radius, this._radius, this._radius])
    );

    const box1 = new AABB(
      Vector.subVec3(this.center(t1), [this._radius, this._radius, this._radius]),
      Vector.addVec3(this.center(t1), [this._radius, this._radius, this._radius])
    );

    const newOutputBox = AABB.surroundingBox(box0, box1);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}
