import { vec3, Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hitables/hitrecord';
import { Ray } from '../hitables/ray';
import { SolidColor, Texture } from '../textures';
import { randomUnitVector } from '../util';
import { Material } from './material';

export class LambertianMaterial extends Material {
  private _albedo!: Texture;

  public constructor(color?: Vec3) {
    super();
    if (color) {
      this._albedo = new SolidColor(color);
    }
  }

  public override set texture(texture: Texture) {
    this._albedo = texture;
  }

  public override get texture(): Texture {
    return this._albedo;
  }

  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    vec3.copy(attenuation, col);
    return true;
  }
}
