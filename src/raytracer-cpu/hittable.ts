import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import Ray from './ray';
import Material from './material';
import { AABB } from './aabb';
import { mat4, vec3, quat } from 'gl-matrix';
// import { logMatrix } from '../util';

export class HitRecord {
  public p: Vec3 = [0, 0, 0];
  public normal: Vec3 = [0, 0, 0];
  public t = 0;
  public u = 0;
  public v = 0;
  public frontFace = true;
  public mat: Material;

  public setFaceNormal(r: Ray, outward_normal: Vec3): void {
    this.frontFace = Vector.dot(r.direction, outward_normal) < 0;
    this.normal = this.frontFace ? outward_normal : Vector.negate(outward_normal);
  }

  public copyTo(dest: HitRecord): void {
    dest.p = this.p;
    dest.normal = this.normal;
    dest.t = this.t;
    dest.u = this.u;
    dest.v = this.v;
    dest.frontFace = this.frontFace;
    dest.mat = this.mat;
  }
}

export abstract class Hittable {
  public abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  public abstract boundingBox(t0: number, t1: number, outputBox: AABB): boolean;
  public material: Material;
  public name = '';

  private _modelMatrix = mat4.create();
  private _rotationMatrix = mat4.create();
  private _inverseModelMatrix = mat4.create();
  private _inverseRotationMatrix = mat4.create();
  private _position = vec3.create();
  private _rotation = quat.create();
  private _isTransformed = false;

  public translate(translation: vec3): void {
    vec3.add(this._position, this._position, translation);
    this._updateModelMatrix();
  }

  public rotateQuat(rotation: quat): void {
    this._rotation = quat.multiply(this._rotation, this._rotation, rotation);
    this._updateModelMatrix();
  }

  public rotateEuler(angleX: number, angelY: number, angleZ: number): void {
    let tempQuat = quat.create();
    tempQuat = quat.fromEuler(tempQuat, angleX, angelY, angleZ);
    this.rotateQuat(tempQuat);
  }

  private _updateModelMatrix(): void {
    this._isTransformed = true;
    const translationMatrix = mat4.create();

    mat4.translate(translationMatrix, translationMatrix, this._position);
    mat4.fromQuat(this._rotationMatrix, this._rotation);

    mat4.multiply(this._modelMatrix, translationMatrix, this._rotationMatrix);

    mat4.invert(this._inverseModelMatrix, this._modelMatrix);
    mat4.invert(this._inverseRotationMatrix, this._rotationMatrix);

    // logMatrix(this._modelMatrix);
  }

  protected _transformRay(ray: Ray): Ray {
    if (!this._isTransformed) {
      return ray;
    }
    const movedOrigin = vec3.create();
    // const movedDirection = vec3.create();
    vec3.set(movedOrigin, ray.origin[0], ray.origin[1], ray.origin[2]);
    // vec3.set(movedDirection, ray.direction[0], ray.direction[1], ray.direction[2]);
    vec3.transformMat4(movedOrigin, movedOrigin, this._inverseModelMatrix);
    // vec3.transformMat4(movedDirection, movedDirection, this._inverseRotationMatrix);

    //FIXME: when replace vec3
    ray.origin = [movedOrigin[0], movedOrigin[1], movedOrigin[2]];
    // ray.direction = [movedDirection[0], movedDirection[1], movedDirection[2]];

    return new Ray(
      [movedOrigin[0], movedOrigin[1], movedOrigin[2]],
      // [movedDirection[0], movedDirection[1], movedDirection[2]],
      ray.direction,
      ray.time
    );
  }

  protected _transformRecord(ray: Ray, rec: HitRecord): void {
    if (!this._isTransformed) {
      return;
    }

    //FIXME: when replace vec3
    const movedP = vec3.create();
    vec3.set(movedP, rec.p[0], rec.p[1], rec.p[2]);
    vec3.transformMat4(movedP, movedP, this._modelMatrix);

    // const movedN = vec3.create();
    // vec3.set(movedN, rec.normal[0], rec.normal[1], rec.normal[2]);
    // vec3.transformMat4(movedN, movedN, this._rotationMatrix);

    rec.p = [movedP[0], movedP[1], movedP[2]];
    // rec.setFaceNormal(ray, [movedN[0], movedN[1], movedN[2]]);
  }
}
