import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { randomNumber, reflect, refract } from '../util';
import { Material } from './material';

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

  public scatter(ray: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    vec3.set(attenuation, 1.0, 1.0, 1.0);
    const etai_over_etat = rec.frontFace ? 1 / this._indexOfRefraction : this._indexOfRefraction;

    const unit_direction = vec3.normalize(vec3.create(), ray.direction);

    const cos_theta = Math.min(vec3.dot(vec3.negate(vec3.create(), unit_direction), rec.normal), 1);
    const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);
    if (etai_over_etat * sin_theta > 1) {
      const reflected = reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, ray.time).copyTo(scattered);
      return true;
    }

    const reflect_prob = this.schlick(cos_theta, etai_over_etat);
    if (randomNumber() < reflect_prob) {
      const reflected = reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, ray.time).copyTo(scattered);
      return true;
    }

    const refracted = refract(unit_direction, rec.normal, etai_over_etat);
    new Ray(rec.p, refracted, ray.time).copyTo(scattered);
    return true;
  }
}
