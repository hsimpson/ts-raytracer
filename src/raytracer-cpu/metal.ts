import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';

@serializable
export default class MetalMaterial extends Material {
  private albedo: Vec3;
  private roughness: number;

  public constructor(color: Vec3, roughness: number) {
    super();
    this.albedo = color;
    this.roughness = roughness;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const reflect = Vector.reflect(Vector.unitVector(r_in.direction), rec.normal);

    new Ray(
      rec.p,
      Vector.addVec3(reflect, Vector.multScalarVec3(Vector.randomInUnitSphere(), this.roughness)),
      r_in.time
    ).copyTo(scattered);
    Vector.copyTo(this.albedo, attenuation);
    return Vector.dot(scattered.direction, rec.normal) > 0;
  }
}
