import Vec3 from './vec3';
import Ray from './ray';
import { Hittable, HitRecord } from './hittable';
import Material from './material';

export default class Sphere extends Hittable {
  private center: Vec3;
  private radius: number;
  private mat: Material;

  public constructor(center: Vec3, radius: number, mat: Material) {
    super();
    this.center = center;
    this.radius = radius;
    this.mat = mat;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const oc = Vec3.subVec3(r.origin, this.center);
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
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }
}
