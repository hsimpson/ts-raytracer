import { vec3, Vec3 } from 'wgpu-matrix';
import { Material } from '../material';
import { getSphereUV } from '../util';
import { AABB } from './aabb';
import { ObjectHitable } from './hitable';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';

export class Sphere extends ObjectHitable {
  private readonly _center: Vec3;
  private readonly _radius: number;

  public constructor(center: Vec3, radius: number, material: Material) {
    super(material);
    this._center = center;
    this._radius = radius;
  }

  public get center(): Vec3 {
    return this._center;
  }

  public get radius(): number {
    return this._radius;
  }

  public hit(ray: Ray, tMain: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const oc = vec3.subtract(transformedRay.origin, this._center);
    const a = vec3.lengthSq(transformedRay.direction);
    const half_b = vec3.dot(oc, transformedRay.direction);
    const c = vec3.lengthSq(oc) - this._radius * this._radius;
    const discriminant = half_b * half_b - a * c;

    if (discriminant > 0) {
      const root = Math.sqrt(discriminant);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);

        const pMinusCenter = vec3.subtract(rec.p, this._center);
        const outward_normal = vec3.scale(pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.material = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);

        const pMinusCenter = vec3.subtract(rec.p, this._center);
        const outward_normal = vec3.scale(pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.material = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
    }
    return false;
  }

  public boundingBox(_t0: number, _t1: number): AABB {
    const transformedCenter = vec3.transformMat4(vec3.create(), this._center, this.transform.objectToWorld);

    const r = vec3.fromValues(this._radius, this._radius, this._radius);
    return new AABB(vec3.sub(vec3.create(), transformedCenter, r), vec3.add(vec3.create(), transformedCenter, r));
  }
}
