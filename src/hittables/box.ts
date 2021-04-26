import { vec3 } from 'gl-matrix';
import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { AABB } from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { Hittable } from './hittable';
import { HittableList } from './hittablelist';

@serializable
export class Box extends Hittable {
  private _boxMin: vec3;
  private _boxMax: vec3;
  private _sides = new HittableList();

  public constructor(p0: vec3, p1: vec3, mat: Material) {
    super();
    this._boxMin = p0;
    this._boxMax = p1;

    this._sides.add(new XYRect(p0[0], p1[0], p0[1], p1[1], p1[2], mat));
    this._sides.add(new XYRect(p0[0], p1[0], p0[1], p1[1], p0[2], mat));

    this._sides.add(new XZRect(p0[0], p1[0], p0[2], p1[2], p1[1], mat));
    this._sides.add(new XZRect(p0[0], p1[0], p0[2], p1[2], p0[1], mat));

    this._sides.add(new YZRect(p0[1], p1[1], p0[2], p1[2], p1[0], mat));
    this._sides.add(new YZRect(p0[1], p1[1], p0[2], p1[2], p0[0], mat));
  }

  public get sides(): HittableList {
    return this._sides;
  }

  public hit(ray: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    if (!this._sides.hit(transformedRay, t_min, t_max, rec)) {
      return false;
    }

    this.transform.transformRecord(transformedRay, rec);

    return true;
  }

  public boundingBox(_t0: number, _t1: number): AABB {
    const transformedMin = vec3.transformMat4(vec3.create(), this._boxMin, this.transform.objectToWorld);
    const transformedMax = vec3.transformMat4(vec3.create(), this._boxMax, this.transform.objectToWorld);

    return new AABB(transformedMin, transformedMax);
  }
}
