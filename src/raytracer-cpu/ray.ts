import { vec3 } from 'gl-matrix';
import { World } from '../world';
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

export function rayColor(ray: Ray, background: vec3, world: World, depth: number): vec3 {
  // initialize with 0,0,0;
  const L = vec3.create();

  const rec = new HitRecord();

  // If the ray hits nothing, return the background color.
  if (!world.objects.hit(ray, 0.001, Number.POSITIVE_INFINITY, rec)) {
    // return background;
    return L;
  }

  // const wo = vec3.negate(vec3.create(), ray.direction);

  const newRay = new Ray();
  const attenuation = vec3.create();
  rec.mat.scatter(ray, rec, attenuation, newRay);

  // Add contribution of each light
  for (const light of world.lights) {
    const wi = vec3.subtract(vec3.create(), light.postion, rec.p);
    vec3.normalize(wi, wi);
    const pdf = 1.0;

    // check if no object hit (light is visible)
    const shadowRay = new Ray(rec.p, wi, 1.0);
    const shadowRec = new HitRecord();
    if (!world.objects.hit(shadowRay, 0.001, Number.POSITIVE_INFINITY, shadowRec)) {
      // const f = bsdf(wi, wo);
      // Li = I / DistanceSquared(pLight, ref.p);
      //L += f * Li * AbsDot(wi, n) / pdf;

      const lightIntensity = light.intensity / vec3.squaredDistance(light.postion, rec.p);

      const LdotN = Math.abs(vec3.dot(wi, rec.normal));

      vec3.add(
        L,
        L,
        vec3.scale(
          vec3.create(),
          vec3.scale(vec3.create(), vec3.scale(vec3.create(), attenuation, lightIntensity), LdotN),
          1 / pdf
        )
      );

      // vec3.add(L, L, vec3.scale(vec3.create(), attenuation, (lightIntensity * LdotN) / pdf));
    }
  }

  if (--depth >= 0) {
    vec3.add(L, L, rayColor(newRay, background, world, depth));
  }
  return L;
}

/*
  const rec = new HitRecord();

  // const ambient = background;
  const color = vec3.fromValues(1, 1, 1);

  for (let i = 0; i < depth; i++) {
    if (world.objects.hit(ray, 0.001, Number.POSITIVE_INFINITY, rec)) {
      const newRay = new Ray();
      const attenuation = vec3.create();
      const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);
      const wasScattered = rec.mat.scatter(ray, rec, attenuation, newRay);

      

      ray = newRay;

      if (wasScattered) {
        // lights
        vec3.multiply(color, color, vec3.add(vec3.create(), emitted, attenuation));
      } else {
        vec3.multiply(color, color, emitted);
        break;
      }
    } else {
      vec3.multiply(color, color, background);
      break;
    }
  }

  // pixel = (lightColor * NdotL) * materialColor + ambientFactor
  return color;

  */

/*
  
  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) {
    return [0, 0, 0];
  }

  // If the ray hits nothing, return the background color.
  if (!world.objects.hit(ray, 0.001, Number.POSITIVE_INFINITY, rec)) {
    return background;
  }

  const scattered = new Ray();
  const attenuation: vec3 = [0, 0, 0];
  const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);

  if (!rec.mat.scatter(ray, rec, attenuation, scattered)) {
    return emitted;
  }

  for (const light of world.lights) {
    const lightDir = vec3.subtract(vec3.create(), light.postion, rec.p);

    vec3.normalize(lightDir, lightDir);
    const shadowRay = new Ray(rec.p, lightDir, ray.time);
    const shadowRec = new HitRecord();

    if (!world.objects.hit(shadowRay, 0.001, Number.POSITIVE_INFINITY, shadowRec)) {
      // const NdotL = Math.max(0, vec3.dot(rec.normal, lightDir));
      const NdotL = vec3.dot(rec.normal, lightDir);
      const lightFactor = vec3.scale(vec3.create(), light.color, NdotL);

      vec3.add(attenuation, attenuation, lightFactor);
    } else {
      // shadow
    }
  }

  // pixel = (lightColor * NdotL) * materialColor + ambientFactor

  //emitted + attenuation * ray_color(scattered, background, world, depth-1);

  return vec3.add(
    vec3.create(),
    emitted,
    vec3.multiply(vec3.create(), attenuation, rayColor(scattered, background, world, depth - 1))
  );
  */

// return Vector.addVec3(emitted, Vector.multVec3(attenuation, rayColor(scattered, background, world, depth - 1)));

/*
  const unit_direction = vec3.unitVector(r.direction);
  const t = 0.5 * (unit_direction.y + 1);
  const color1 = vec3.multScalarvec3(new vec3(1, 1, 1), 1 - t);
  const color2 = vec3.multScalarvec3(new vec3(0.5, 0.7, 1.0), t);

  return vec3.addvec3(color1, color2);
  */

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
