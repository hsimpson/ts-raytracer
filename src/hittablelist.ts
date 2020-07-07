import { autoserializeAsArray, Deserialize, InstantiationMethod, JsonObject, Serialize } from 'cerializr';
import BaseObject from './baseobject';
import { HitRecord, Hittable } from './hittable';
import Ray from './ray';
import Sphere from './sphere';

export class HittableList implements Hittable {
  @autoserializeAsArray(BaseObject)
  private objects: BaseObject[] = [];

  public constructor(object?: Hittable) {
    if (object) {
      this.add(object);
    }
  }

  public static onSerialized(json: JsonObject, instance: HittableList): JsonObject {
    const objects = [];
    for (const o of instance.objects) {
      switch (o.constructor.name) {
        case 'Sphere': {
          const serializedObject = Serialize(o, Sphere);
          serializedObject.type = 'Sphere';
          objects.push(serializedObject);
          break;
        }

        default:
          break;
      }
    }
    json['objects'] = objects;
    return json;
  }

  public static onDeserialized(
    data: JsonObject,
    instance: HittableList,
    instantiationMethod: InstantiationMethod = InstantiationMethod.New
  ): HittableList | void {
    if (!instance) {
      switch (instantiationMethod) {
        case InstantiationMethod.New:
          instance = new HittableList();
          break;
        case InstantiationMethod.ObjectCreate:
          instance = Object.create(HittableList.prototype);
          break;
        default:
          instance = {} as HittableList;
          break;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objects: any[] = data.objects as any[];
    instance.objects.length = 0;
    for (const o of objects) {
      switch (o.type) {
        case 'Sphere':
          instance.objects.push(Deserialize(o, Sphere, null, InstantiationMethod.ObjectCreate));
          break;

        default:
          break;
      }
    }
    return instance;
  }

  public clear(): void {
    this.objects.length = 0;
  }

  public add(object: Hittable): void {
    this.objects.push(object);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const temp_rec = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (const object of this.objects) {
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;

        temp_rec.copyTo(rec);
      }
    }

    return hit_anything;
  }
}
