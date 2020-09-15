import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord, Hittable } from './hittable';

export default class Ray {
  private _orig: Vec3;
  private _dir: Vec3;
  private _time: number;

  public constructor(origin?: Vec3, direction?: Vec3, time = 0.0) {
    if (origin) {
      this._orig = origin;
    }

    if (direction) {
      this._dir = direction;
    }

    this._time = time;
  }

  public copyTo(dest: Ray): void {
    dest._orig = this._orig;
    dest._dir = this._dir;
    dest._time = this._time;
  }

  public get origin(): Vec3 {
    return this._orig;
  }

  public set origin(origin: Vec3) {
    this._orig = origin;
  }

  public get direction(): Vec3 {
    return this._dir;
  }

  public set direction(direction: Vec3) {
    this._dir = direction;
  }

  public get time(): number {
    return this._time;
  }

  public at(t: number): Vec3 {
    return Vector.addVec3(this._orig, Vector.multScalarVec3(this._dir, t));
  }
}

export function rayColor(r: Ray, background: Vec3, world: Hittable, depth: number): Vec3 {
  const rec = new HitRecord();
  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) {
    return [0, 0, 0];
  }

  // If the ray hits nothing, return the background color.
  if (!world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {
    return background;
  }

  const scattered = new Ray();
  const attenuation: Vec3 = [0, 0, 0];
  const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);

  if (!rec.mat.scatter(r, rec, attenuation, scattered)) {
    return emitted;
  }

  return Vector.addVec3(emitted, Vector.multVec3(attenuation, rayColor(scattered, background, world, depth - 1)));

  /*
  const unit_direction = Vec3.unitVector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = Vec3.multScalarVec3(new Vec3(1, 1, 1), 1 - t);
  const color2 = Vec3.multScalarVec3(new Vec3(0.5, 0.7, 1.0), t);

  return Vec3.addVec3(color1, color2);
  */
}
