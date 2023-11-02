import { mat4, quat, vec3 } from 'gl-matrix';
import { serializable } from '../serializing';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';

@serializable
export class Transform {
  private _objectToWorldMatrix = mat4.create();
  private _worldToObjectMatrix = mat4.create();
  private _rotationMatrix = mat4.create();
  private _inverseRotationMatrix = mat4.create();
  private _normalMatrix = mat4.create();
  private _position = vec3.create();
  private _rotation = quat.create();
  private _isTransformed = false;

  public get objectToWorld(): mat4 {
    return this._objectToWorldMatrix;
  }

  public get normalMatrix(): mat4 {
    return this._normalMatrix;
  }

  public get isTransformed(): boolean {
    return this._isTransformed;
  }

  public transformRay(ray: Ray): Ray {
    if (!this._isTransformed) {
      return ray;
    }
    const movedOrigin = vec3.fromValues(ray.origin[0], ray.origin[1], ray.origin[2]);
    vec3.transformMat4(movedOrigin, movedOrigin, this._worldToObjectMatrix);

    const movedDirection = vec3.fromValues(ray.direction[0], ray.direction[1], ray.direction[2]);
    vec3.transformMat4(movedDirection, movedDirection, this._inverseRotationMatrix);
    // vec3.transformMat4(movedDirection, movedDirection, this._worldToObjectMatrix);

    //FIXME: when replace vec3
    return new Ray(
      [movedOrigin[0], movedOrigin[1], movedOrigin[2]],
      [movedDirection[0], movedDirection[1], movedDirection[2]],
      // ray.direction,
      ray.time,
    );
  }

  public transformRecord(ray: Ray, rec: HitRecord): void {
    if (!this._isTransformed) {
      return;
    }

    //FIXME: when replace vec3
    const movedP = vec3.fromValues(rec.p[0], rec.p[1], rec.p[2]);
    vec3.transformMat4(movedP, movedP, this._objectToWorldMatrix);

    const movedN = vec3.fromValues(rec.normal[0], rec.normal[1], rec.normal[2]);
    vec3.transformMat4(movedN, movedN, this._normalMatrix);
    vec3.normalize(movedN, movedN);

    rec.p = [movedP[0], movedP[1], movedP[2]];
    rec.setFaceNormal(ray, [movedN[0], movedN[1], movedN[2]]);
  }

  public translate(translation: vec3): void {
    vec3.add(this._position, this._position, translation);
    this._updateMatrix();
  }

  public rotateQuat(rotation: quat): void {
    this._rotation = quat.multiply(this._rotation, this._rotation, rotation);
    this._updateMatrix();
  }

  public rotateEuler(angleX: number, angelY: number, angleZ: number): void {
    let tempQuat = quat.create();
    tempQuat = quat.fromEuler(tempQuat, angleX, angelY, angleZ);
    this.rotateQuat(tempQuat);
  }

  // public transformVec3(v: vec3): vec3 {
  //   if(!this._isTransformed) {
  //     return v;
  //   }

  //   return vec3.transformMat4(vec3.create(), v, this._objectToWorldMatrix);
  // }

  private _updateMatrix(): void {
    this._isTransformed = true;
    const translationMatrix = mat4.create();

    mat4.translate(translationMatrix, translationMatrix, this._position);
    mat4.fromQuat(this._rotationMatrix, this._rotation);

    mat4.multiply(this._objectToWorldMatrix, translationMatrix, this._rotationMatrix);

    mat4.invert(this._worldToObjectMatrix, this._objectToWorldMatrix);
    mat4.invert(this._inverseRotationMatrix, this._rotationMatrix);

    mat4.transpose(this._normalMatrix, this._rotationMatrix);
    mat4.invert(this._normalMatrix, this._normalMatrix);

    // logMatrix(this._modelMatrix);
  }
}
