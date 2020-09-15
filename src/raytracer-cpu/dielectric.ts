import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import { randomNumber } from '../util';
import Vec3 from '../vec3';
import { serializable } from '../serializing';

@serializable
export default class DielectricMaterial extends Material {
  private _refIdx: number;

  public constructor(refIdx: number) {
    super();
    this._refIdx = refIdx;
  }

  public schlick(cosine: number, refIdx: number): number {
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    attenuation.set(1.0, 1.0, 1.0);
    const etai_over_etat = rec.frontFace ? 1 / this._refIdx : this._refIdx;

    const unit_direction = Vec3.unitVector(r_in.direction);

    const cos_theta = Math.min(Vec3.dot(unit_direction.negate(), rec.normal), 1);
    const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);
    if (etai_over_etat * sin_theta > 1) {
      const reflected = Vec3.reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, r_in.time).copyTo(scattered);
      return true;
    }

    const reflect_prob = this.schlick(cos_theta, etai_over_etat);
    if (randomNumber() < reflect_prob) {
      const reflected = Vec3.reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, r_in.time).copyTo(scattered);
      return true;
    }

    const refracted = Vec3.refract(unit_direction, rec.normal, etai_over_etat);
    new Ray(rec.p, refracted, r_in.time).copyTo(scattered);
    return true;
  }
}
