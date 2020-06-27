import vec3 from './vec3';
import { hit_record, hittable } from './hittable';

export default class ray {
  private _orig: vec3;
  private _dir: vec3;

  public constructor(origin?: vec3, direction?: vec3) {
    if (origin) {
      this._orig = origin;
    }

    if (direction) {
      this._dir = direction;
    }
  }

  public copyTo(dest: ray): void {
    dest._orig = this._orig;
    dest._dir = this._dir;
  }

  public get origin(): vec3 {
    return this._orig;
  }

  public set origin(origin: vec3) {
    this._orig = origin;
  }

  public get direction(): vec3 {
    return this._dir;
  }

  public set direction(direction: vec3) {
    this._dir = direction;
  }

  public at(t: number): vec3 {
    return vec3.addVec3(this._orig, vec3.multScalarVec3(this._dir, t));
  }
}

export function ray_color(r: ray, world: hittable, depth: number): vec3 {
  const rec = new hit_record();
  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) {
    return new vec3(0, 0, 0);
  }

  if (world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {
    const scattered = new ray();
    const attenuation = new vec3();

    if (rec.mat.scatter(r, rec, attenuation, scattered)) {
      return vec3.multVec3(attenuation, ray_color(scattered, world, depth - 1));
    }
    return new vec3(0, 0, 0);
  }

  const unit_direction = vec3.unit_vector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = vec3.multScalarVec3(new vec3(1, 1, 1), 1 - t);
  const color2 = vec3.multScalarVec3(new vec3(0.5, 0.7, 1.0), t);

  return vec3.addVec3(color1, color2);
}
