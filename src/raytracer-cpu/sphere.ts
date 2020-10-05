import Material from './material';
import { HitRecord, Hittable, WebGPUHittableType, IWebGPUObject } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import AABB from './aabb';
import { serializable } from '../serializing';

function getSphereUV(p: Vec3): { u: number; v: number } {
  const phi = Math.atan2(p[2], p[0]);
  const theta = Math.asin(p[1]);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}

@serializable
export class Sphere extends Hittable implements IWebGPUObject {
  private _center: Vec3;
  private _radius: number;
  private _material: Material;
  private static _gpuBuffer = [];
  private static _staticgpuObjectIndex = 0;
  private _gpuObjectIndex: number;

  public constructor(center: Vec3, radius: number, mat: Material) {
    super();
    this._gpuObjectIndex = Sphere._staticgpuObjectIndex++;
    this._center = center;
    this._radius = radius;
    this._material = mat;
    this.insertIntoBufferArray();
  }

  public insertIntoBufferArray(): void {
    Sphere._gpuBuffer.push(...this._center, this._radius);
    const mat = (this._material as unknown) as IWebGPUObject;
    Sphere._gpuBuffer.push(mat.gpuObjectTypeId, mat.gpuObjectIndex, -1, -1);
    // Sphere._gpuBuffer.push(mat.gpuObjectTypeId, mat.gpuObjectIndex);
  }

  public static resetGPUBuffer(): void {
    Sphere._gpuBuffer = [];
    Sphere._staticgpuObjectIndex = 0;
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const oc = Vector.subVec3(r.origin, this._center);
    const a = Vector.lengthSquared(r.direction);
    const half_b = Vector.dot(oc, r.direction);
    const c = Vector.lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;

    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);
        rec.setFaceNormal(r, outward_normal);
        const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this._material;
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < t_max && temp > t_min) {
        rec.t = temp;
        rec.p = r.at(rec.t);
        const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);
        rec.setFaceNormal(r, outward_normal);
        const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this._material;
        return true;
      }
    }
    return false;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const newOutputBox = new AABB(
      Vector.subVec3(this._center, [this._radius, this._radius, this._radius]),
      Vector.addVec3(this._center, [this._radius, this._radius, this._radius])
    );
    newOutputBox.copyTo(outputBox);
    return true;
  }

  public get gpuObjectTypeId(): WebGPUHittableType {
    return WebGPUHittableType.Sphere;
  }

  public get gpuObjectIndex(): number {
    return this._gpuObjectIndex;
  }

  public static get gpuBufferArray(): Float32Array {
    console.log('Spheres:', Sphere._gpuBuffer);
    return new Float32Array(Sphere._gpuBuffer);
  }
}
