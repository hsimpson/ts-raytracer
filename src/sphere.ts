import {
  autoserializeAs,
  inheritSerialization,
  InstantiationMethod,
  JsonObject,
  Serialize,
  Deserialize,
} from 'cerializr';
import BaseMaterial from './basematerial';
import BaseObject from './baseobject';
import { HitRecord } from './hittable';
import LambertianMaterial from './lambertian';
import MetalMaterial from './metal';
import DielectricMaterial from './dielectric';
import Ray from './ray';
import Vec3 from './vec3';

@inheritSerialization(BaseObject)
export default class Sphere extends BaseObject {
  @autoserializeAs(Vec3)
  private center: Vec3;
  @autoserializeAs(Number)
  private radius: number;
  @autoserializeAs(BaseMaterial)
  private mat: BaseMaterial;

  public constructor(center: Vec3, radius: number, mat: BaseMaterial) {
    super();
    this.center = center;
    this.radius = radius;
    this.mat = mat;
  }

  public static onSerialized(json: JsonObject, instance: Sphere): JsonObject {
    switch (instance.mat.constructor.name) {
      case 'LambertianMaterial':
        json.mat = Serialize(instance.mat, LambertianMaterial);
        json.mat.type = 'LambertianMaterial';
        break;
      case 'MetalMaterial':
        json.mat = Serialize(instance.mat, MetalMaterial);
        json.mat.type = 'MetalMaterial';
        break;
      case 'DielectricMaterial':
        json.mat = Serialize(instance.mat, DielectricMaterial);
        json.mat.type = 'DielectricMaterial';
        break;
    }
    return json;
  }

  public static onDeserialized(
    data: JsonObject,
    instance: Sphere,
    instantiationMethod: InstantiationMethod = InstantiationMethod.New
  ): Sphere | void {
    if (!instance) {
      switch (instantiationMethod) {
        /*
        case InstantiationMethod.New:
          instance = new Sphere(data.center, data.radius, data.mat);
          break;
        */
        case InstantiationMethod.ObjectCreate:
          instance = Object.create(Sphere.prototype);
          break;
        default:
          instance = {} as Sphere;
          break;
      }
    }
    const mat = data.mat as any;
    switch (mat.type) {
      case 'LambertianMaterial':
        instance.mat = Deserialize(mat, LambertianMaterial, null, InstantiationMethod.ObjectCreate);
        break;
      case 'MetalMaterial':
        instance.mat = Deserialize(mat, MetalMaterial, null, InstantiationMethod.ObjectCreate);
        break;
      case 'DielectricMaterial':
        instance.mat = Deserialize(mat, DielectricMaterial, null, InstantiationMethod.ObjectCreate);
        break;
    }
    return instance;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const oc = Vec3.subVec3(r.origin, this.center);
    const a = r.direction.lengthSquared();
    const half_b = Vec3.dot(oc, r.direction);
    const c = oc.lengthSquared() - this.radius * this.radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vec3.divScalarVec(Vec3.subVec3(rec.p, this.center), this.radius);
        rec.set_face_normal(r, outward_normal);
        rec.mat = this.mat;
        return true;
      }
    }
    return false;
  }
}
