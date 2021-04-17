import { vec3 } from 'gl-matrix';
import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { AABB } from './aabb';
import { Hittable } from './hittable';

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

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const t = (this.k - transformedRay.origin[2]) / transformedRay.direction[2];
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = transformedRay.origin[0] + t * transformedRay.direction[0];
    const y = transformedRay.origin[1] + t * transformedRay.direction[1];
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;

    const outwardNormal: vec3 = [0, 0, 1];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);

    this.transform.transformRecord(transformedRay, rec);

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

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const t = (this.k - transformedRay.origin[1]) / transformedRay.direction[1];
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = transformedRay.origin[0] + t * transformedRay.direction[0];
    const z = transformedRay.origin[2] + t * transformedRay.direction[2];
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;

    const outwardNormal: vec3 = [0, 1, 0];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);

    this.transform.transformRecord(transformedRay, rec);
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

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const t = (this.k - transformedRay.origin[0]) / transformedRay.direction[0];
    if (t < tMin || t > tMax) {
      return false;
    }
    const y = transformedRay.origin[1] + t * transformedRay.direction[1];
    const z = transformedRay.origin[2] + t * transformedRay.direction[2];
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;

    const outwardNormal: vec3 = [1, 0, 0];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);

    this.transform.transformRecord(transformedRay, rec);
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
