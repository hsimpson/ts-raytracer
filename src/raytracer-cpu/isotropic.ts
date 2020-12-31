import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from './hitrecord';
import { Material } from './material';
import { Ray } from './ray';
import { SolidColor, Texture } from './texture';

@serializable
export class IsoTropic extends Material {
  private _albedo: Texture;

  public constructor(albedo: Vec3 | Texture) {
    super();
    if (Vector.isVec3(albedo)) {
      this._albedo = new SolidColor(albedo);
    } else {
      this._albedo = albedo;
    }
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    new Ray(rec.p, Vector.randomInUnitSphere(), r_in.time).copyTo(scattered);
    Vector.copyTo(this._albedo.value(rec.u, rec.v, rec.p), attenuation);
    return true;
  }
}
