import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import AABB from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { HitRecord, Hittable } from './hittable';
import { HittableList } from './hittablelist';
import Material from './material';
import Ray from './ray';

@serializable
export default class Box extends Hittable {
  private _boxMin: Vec3;
  private _boxMax: Vec3;
  private _sides = new HittableList();

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

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    return this._sides.hit(r, t_min, t_max, rec);
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const newOutputBox = new AABB(this._boxMin, this._boxMax);
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
