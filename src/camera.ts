import type { Vec3 } from './vec3';
import * as Vector from './vec3';
import Ray from './raytracer-cpu/ray';
import { degreeToRadians, randomNumberRange } from './util';
import { serializable } from './serializing';

export interface CameraOptions {
  lookFrom: Vec3;
  lookAt: Vec3;
  vUp: Vec3;
  fovY: number;
  aspectRatio: number;
  aperture: number;
  focusDist: number;
}

@serializable
export default class Camera {
  private lookFrom: Vec3;
  private lowerLeftCorner: Vec3;
  private horizontal: Vec3;
  private vertical: Vec3;
  private u: Vec3;
  private v: Vec3;
  private w: Vec3;
  private lenseRadius: number;
  private time0: number;
  private time1: number;

  public constructor() {
    //
  }

  public init(
    lookFrom: Vec3,
    lookAt: Vec3,
    vUp: Vec3,
    fovY: number,
    aspectRatio: number,
    aperture: number,
    focusDist: number,
    t0 = 0,
    t1 = 0
  ): void {
    const theta = degreeToRadians(fovY);
    const h = Math.tan(theta / 2);
    const viewport_height = 2 * h;
    const viewport_width = aspectRatio * viewport_height;

    this.w = Vector.unitVector(Vector.subVec3(lookFrom, lookAt));
    this.u = Vector.unitVector(Vector.cross(vUp, this.w));
    this.v = Vector.cross(this.w, this.u);

    this.lookFrom = lookFrom;
    this.horizontal = Vector.multScalarVec3(this.u, focusDist * viewport_width);
    this.vertical = Vector.multScalarVec3(this.v, focusDist * viewport_height);

    const half_horizontal = Vector.divScalarVec(this.horizontal, 2);
    const half_vertical = Vector.divScalarVec(this.vertical, 2);

    const focusW = Vector.multScalarVec3(this.w, focusDist);

    this.lowerLeftCorner = Vector.subVec3(
      Vector.subVec3(Vector.subVec3(this.lookFrom, half_horizontal), half_vertical),
      focusW
    );

    this.lenseRadius = aperture / 2;
    this.time0 = t0;
    this.time1 = t1;
  }

  public getRay(s: number, t: number): Ray {
    const rd = Vector.multScalarVec3(Vector.randomInUnitdisk(), this.lenseRadius);

    const vecU = Vector.multScalarVec3(this.u, rd[0]);
    const vecV = Vector.multScalarVec3(this.v, rd[1]);
    const offset = Vector.addVec3(vecU, vecV);

    const sHor = Vector.multScalarVec3(this.horizontal, s);
    const tVer = Vector.multScalarVec3(this.vertical, t);

    return new Ray(
      Vector.addVec3(this.lookFrom, offset),
      Vector.subVec3(
        Vector.subVec3(Vector.addVec3(Vector.addVec3(this.lowerLeftCorner, sHor), tVer), this.lookFrom),
        offset
      ),
      randomNumberRange(this.time0, this.time1)
    );
  }

  public getUniformArray(): Float32Array {
    const array = [];
    array.push(...this.lookFrom, 0.0); // vec4 because of memory alignment
    array.push(...this.lowerLeftCorner, 0.0);
    array.push(...this.horizontal, 0.0);
    array.push(...this.vertical, 0.0);
    array.push(...this.u, 0.0);
    array.push(...this.v, 0.0);
    array.push(...this.w, 0.0);
    array.push(this.lenseRadius);

    return new Float32Array(array);
  }
}
