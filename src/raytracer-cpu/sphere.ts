import Material from './material';
import { HitRecord, Hittable } from './hittable';
import Ray from './ray';
import Vec3 from '../vec3';
import AABB from './aabb';
import { serializable } from '../serializing';

function getSphereUV(p: Vec3): { u: number; v: number } {
  const phi = Math.atan2(p.z, p.x);
  const theta = Math.asin(p.y);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}

@serializable
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
        rec.setFaceNormal(r, outward_normal);
        const uv = getSphereUV(Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius);
        rec.setFaceNormal(r, outward_normal);
        const uv = getSphereUV(Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const newOutputBox = new AABB(
      Vec3.subVec3(this.center, new Vec3(this.radius, this.radius, this.radius)),
      Vec3.addVec3(this.center, new Vec3(this.radius, this.radius, this.radius))
    );
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
