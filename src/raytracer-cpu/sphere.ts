import Material from './material';
import { HitRecord, Hittable } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { AABB } from './aabb';
import { serializable } from '../serializing';

function getSphereUV(p: Vec3): { u: number; v: number } {
  const phi = Math.atan2(p[2], p[0]);
  const theta = Math.asin(p[1]);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}

@serializable
export class Sphere extends Hittable {
  private _center: Vec3;
  private _radius: number;

  public constructor(center: Vec3, radius: number, mat: Material) {
    super();
    this._center = center;
    this._radius = radius;
    this.material = mat;
  }

  public get center(): Vec3 {
    return this._center;
  }

  public get radius(): number {
    return this._radius;
  }

  public hit(ray: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const transformedRay = this._transformRay(ray);

    const oc = Vector.subVec3(transformedRay.origin, this._center);
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
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this._transformRecord(transformedRay, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this._transformRecord(transformedRay, rec);
        return true;
      }
    }
    return false;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const newOutputBox = new AABB(
      Vector.subVec3(this._center, [this._radius, this._radius, this._radius]),
      Vector.addVec3(this._center, [this._radius, this._radius, this._radius])
    );
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
