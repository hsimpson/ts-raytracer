import vec3 from './vec3';
import ray from './ray';
import material from './material';

export class hit_record {
  public p: vec3 = new vec3();
  public normal: vec3 = new vec3();
  public t = 0;
  public front_face = true;
  public mat: material;

  public set_face_normal(r: ray, outward_normal: vec3): void {
    this.front_face = vec3.dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face ? outward_normal : outward_normal.negate();
  }

  public copyTo(dest: hit_record): void {
    dest.p = this.p;
    dest.normal = this.normal;
    dest.t = this.t;
    dest.front_face = this.front_face;
    dest.mat = this.mat;
  }
}

export abstract class hittable {
  public abstract hit(r: ray, t_min: number, t_max: number, rec: hit_record): boolean;
}
