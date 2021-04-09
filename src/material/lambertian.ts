import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { SolidColor, Texture } from '../textures';
import { randomUnitVector } from '../util';
import { Material } from './material';

@serializable
export class LambertianMaterial extends Material {
  private _albedo: Texture;

  public constructor(color?: vec3) {
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

  public scatter(ray: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(vec3.create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    vec3.copy(attenuation, col);
    return true;
  }
}
