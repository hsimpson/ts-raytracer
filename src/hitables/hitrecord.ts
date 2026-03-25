import { Vec3, vec3 } from 'wgpu-matrix';
import { Material } from '../material';
import { Ray } from './ray';

export class HitRecord {
  public p = vec3.zero();
  public normal = vec3.zero();
  public t = 0;
  public u = 0;
  public v = 0;
  public frontFace = true;
  public material?: Material;

  public setFaceNormal(r: Ray, outward_normal: Vec3): void {
    this.frontFace = vec3.dot(r.direction, outward_normal) < 0;
    this.normal = this.frontFace ? outward_normal : vec3.negate(outward_normal);
  }

  public copyTo(dest: HitRecord): void {
    dest.p = vec3.copy(vec3.create(), this.p);
    dest.normal = vec3.copy(vec3.create(), this.normal);
    dest.t = this.t;
    dest.u = this.u;
    dest.v = this.v;
    dest.frontFace = this.frontFace;
    dest.material = this.material; // FIXME deep copy;
  }
}
