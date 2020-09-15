import { serializable } from '../serializing';
import Vec3 from '../vec3';
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

    this._sides.add(new XYRect(p0.x, p1.x, p0.y, p1.y, p1.z, mat));
    this._sides.add(new XYRect(p0.x, p1.x, p0.y, p1.y, p0.z, mat));

    this._sides.add(new XZRect(p0.x, p1.x, p0.z, p1.z, p1.y, mat));
    this._sides.add(new XZRect(p0.x, p1.x, p0.z, p1.z, p0.y, mat));

    this._sides.add(new YZRect(p0.y, p1.y, p0.z, p1.z, p1.x, mat));
    this._sides.add(new YZRect(p0.y, p1.y, p0.z, p1.z, p0.x, mat));
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
