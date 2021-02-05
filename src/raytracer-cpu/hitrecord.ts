import { vec3 } from 'gl-matrix';
import { Material } from '../material';
import { Ray } from './ray';

export class HitRecord {
  public p = vec3.create();
  public normal = vec3.create();
  public t = 0;
  public u = 0;
  public v = 0;
  public frontFace = true;
  public mat: Material;

  public setFaceNormal(r: Ray, outward_normal: vec3): void {
    this.frontFace = vec3.dot(r.direction, outward_normal) < 0;
    this.normal = this.frontFace ? outward_normal : vec3.negate(vec3.create(), outward_normal);
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
