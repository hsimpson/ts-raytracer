import { serializable } from '../serializing';
import Vec3 from '../vec3';
import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import Ray from './ray';

@serializable
export default class Translate extends Hittable {
  private _p: Hittable;
  private _offset: Vec3;

  public constructor(p: Hittable, offset: Vec3) {
    super();
    this._p = p;
    this._offset = offset;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const movedRay = new Ray(Vec3.subVec3(r.origin, this._offset), r.direction, r.time);
    if (!this._p.hit(movedRay, t_min, t_max, rec)) {
      return false;
    }

    rec.p = Vec3.addVec3(rec.p, this._offset);
    rec.setFaceNormal(movedRay, rec.normal);

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    if (!this._p.boundingBox(t0, t1, outputBox)) {
      return false;
    }

    const newOutputBox = new AABB(Vec3.addVec3(outputBox.min, this._offset), Vec3.addVec3(outputBox.max, this._offset));
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
