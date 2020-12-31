import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import { AABB } from './aabb';
import { HitRecord } from './hitrecord';
import { Hittable } from './hittable';
import { Material } from './material';
import { Ray } from './ray';

@serializable
export class XYRect extends Hittable {
  public x0: number;
  public x1: number;
  public y0: number;
  public y1: number;
  public k: number;

  public constructor(x0: number, x1: number, y0: number, y1: number, k: number, material: Material) {
    super();
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.k = k;
    this.material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this.k - r.origin[2]) / r.direction[2];
    if (t < t_min || t > t_max) {
      return false;
    }
    const x = r.origin[0] + t * r.direction[0];
    const y = r.origin[1] + t * r.direction[1];
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;

    const outwardNormal: Vec3 = [0, 0, 1];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this.x0, this.y0, this.k - 0.0001], [this.x1, this.y1, this.k + 0.0001]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}

@serializable
export class XZRect extends Hittable {
  public x0: number;
  public x1: number;
  public z0: number;
  public z1: number;
  public k: number;

  public constructor(x0: number, x1: number, z0: number, z1: number, k: number, material: Material) {
    super();
    this.x0 = x0;
    this.x1 = x1;
    this.z0 = z0;
    this.z1 = z1;
    this.k = k;
    this.material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this.k - r.origin[1]) / r.direction[1];
    if (t < t_min || t > t_max) {
      return false;
    }
    const x = r.origin[0] + t * r.direction[0];
    const z = r.origin[2] + t * r.direction[2];
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;

    const outwardNormal: Vec3 = [0, 1, 0];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this.x0, this.k - 0.0001, this.z0], [this.x1, this.k + 0.0001, this.z1]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}

@serializable
export class YZRect extends Hittable {
  public y0: number;
  public y1: number;
  public z0: number;
  public z1: number;
  public k: number;

  public constructor(y0: number, y1: number, z0: number, z1: number, k: number, material: Material) {
    super();
    this.y0 = y0;
    this.y1 = y1;
    this.z0 = z0;
    this.z1 = z1;
    this.k = k;
    this.material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this.k - r.origin[0]) / r.direction[0];
    if (t < t_min || t > t_max) {
      return false;
    }
    const y = r.origin[1] + t * r.direction[1];
    const z = r.origin[2] + t * r.direction[2];
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;

    const outwardNormal: Vec3 = [1, 0, 0];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this.k - 0.0001, this.y0, this.z0], [this.k + 0.0001, this.y1, this.z1]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}
