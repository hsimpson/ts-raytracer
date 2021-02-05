import { serializable } from '../serializing';
import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Material } from './material';
import { Ray } from '../raytracer-cpu/ray';
import { reflect, randomInUnitSphere } from '../util';

@serializable
export class MetalMaterial extends Material {
  private _baseColor: vec3;
  private _roughness: number;

  public constructor(color: vec3, roughness: number) {
    super();
    this._baseColor = color;
    this._roughness = roughness;
  }

  public get baseColor(): vec3 {
    return this._baseColor;
  }

  public get roughness(): number {
    return this._roughness;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    const refl = reflect(vec3.normalize(vec3.create(), r_in.direction), rec.normal);

    new Ray(
      rec.p,
      vec3.add(vec3.create(), refl, vec3.scale(vec3.create(), randomInUnitSphere(), this._roughness)),
      r_in.time
    ).copyTo(scattered);
    vec3.copy(attenuation, this._baseColor);
    return vec3.dot(scattered.direction, rec.normal) > 0;
  }
}
