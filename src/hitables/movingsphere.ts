import { vec3, Vec3 } from 'wgpu-matrix';
import { Material } from '../material';
import { getSphereUV } from '../util';
import { AABB } from './aabb';
import { ObjectHitable } from './hitable';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';

export class MovingSphere extends ObjectHitable {
  private readonly _center0: Vec3;
  private readonly _center1: Vec3;
  private readonly _time0: number;
  private readonly _time1: number;
  private readonly _radius: number;

  public constructor(center0: Vec3, center1: Vec3, t0: number, t1: number, radius: number, material: Material) {
    super(material);
    this._center0 = center0;
    this._center1 = center1;
    this._time0 = t0;
    this._time1 = t1;
    this._radius = radius;
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

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const oc = vec3.subtract(transformedRay.origin, this.center(transformedRay.time));

    const a = vec3.lengthSq(transformedRay.direction);
    const half_b = vec3.dot(oc, transformedRay.direction);
    const c = vec3.lengthSq(oc) - this._radius * this._radius;
    const discriminant = half_b * half_b - a * c;

    if (discriminant > 0) {
      const root = Math.sqrt(discriminant);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this.center(transformedRay.time));
        const outward_normal = vec3.scale(pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.material = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);

        const pMinusCenter = vec3.subtract(vec3.create(), rec.p, this.center(transformedRay.time));
        const outward_normal = vec3.scale(pMinusCenter, 1.0 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);

        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.material = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
    }
    return false;
  }

  public center(time: number): Vec3 {
    const timeDiff = (time - this._time0) / (this._time1 - this._time0);
    const centerDiff = vec3.subtract(this._center1, this._center0);

    const centerDiffT = vec3.scale(centerDiff, timeDiff);
    return vec3.add(this._center0, centerDiffT);
  }

  public boundingBox(t0: number, t1: number): AABB {
    const transformedCenterT0 = vec3.transformMat4(vec3.create(), this.center(t0), this.transform.objectToWorld);
    const transformedCenterT1 = vec3.transformMat4(vec3.create(), this.center(t1), this.transform.objectToWorld);

    const r = vec3.fromValues(this._radius, this._radius, this._radius);
    const box0 = new AABB(
      vec3.sub(vec3.create(), transformedCenterT0, r),
      vec3.add(vec3.create(), transformedCenterT0, r),
    );

    const box1 = new AABB(
      vec3.sub(vec3.create(), transformedCenterT1, r),
      vec3.add(vec3.create(), transformedCenterT1, r),
    );

    return AABB.surroundingBox(box0, box1);
  }
}
