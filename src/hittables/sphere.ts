import { vec3 } from 'gl-matrix';
import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { getSphereUV, lengthSquared } from '../util';
import { AABB } from './aabb';
import { Hittable } from './hittable';

@serializable
export class Sphere extends Hittable {
  private _center: vec3;
  private _radius: number;

  public constructor(center: vec3, radius: number, mat: Material) {
    super();
    this._center = center;
    this._radius = radius;
    this.material = mat;
  }

  public get center(): vec3 {
    return this._center;
  }

  public get radius(): number {
    return this._radius;
  }

  public hit(ray: Ray, tMain: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const oc = vec3.subtract(vec3.create(), transformedRay.origin, this._center);
    const a = lengthSquared(transformedRay.direction);
    const half_b = vec3.dot(oc, transformedRay.direction);
    const c = lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = vec3.create();

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this._center);
        vec3.scale(outward_normal, pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = vec3.create();

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this._center);
        vec3.scale(outward_normal, pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
    }
    return false;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const transformedCenter = vec3.transformMat4(vec3.create(), this._center, this.transform.objectToWorld);

    const r = vec3.fromValues(this._radius, this._radius, this._radius);
    const newOutputBox = new AABB(
      vec3.sub(vec3.create(), transformedCenter, r),
      vec3.add(vec3.create(), transformedCenter, r)
    );
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
