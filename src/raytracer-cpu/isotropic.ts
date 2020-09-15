import { serializable } from '../serializing';
import Vec3 from '../vec3';
import { HitRecord } from './hittable';
import Material from './material';
import Ray from './ray';
import { SolidColor, Texture } from './texture';

@serializable
export class IsoTropic extends Material {
  private _albedo: Texture;

  public constructor(albedo: Vec3 | Texture) {
    super();
    if (albedo instanceof Vec3) {
      this._albedo = new SolidColor(albedo);
    } else {
      this._albedo = albedo;
    }
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    new Ray(rec.p, Vec3.randomInUnitSphere(), r_in.time).copyTo(scattered);
    this._albedo.value(rec.u, rec.v, rec.p).copyTo(attenuation);
    return true;
  }
}
