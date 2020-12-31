import { serializable } from '../serializing';
import { getSphereUV } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { AABB } from './aabb';
import { HitRecord } from './hitrecord';
import { Hittable } from './hittable';
import { Material } from './material';
import { Ray } from './ray';

@serializable
export class MovingSphere extends Hittable {
  private _center0: Vec3;
  private _center1: Vec3;
  private _time0: number;
  private _time1: number;
  private _radius: number;

  public constructor(center0: Vec3, center1: Vec3, t0: number, t1: number, radius: number, mat: Material) {
    super();
    this._center0 = center0;
    this._center1 = center1;
    this._time0 = t0;
    this._time1 = t1;
    this._radius = radius;
    this.material = mat;
  }

  public get center0(): Vec3 {
    return this._center0;
  }

  public get center1(): Vec3 {
    return this._center1;
  }

  public get radius(): number {
    return this._radius;
  }

  public get time0(): number {
    return this._time0;
  }

  public get time1(): number {
    return this._time1;
  }

  public hit(ray: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const oc = Vector.subVec3(transformedRay.origin, this.center(transformedRay.time));
    const a = Vector.lengthSquared(transformedRay.direction);
    const half_b = Vector.dot(oc, transformedRay.direction);
    const c = Vector.lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = Vector.divScalarVec(
          Vector.subVec3(rec.p, this.center(transformedRay.time)),
          this._radius
        );
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(
          Vector.divScalarVec(Vector.subVec3(rec.p, this.center(transformedRay.time)), this._radius)
        );
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = Vector.divScalarVec(
          Vector.subVec3(rec.p, this.center(transformedRay.time)),
          this._radius
        );
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(
          Vector.divScalarVec(Vector.subVec3(rec.p, this.center(transformedRay.time)), this._radius)
        );
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
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
