import { serializable } from '../serializing';
import Vec3 from '../vec3';
import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import Material from './material';
import Ray from './ray';

@serializable
export default class MovingSphere extends Hittable {
  private center0: Vec3;
  private center1: Vec3;
  private time0: number;
  private time1: number;
  private radius: number;
  private mat: Material;

  public constructor(center0: Vec3, center1: Vec3, t0: number, t1: number, radius: number, mat: Material) {
    super();
    this.center0 = center0;
    this.center1 = center1;
    this.time0 = t0;
    this.time1 = t1;
    this.radius = radius;
    this.mat = mat;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const oc = Vec3.subVec3(r.origin, this.center(r.time));
    const a = r.direction.lengthSquared();
    const half_b = Vec3.dot(oc, r.direction);
    const c = oc.lengthSquared() - this.radius * this.radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center(r.time)), this.radius);
        rec.setFaceNormal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center(r.time)), this.radius);
        rec.setFaceNormal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }

  public center(time: number): Vec3 {
    const timeDiff = (time - this.time0) / (this.time1 - this.time0);
    const centerDiff = Vec3.subVec3(this.center1, this.center0);

    return Vec3.addVec3(this.center0, Vec3.multScalarVec3(centerDiff, timeDiff));
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // FIXME!
    /*
    const newOutputBox = new AABB(
      Vec3.subVec3(this.center, new Vec3(this.radius, this.radius, this.radius)),
      Vec3.addVec3(this.center, new Vec3(this.radius, this.radius, this.radius))
    );
    newOutputBox.copyTo(outputBox);
    */
    return true;
  }
}
