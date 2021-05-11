import { BVHNode, Hittable, HittableList } from './hittables';
import { Light } from './lights';
import { serializable } from './serializing';

@serializable
export class World {
  private _objects: HittableList;
  private _lights: Light[];

  public constructor() {
    this._objects = new HittableList();
    this._lights = [];
  }

  public get objects(): HittableList {
    return this._objects;
  }

  public get lights(): Light[] {
    return this._lights;
  }

  public addObject(object: Hittable): void {
    this._objects.add(object);
  }

  public addLight(light: Light): void {
    this._lights.push(light);
  }

  public createBVH(): void {
    const bvhNode = BVHNode.createFromHitableList(this._objects, 0, 1);
    this._objects = new HittableList();
    this.addObject(bvhNode);
  }
}
