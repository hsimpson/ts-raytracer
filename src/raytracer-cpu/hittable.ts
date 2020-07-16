import Vec3 from '../vec3';
import Ray from './ray';
import BaseMaterial from './basematerial';

export class HitRecord {
  public p: Vec3 = new Vec3();
  public normal: Vec3 = new Vec3();
  public t = 0;
  public front_face = true;
  public mat: BaseMaterial;

  public set_face_normal(r: Ray, outward_normal: Vec3): void {
    this.front_face = Vec3.dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face ? outward_normal : outward_normal.negate();
  }

  public copyTo(dest: HitRecord): void {
    dest.p = this.p;
    dest.normal = this.normal;
    dest.t = this.t;
    dest.front_face = this.front_face;
    dest.mat = this.mat;
  }
}

export interface Hittable {
  hit: (r: Ray, t_min: number, t_max: number, rec: HitRecord) => boolean;
}
