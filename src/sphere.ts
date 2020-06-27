import vec3 from './vec3';
import ray from './ray';
import { hittable, hit_record } from './hittable';
import material from './material';

export default class sphere extends hittable {
  private center: vec3;
  private radius: number;
  private mat: material;

  public constructor(center: vec3, radius: number, mat: material) {
    super();
    this.center = center;
    this.radius = radius;
    this.mat = mat;
  }

  public hit(r: ray, t_min: number, t_max: number, rec: hit_record): boolean {
    const oc = vec3.subVec3(r.origin, this.center);
    const a = r.direction.length_squared();
    const half_b = vec3.dot(oc, r.direction);
    const c = oc.length_squared() - this.radius * this.radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = vec3.divScalarVec(vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = vec3.divScalarVec(vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }
}
