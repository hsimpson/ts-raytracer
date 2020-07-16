import { autoserializeAs } from 'cerializr';
import BaseMaterial from './basematerial';
import { HitRecord } from './hittable';
import Ray from './ray';
import Vec3 from '../vec3';

export default class LambertianMaterial extends BaseMaterial {
  @autoserializeAs(Vec3)
  private albedo: Vec3;

  public constructor(color: Vec3) {
    super();
    this.albedo = color;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vec3.addVec3(rec.normal, Vec3.randomUnitVector());
    new Ray(rec.p, scatter_direction).copyTo(scattered);
    this.albedo.copyTo(attenuation);
    return true;
  }
}
