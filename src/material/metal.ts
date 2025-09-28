import { vec3, Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import { randomInUnitSphere, reflect } from '../util';
import { Material } from './material';

export class MetalMaterial extends Material {
  private readonly _baseColor: Vec3;
  private readonly _roughness: number;

  public constructor(color: Vec3, roughness: number) {
    super();
    this._baseColor = color;
    this._roughness = roughness;
  }

  public get baseColor(): Vec3 {
    return this._baseColor;
  }

  public get roughness(): number {
    return this._roughness;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const refl = reflect(vec3.normalize(r_in.direction), rec.normal);
    const origin = rec.p;
    const direction = vec3.add(refl, vec3.scale(randomInUnitSphere(), this._roughness));

    new Ray(origin, direction, r_in.time).copyTo(scattered);
    vec3.copy(this._baseColor, attenuation);
    return vec3.dot(scattered.direction, rec.normal) > 0;
  }
}
