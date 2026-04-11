import { Mat4, mat4, Quat, quat, Vec3, vec3 } from 'wgpu-matrix';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';

export class Transform {
  private readonly _objectToWorldMatrix = mat4.identity();
  private readonly _worldToObjectMatrix = mat4.identity();
  private readonly _rotationMatrix = mat4.identity();
  private readonly _inverseRotationMatrix = mat4.identity();
  private readonly _normalMatrix = mat4.identity();
  private _position = vec3.zero();
  private _rotation = quat.identity();
  private _isTransformed = false;

  public get objectToWorld(): Mat4 {
    return this._objectToWorldMatrix;
  }

  public get normalMatrix(): Mat4 {
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
      movedOrigin,
      movedDirection,
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

    rec.p = vec3.create(movedP[0], movedP[1], movedP[2]);
    rec.setFaceNormal(ray, vec3.create(movedN[0], movedN[1], movedN[2]));
  }

  public translate(translation: Vec3): void {
    this._position = vec3.add(this._position, translation);
    this._updateMatrix();
  }

  public rotateQuat(rotation: Quat): void {
    this._rotation = quat.multiply(this._rotation, rotation);
    this._updateMatrix();
  }

  public rotateEuler(angleX: number, angelY: number, angleZ: number): void {
    const toRad = Math.PI / 180;
    const tempQuat = quat.fromEuler(angleX * toRad, angelY * toRad, angleZ * toRad, 'zyx');
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

    // Build translation matrix
    const translationMatrix = mat4.translation(this._position);

    // Build rotation matrix from quaternion: fromQuat(q, dst)
    mat4.fromQuat(this._rotation, this._rotationMatrix);

    // objectToWorld = T * R: multiply(a, b, dst) stores a*b into dst
    mat4.multiply(translationMatrix, this._rotationMatrix, this._objectToWorldMatrix);

    // worldToObject = inverse(objectToWorld): invert(m, dst) stores invert(m) into dst
    mat4.invert(this._objectToWorldMatrix, this._worldToObjectMatrix);

    // inverseRotation = inverse(rotation)
    mat4.invert(this._rotationMatrix, this._inverseRotationMatrix);

    // normalMatrix = inverse(transpose(rotation))
    mat4.transpose(this._rotationMatrix, this._normalMatrix);
    mat4.invert(this._normalMatrix, this._normalMatrix);
  }
}
