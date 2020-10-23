import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from './hittable';
import Material from './material';
import Ray from './ray';

@serializable
export default class MetalMaterial extends Material {
  private _baseColor: Vec3;
  private _roughness: number;

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
    const reflect = Vector.reflect(Vector.unitVector(r_in.direction), rec.normal);

    new Ray(
      rec.p,
      Vector.addVec3(reflect, Vector.multScalarVec3(Vector.randomInUnitSphere(), this._roughness)),
      r_in.time
    ).copyTo(scattered);
    Vector.copyTo(this._baseColor, attenuation);
    return Vector.dot(scattered.direction, rec.normal) > 0;
  }
}
