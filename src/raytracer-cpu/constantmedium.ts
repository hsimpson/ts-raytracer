import { serializable } from '../serializing';
import { randomNumber } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import AABB from './aabb';
import { HitRecord, Hittable } from './hittable';
import { IsoTropic } from './isotropic';
import Material from './material';
import Ray from './ray';
import { Texture } from './texture';

@serializable
export class ConstantMedium extends Hittable {
  private _boundary: Hittable;
  private _phaseFunction: Material;
  private _negInvDensity: number;

  public constructor(boundary: Hittable, density: number, material: Vec3 | Texture) {
    super();
    this._boundary = boundary;
    this._negInvDensity = -1 / density;
    this._phaseFunction = new IsoTropic(material);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const enableDebug = false;
    const debugging = enableDebug && randomNumber() < 0.00001;

    const rec1 = new HitRecord();
    const rec2 = new HitRecord();

    if (!this._boundary.hit(r, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, rec1)) {
      return false;
    }

    if (!this._boundary.hit(r, rec1.t + 0.0001, Number.POSITIVE_INFINITY, rec2)) {
      return false;
    }

    if (debugging) {
      console.log(`t0=${rec1.t}, t1=${rec2.t}`);
    }

    if (rec1.t < t_min) {
      rec1.t = t_min;
    }

    if (rec2.t > t_max) {
      rec2.t = t_max;
    }

    if (rec1.t >= rec2.t) {
      return false;
    }

    if (rec1.t < 0) {
      rec1.t = 0;
    }

    const rayLength = Vector.length(r.direction);
    const distanceInsideBoundary = (rec2.t - rec1.t) * rayLength;
    const hitDistance = this._negInvDensity * Math.log(randomNumber());

    if (hitDistance > distanceInsideBoundary) {
      return false;
    }

    rec.t = rec1.t + hitDistance / rayLength;
    rec.p = r.at(rec.t);

    if (debugging) {
      console.log(`hitDistance = ${hitDistance}\n
                   rec.t = ${rec.t}\n
                   rec.p = ${rec.p}
      `);
    }

    rec.normal = [1, 0, 0]; // arbitrary
    rec.frontFace = true; // also arbitrary
    rec.mat = this._phaseFunction;

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    return this._boundary.boundingBox(t0, t1, outputBox);
  }
}
