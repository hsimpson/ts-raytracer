import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from './hitrecord';
import { Material } from './material';
import { Ray } from './ray';
import { SolidColor, Texture } from './texture';

@serializable
export class LambertianMaterial extends Material {
  private _albedo: Texture;

  public constructor(color?: Vec3) {
    super();
    if (color) {
      this._albedo = new SolidColor(color);
    }
  }

  public set texture(texture: Texture) {
    this._albedo = texture;
  }

  public get texture(): Texture {
    return this._albedo;
  }

  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    Vector.copyTo(col, attenuation);
    return true;
  }
}
