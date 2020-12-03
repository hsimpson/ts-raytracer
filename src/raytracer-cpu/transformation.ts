import { mat4, vec3, quat } from 'gl-matrix';
import { HitRecord, Hittable } from './hittable';
import { AABB } from './aabb';
import * as Vector from '../vec3';
import Ray from './ray';
import { serializable } from '../serializing';
import { logMatrix } from '../util';

@serializable
export class Transformation extends Hittable {
  private _hittable: Hittable;
  private _modelMatrix = mat4.create();
  private _rotationMatrix = mat4.create();
  private _inverseModelMatrix = mat4.create();
  private _inverseRotationMatrix = mat4.create();
  private _position = vec3.create();
  private _rotation = quat.create();

  public constructor(hittable: Hittable) {
    super();
    this._hittable = hittable;
  }

  public get hittable(): Hittable {
    return this._hittable;
  }

  public get modelMatrix(): mat4 {
    return this._modelMatrix;
  }

  public translate(translation: vec3): Transformation {
    vec3.add(this._position, this._position, translation);
    this._updateModelMatrix();
    return this;
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

  protected _updateModelMatrix(): void {
    const translationMatrix = mat4.create();

    mat4.translate(translationMatrix, translationMatrix, this._position);
    mat4.fromQuat(this._rotationMatrix, this._rotation);

    mat4.multiply(this._modelMatrix, translationMatrix, this._rotationMatrix);

    mat4.invert(this._inverseModelMatrix, this._modelMatrix);
    mat4.invert(this._inverseRotationMatrix, this._rotationMatrix);

    // logMatrix(this._modelMatrix);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const movedOrigin = vec3.create();
    const movedDirection = vec3.create();
    vec3.set(movedOrigin, r.origin[0], r.origin[1], r.origin[2]);
    vec3.set(movedDirection, r.direction[0], r.direction[1], r.direction[2]);
    vec3.transformMat4(movedOrigin, movedOrigin, this._inverseModelMatrix);
    vec3.transformMat4(movedDirection, movedDirection, this._inverseRotationMatrix);

    //FIXME: when replace vec3
    const movedRay = new Ray(
      [movedOrigin[0], movedOrigin[1], movedOrigin[2]],
      [movedDirection[0], movedDirection[1], movedDirection[2]],
      // r.direction,
      r.time
    );

    if (!this._hittable.hit(movedRay, t_min, t_max, rec)) {
      return false;
    }

    //FIXME: when replace vec3
    const movedP = vec3.create();
    vec3.set(movedP, rec.p[0], rec.p[1], rec.p[2]);
    vec3.transformMat4(movedP, movedP, this._modelMatrix);

    const movedN = vec3.create();
    vec3.set(movedN, rec.normal[0], rec.normal[1], rec.normal[2]);
    vec3.transformMat4(movedN, movedN, this._rotationMatrix);

    rec.p = [movedP[0], movedP[1], movedP[2]];
    rec.setFaceNormal(movedRay, [movedN[0], movedN[1], movedN[2]]);

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    if (!this._hittable.boundingBox(t0, t1, outputBox)) {
      return false;
    }

    //FIXME: when replace vec3
    const newOutputBox = new AABB(
      Vector.addVec3(outputBox.min, [this._position[0], this._position[1], this._position[2]]),
      Vector.addVec3(outputBox.max, [this._position[0], this._position[1], this._position[2]])
    );
    newOutputBox.copyTo(outputBox);
    return true;
  }
}
