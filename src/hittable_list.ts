import { hittable, hit_record } from './hittable';
import ray from './ray';

export class hittable_list extends hittable {
  private objects: hittable[] = [];

  public constructor(object?: hittable) {
    super();
    if (object) {
      this.add(object);
    }
  }

  public clear(): void {
    this.objects.length = 0;
  }

  public add(object: hittable): void {
    this.objects.push(object);
  }

  public hit(r: ray, t_min: number, t_max: number, rec: hit_record): boolean {
    const temp_rec = new hit_record();
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
