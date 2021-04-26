import { vec3 } from 'gl-matrix';
import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { getSphereUV, lengthSquared } from '../util';
import { AABB } from './aabb';
import { Hittable } from './hittable';

@serializable
export class MovingSphere extends Hittable {
  private _center0: vec3;
  private _center1: vec3;
  private _time0: number;
  private _time1: number;
  private _radius: number;

  public constructor(center0: vec3, center1: vec3, t0: number, t1: number, radius: number, mat: Material) {
    super();
    this._center0 = center0;
    this._center1 = center1;
    this._time0 = t0;
    this._time1 = t1;
    this._radius = radius;
    this.material = mat;
  }

  public get center0(): vec3 {
    return this._center0;
  }

  public get center1(): vec3 {
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

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const oc = vec3.subtract(vec3.create(), transformedRay.origin, this.center(transformedRay.time));

    const a = lengthSquared(transformedRay.direction);
    const half_b = vec3.dot(oc, transformedRay.direction);
    const c = lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = vec3.create();

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this.center(transformedRay.time));
        vec3.scale(outward_normal, pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = vec3.create();

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this.center(transformedRay.time));
        vec3.scale(outward_normal, pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
    }
    return false;
  }

  public center(time: number): vec3 {
    const timeDiff = (time - this._time0) / (this._time1 - this._time0);
    const centerDiff = vec3.subtract(vec3.create(), this._center1, this._center0);

    const centerDiffT = vec3.scale(vec3.create(), centerDiff, timeDiff);
    return vec3.add(vec3.create(), this._center0, centerDiffT);
  }

  public boundingBox(t0: number, t1: number): AABB {
    const transformedCenterT0 = vec3.transformMat4(vec3.create(), this.center(t0), this.transform.objectToWorld);
    const transformedCenterT1 = vec3.transformMat4(vec3.create(), this.center(t1), this.transform.objectToWorld);

    const r = vec3.fromValues(this._radius, this._radius, this._radius);
    const box0 = new AABB(
      vec3.sub(vec3.create(), transformedCenterT0, r),
      vec3.add(vec3.create(), transformedCenterT0, r)
    );

    const box1 = new AABB(
      vec3.sub(vec3.create(), transformedCenterT1, r),
      vec3.add(vec3.create(), transformedCenterT1, r)
    );

    return AABB.surroundingBox(box0, box1);
  }
}
