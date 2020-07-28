import Vec3 from './vec3';
import Ray from './raytracer-cpu/ray';
import { degreeToRadians } from './util';
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
    focusDist: number
  ): void {
    const theta = degreeToRadians(fovY);
    const h = Math.tan(theta / 2);
    const viewport_height = 2 * h;
    const viewport_width = aspectRatio * viewport_height;

    this.w = Vec3.unit_vector(Vec3.subVec3(lookFrom, lookAt));
    this.u = Vec3.unit_vector(Vec3.cross(vUp, this.w));
    this.v = Vec3.cross(this.w, this.u);

    this.lookFrom = lookFrom;
    this.horizontal = Vec3.multScalarVec3(this.u, focusDist * viewport_width);
    this.vertical = Vec3.multScalarVec3(this.v, focusDist * viewport_height);

    const half_horizontal = Vec3.divScalarVec(this.horizontal, 2);
    const half_vertical = Vec3.divScalarVec(this.vertical, 2);

    const focusW = Vec3.multScalarVec3(this.w, focusDist);

    this.lowerLeftCorner = Vec3.subVec3(
      Vec3.subVec3(Vec3.subVec3(this.lookFrom, half_horizontal), half_vertical),
      focusW
    );

    this.lenseRadius = aperture / 2;
  }

  public getRay(s: number, t: number): Ray {
    const rd = Vec3.multScalarVec3(Vec3.randomInUnitdisk(), this.lenseRadius);

    const vecU = Vec3.multScalarVec3(this.u, rd.x);
    const vecV = Vec3.multScalarVec3(this.v, rd.y);
    const offset = Vec3.addVec3(vecU, vecV);

    const sHor = Vec3.multScalarVec3(this.horizontal, s);
    const tVer = Vec3.multScalarVec3(this.vertical, t);

    return new Ray(
      Vec3.addVec3(this.lookFrom, offset),
      Vec3.subVec3(Vec3.subVec3(Vec3.addVec3(Vec3.addVec3(this.lowerLeftCorner, sHor), tVer), this.lookFrom), offset)
    );
  }

  public getUniformArray(): Float32Array {
    const array = [];
    array.push(...this.lookFrom.array, 0.0); // vec4 because of memory alignment
    array.push(...this.lowerLeftCorner.array, 0.0);
    array.push(...this.horizontal.array, 0.0);
    array.push(...this.vertical.array, 0.0);
    array.push(...this.u.array, 0.0);
    array.push(...this.v.array, 0.0);
    array.push(...this.w.array, 0.0);
    array.push(this.lenseRadius);

    return new Float32Array(array);
  }
}
