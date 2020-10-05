import { serializable } from '../serializing';
import AABB from './aabb';
import { HitRecord, Hittable, IWebGPUObject, WebGPUHittableType } from './hittable';
import Ray from './ray';

@serializable
export class HittableList extends Hittable implements IWebGPUObject {
  private _objects: Hittable[] = [];
  private static _gpuBuffer = [];
  private static _staticgpuObjectIndex = 0;
  private _gpuObjectIndex: number;

  public constructor(object?: Hittable) {
    super();
    this._gpuObjectIndex = HittableList._staticgpuObjectIndex++;
    if (object) {
      this.add(object);
    }
  }

  public insertIntoBufferArray(): void {
    //
  }

  public static resetGPUBuffer(): void {
    HittableList._gpuBuffer = [];
    HittableList._staticgpuObjectIndex = 0;
  }

  public get objects(): Hittable[] {
    return this._objects;
  }

  public clear(): void {
    this._objects.length = 0;
  }

  public add(object: Hittable): void {
    this._objects.push(object);
    const obj = (object as unknown) as IWebGPUObject;
    // HittableList._gpuBuffer.push(obj.gpuObjectTypeId, obj.gpuObjectIndex);
    HittableList._gpuBuffer.push(obj.gpuObjectTypeId, obj.gpuObjectIndex, -1, -1);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const temp_rec = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (const object of this._objects) {
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;

        temp_rec.copyTo(rec);
      }
    }

    return hit_anything;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    if (this._objects.length === 0) {
      return false;
    }
    const tempBox: AABB = new AABB();
    let firstBox = true;
    for (const object of this._objects) {
      if (!object.boundingBox(t0, t1, tempBox)) {
        return false;
      }

      if (firstBox) {
        tempBox.copyTo(outputBox);
      } else {
        AABB.surroundingBox(outputBox, tempBox).copyTo(outputBox);
      }
      firstBox = false;
    }
    return true;
  }

  public get gpuObjectTypeId(): WebGPUHittableType {
    return WebGPUHittableType.HittableList;
  }

  public get gpuObjectIndex(): number {
    return this._gpuObjectIndex;
  }

  public static get gpuBufferArray(): Float32Array {
    console.log('HittableList:', HittableList._gpuBuffer);
    return new Float32Array(HittableList._gpuBuffer);
  }
}
