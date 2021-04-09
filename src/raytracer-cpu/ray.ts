import { vec3 } from 'gl-matrix';
import { Hittable } from '../hittables';
import { HitRecord } from './hitrecord';

export class Ray {
  private _orig: vec3;
  private _dir: vec3;
  private _time: number;

  public constructor(origin?: vec3, direction?: vec3, time = 0.0) {
    if (origin) {
      this._orig = origin;
    }

    if (direction) {
      this._dir = direction;
    }

    this._time = time;
  }

  public copyTo(dest: Ray): void {
    dest._orig = vec3.copy(vec3.create(), this._orig);
    dest._dir = vec3.copy(vec3.create(), this._dir);
    dest._time = this._time;
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

  public get time(): number {
    return this._time;
  }

  public at(t: number): vec3 {
    return vec3.add(vec3.create(), this._orig, vec3.scale(vec3.create(), this._dir, t));
    // return vec3.addvec3(vec3.multScalarvec3(this._orig, 1 - t), vec3.multScalarvec3(this._dir, t));
  }
}

export function rayColor(ray: Ray, background: vec3, world: Hittable, depth: number): vec3 {
  const rec = new HitRecord();
  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) {
    return [0, 0, 0];
  }

  // If the ray hits nothing, return the background color.
  if (!world.hit(ray, 0.001, Number.POSITIVE_INFINITY, rec)) {
    return background;
  }

  const scattered = new Ray();
  const attenuation: vec3 = [0, 0, 0];
  const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);

  if (!rec.mat.scatter(ray, rec, attenuation, scattered)) {
    return emitted;
  }

  //emitted + attenuation * ray_color(scattered, background, world, depth-1);

  return vec3.add(
    vec3.create(),
    emitted,
    vec3.multiply(vec3.create(), attenuation, rayColor(scattered, background, world, depth - 1))
  );

  // return Vector.addVec3(emitted, Vector.multVec3(attenuation, rayColor(scattered, background, world, depth - 1)));

  /*
  const unit_direction = vec3.unitVector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = vec3.multScalarvec3(new vec3(1, 1, 1), 1 - t);
  const color2 = vec3.multScalarvec3(new vec3(0.5, 0.7, 1.0), t);

  return vec3.addvec3(color1, color2);
  */
}

// export function rayColor(ray: Ray, background: vec3, world: Hittable, depth: number): vec3 {
//   const rec = new HitRecord();

//   const color: vec3 = [1.0, 1.0, 1.0];

//   for (let i = 0; i < depth; i++) {
//     if (world.hit(ray, 0.001, Number.POSITIVE_INFINITY, rec)) {
//       const newRay = new Ray();
//       const attenuation = vec3.create();
//       const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);
//       const wasScattered = rec.mat.scatter(ray, rec, attenuation, newRay);
//       ray = newRay;
//       if (wasScattered) {
//         vec3.multiply(color, color, vec3.add(vec3.create(), emitted, attenuation));
//       } else {
//         vec3.multiply(color, color, emitted);
//         break;
//       }
//     } else {
//       vec3.multiply(color, color, background);
//       break;
//     }
//   }

//   return color;
// }
