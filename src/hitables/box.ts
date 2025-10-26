import { vec3, Vec3 } from 'wgpu-matrix';
import { Material } from '../material';
import { AABB } from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { Hitable } from './hitable';
import { HitableList } from './hitablelist';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';

export class Box extends Hitable {
  private readonly _boxMin: Vec3;
  private readonly _boxMax: Vec3;
  private readonly _sides = new HitableList();

  public constructor(p0: Vec3, p1: Vec3, mat: Material) {
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

  public get sides(): HitableList {
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
    const transformedMin = vec3.transformMat4(this._boxMin, this.transform.objectToWorld);
    const transformedMax = vec3.transformMat4(this._boxMax, this.transform.objectToWorld);

    return new AABB(transformedMin, transformedMax);
  }
}
