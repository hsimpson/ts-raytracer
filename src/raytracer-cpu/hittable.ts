import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import Ray from './ray';
import Material from './material';
import AABB from './aabb';

export class HitRecord {
  public p: Vec3 = [0, 0, 0];
  public normal: Vec3 = [0, 0, 0];
  public t = 0;
  public u = 0;
  public v = 0;
  public frontFace = true;
  public mat: Material;

  public setFaceNormal(r: Ray, outward_normal: Vec3): void {
    this.frontFace = Vector.dot(r.direction, outward_normal) < 0;
    this.normal = this.frontFace ? outward_normal : Vector.negate(outward_normal);
  }

  public copyTo(dest: HitRecord): void {
    dest.p = this.p;
    dest.normal = this.normal;
    dest.t = this.t;
    dest.u = this.u;
    dest.v = this.v;
    dest.frontFace = this.frontFace;
    dest.mat = this.mat;
  }
}

export abstract class Hittable {
  public abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  public abstract boundingBox(t0: number, t1: number, outputBox: AABB): boolean;
}
