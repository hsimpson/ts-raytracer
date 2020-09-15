import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import Material from './material';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import { serializable } from '../serializing';

@serializable
export class XYRect extends Hittable {
  private _material: Material;
  private _x0: number;
  private _x1: number;
  private _y0: number;
  private _y1: number;
  private _k: number;

  public constructor(x0: number, x1: number, y0: number, y1: number, k: number, material: Material) {
    super();
    this._x0 = x0;
    this._x1 = x1;
    this._y0 = y0;
    this._y1 = y1;
    this._k = k;
    this._material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this._k - r.origin[2]) / r.direction[2];
    if (t < t_min || t > t_max) {
      return false;
    }
    const x = r.origin[0] + t * r.direction[0];
    const y = r.origin[1] + t * r.direction[1];
    if (x < this._x0 || x > this._x1 || y < this._y0 || y > this._y1) {
      return false;
    }
    rec.u = (x - this._x0) / (this._x1 - this._x0);
    rec.v = (y - this._y0) / (this._y1 - this._y0);
    rec.t = t;

    const outwardNormal: Vec3 = [0, 0, 1];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this._material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this._x0, this._y0, this._k - 0.0001], [this._x1, this._y1, this._k + 0.0001]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}

@serializable
export class XZRect extends Hittable {
  private _material: Material;
  private _x0: number;
  private _x1: number;
  private _z0: number;
  private _z1: number;
  private _k: number;

  public constructor(x0: number, x1: number, z0: number, z1: number, k: number, material: Material) {
    super();
    this._x0 = x0;
    this._x1 = x1;
    this._z0 = z0;
    this._z1 = z1;
    this._k = k;
    this._material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this._k - r.origin[1]) / r.direction[1];
    if (t < t_min || t > t_max) {
      return false;
    }
    const x = r.origin[0] + t * r.direction[0];
    const z = r.origin[2] + t * r.direction[2];
    if (x < this._x0 || x > this._x1 || z < this._z0 || z > this._z1) {
      return false;
    }
    rec.u = (x - this._x0) / (this._x1 - this._x0);
    rec.v = (z - this._z0) / (this._z1 - this._z0);
    rec.t = t;

    const outwardNormal: Vec3 = [0, 1, 0];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this._material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this._x0, this._k - 0.0001, this._z0], [this._x1, this._k + 0.0001, this._z1]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}

@serializable
export class YZRect extends Hittable {
  private _material: Material;
  private _y0: number;
  private _y1: number;
  private _z0: number;
  private _z1: number;
  private _k: number;

  public constructor(y0: number, y1: number, z0: number, z1: number, k: number, material: Material) {
    super();
    this._y0 = y0;
    this._y1 = y1;
    this._z0 = z0;
    this._z1 = z1;
    this._k = k;
    this._material = material;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const t = (this._k - r.origin[0]) / r.direction[0];
    if (t < t_min || t > t_max) {
      return false;
    }
    const y = r.origin[1] + t * r.direction[1];
    const z = r.origin[2] + t * r.direction[2];
    if (y < this._y0 || y > this._y1 || z < this._z0 || z > this._z1) {
      return false;
    }
    rec.u = (y - this._y0) / (this._y1 - this._y0);
    rec.v = (z - this._z0) / (this._z1 - this._z0);
    rec.t = t;

    const outwardNormal: Vec3 = [1, 0, 0];
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this._material;
    rec.p = r.at(t);
    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    // The bounding box must have non-zero width in each dimension, so pad the Z
    // dimension a small amount.

    const newOutputBox = new AABB([this._k - 0.0001, this._y0, this._z0], [this._k + 0.0001, this._y1, this._z1]);
    newOutputBox.copyTo(outputBox);

    return true;
  }
}
