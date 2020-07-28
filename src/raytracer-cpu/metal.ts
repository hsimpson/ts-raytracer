import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import Vec3 from '../vec3';
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
    const reflect = Vec3.reflect(Vec3.unit_vector(r_in.direction), rec.normal);

    new Ray(
      rec.p,
      Vec3.addVec3(reflect, Vec3.multScalarVec3(Vec3.randomInUnitSphere(), this.roughness)),
      r_in.time
    ).copyTo(scattered);
    this.albedo.copyTo(attenuation);
    return Vec3.dot(scattered.direction, rec.normal) > 0;
  }
}
