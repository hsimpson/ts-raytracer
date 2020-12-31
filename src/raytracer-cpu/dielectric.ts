import { serializable } from '../serializing';
import { randomNumber } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from './hitrecord';
import { Material } from './material';
import { Ray } from './ray';

@serializable
export class DielectricMaterial extends Material {
  private _indexOfRefraction: number;

  public constructor(refIdx: number) {
    super();
    this._indexOfRefraction = refIdx;
  }

  public get indexOfRefraction(): number {
    return this._indexOfRefraction;
  }

  public schlick(cosine: number, refIdx: number): number {
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    Vector.set(attenuation, 1.0, 1.0, 1.0);
    const etai_over_etat = rec.frontFace ? 1 / this._indexOfRefraction : this._indexOfRefraction;

    const unit_direction = Vector.unitVector(r_in.direction);

    const cos_theta = Math.min(Vector.dot(Vector.negate(unit_direction), rec.normal), 1);
    const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);
    if (etai_over_etat * sin_theta > 1) {
      const reflected = Vector.reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, r_in.time).copyTo(scattered);
      return true;
    }

    const reflect_prob = this.schlick(cos_theta, etai_over_etat);
    if (randomNumber() < reflect_prob) {
      const reflected = Vector.reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, r_in.time).copyTo(scattered);
      return true;
    }

    const refracted = Vector.refract(unit_direction, rec.normal, etai_over_etat);
    new Ray(rec.p, refracted, r_in.time).copyTo(scattered);
    return true;
  }
}
