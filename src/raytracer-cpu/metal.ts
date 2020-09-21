import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';

@serializable
export default class MetalMaterial extends Material {
  private _albedo: Vec3;
  private _roughness: number;

  public constructor(color: Vec3, roughness: number) {
    super();
    this._albedo = color;
    this._roughness = roughness;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const reflect = Vector.reflect(Vector.unitVector(r_in.direction), rec.normal);

    new Ray(
      rec.p,
      Vector.addVec3(reflect, Vector.multScalarVec3(Vector.randomInUnitSphere(), this._roughness)),
      r_in.time
    ).copyTo(scattered);
    Vector.copyTo(this._albedo, attenuation);
    return Vector.dot(scattered.direction, rec.normal) > 0;
  }
}
