import vec3 from './vec3';

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
    return vec3.multVec3(this._orig, vec3.multSclarVec3(this._dir, t));
  }
}

function hit_sphere(center: vec3, radius: number, r: ray): boolean {
  const oc = vec3.subVec3(r.origin, center);
  const a = vec3.dot(r.direction, r.direction);
  const b = 2 * vec3.dot(oc, r.direction);
  const c = vec3.dot(oc, oc) - radius * radius;
  const discriminat = b * b - 4 * a * c;
  return discriminat > 0;
}

export function ray_color(r: ray): vec3 {
  if (hit_sphere(new vec3(0, 0, -1), 0.5, r)) {
    return new vec3(1, 0, 0);
  }

  const unit_direction = vec3.unit_vector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = vec3.multSclarVec3(new vec3(1, 1, 1), 1 - t);
  const color2 = vec3.multSclarVec3(new vec3(0.5, 0.7, 1.0), t);

  return vec3.addVec3(color1, color2);
}
