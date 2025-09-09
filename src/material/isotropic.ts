import { vec3 } from 'gl-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import { SolidColor, Texture } from '../textures';
import { randomInUnitSphere } from '../util';
import { Material } from './material';

export class IsoTropic extends Material {
  private readonly _albedo: Texture;

  public constructor(albedo: vec3 | Texture) {
    super();
    if (albedo instanceof Texture) {
      this._albedo = albedo;
    } else {
      this._albedo = new SolidColor(albedo);
    }
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    new Ray(rec.p, randomInUnitSphere(), r_in.time).copyTo(scattered);
    vec3.copy(attenuation, this._albedo.value(rec.u, rec.v, rec.p));
    return true;
  }
}
