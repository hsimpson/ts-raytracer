import Vec3 from '../vec3';
import { HitRecord, Hittable } from './hittable';

export default class Ray {
  private _orig: Vec3;
  private _dir: Vec3;

  public constructor(origin?: Vec3, direction?: Vec3) {
    if (origin) {
      this._orig = origin;
    }

    if (direction) {
      this._dir = direction;
    }
  }

  public copyTo(dest: Ray): void {
    dest._orig = this._orig;
    dest._dir = this._dir;
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

  public at(t: number): Vec3 {
    return Vec3.addVec3(this._orig, Vec3.multScalarVec3(this._dir, t));
  }
}

export function rayColor(r: Ray, world: Hittable, depth: number): Vec3 {
  const rec = new HitRecord();
  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) {
    return new Vec3(0, 0, 0);
  }

  if (world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {
    const scattered = new Ray();
    const attenuation = new Vec3();

    if (rec.mat.scatter(r, rec, attenuation, scattered)) {
      return Vec3.multVec3(attenuation, rayColor(scattered, world, depth - 1));
    }
    return new Vec3(0, 0, 0);
  }

  const unit_direction = Vec3.unit_vector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = Vec3.multScalarVec3(new Vec3(1, 1, 1), 1 - t);
  const color2 = Vec3.multScalarVec3(new Vec3(0.5, 0.7, 1.0), t);

  return Vec3.addVec3(color1, color2);
}
