import { vec3, Vec3 } from 'wgpu-matrix';
import { Ray } from './hitables/ray';
import { degreeToRadians, randomInUnitDisk, randomNumberRange } from './util';

export interface CameraOptions {
  lookFrom: Vec3;
  lookAt: Vec3;
  vUp: Vec3;
  background: Vec3;
  fovY: number;
  aperture: number;
  focusDist: number;
}

export class Camera {
  private lookFrom = vec3.zero();
  private readonly lowerLeftCorner = vec3.zero();
  private readonly horizontal = vec3.zero();
  private readonly vertical = vec3.zero();
  private readonly u = vec3.zero();
  private readonly v = vec3.zero();
  private readonly w = vec3.zero();
  private lenseRadius = 0;
  private time0 = 0;
  private time1 = 0;

  public init(
    lookFrom: Vec3,
    lookAt: Vec3,
    vUp: Vec3,
    fovY: number,
    aspectRatio: number,
    aperture: number,
    focusDist: number,
    t0 = 0,
    t1 = 0,
  ): void {
    const theta = degreeToRadians(fovY);
    const h = Math.tan(theta / 2);
    const viewport_height = 2 * h;
    const viewport_width = aspectRatio * viewport_height;

    const wDir = vec3.subtract(lookFrom, lookAt);
    vec3.normalize(wDir, this.w);

    const uDir = vec3.cross(vUp, this.w);
    vec3.normalize(uDir, this.u);

    vec3.cross(this.w, this.u, this.v);

    this.lookFrom = lookFrom;

    // scale(v, k, dst?) returns v * k
    vec3.scale(this.u, focusDist * viewport_width, this.horizontal);
    vec3.scale(this.v, focusDist * viewport_height, this.vertical);

    const half_horizontal = vec3.scale(this.horizontal, 0.5);
    const half_vertical = vec3.scale(this.vertical, 0.5);

    const focusW = vec3.scale(this.w, focusDist);

    // lowerLeftCorner = lookFrom - half_horizontal - half_vertical - focusW
    const temp1 = vec3.subtract(this.lookFrom, half_horizontal);
    const temp2 = vec3.subtract(temp1, half_vertical);
    vec3.subtract(temp2, focusW, this.lowerLeftCorner);

    this.lenseRadius = aperture / 2;
    this.time0 = t0;
    this.time1 = t1;
  }

  public getRay(s: number, t: number): Ray {
    const rd = vec3.scale(randomInUnitDisk(), this.lenseRadius);

    const vecU = vec3.scale(this.u, rd[0]);
    const vecV = vec3.scale(this.v, rd[1]);
    const offset = vec3.add(vecU, vecV);

    const sHor = vec3.scale(this.horizontal, s);
    const tVer = vec3.scale(this.vertical, t);

    return new Ray(
      vec3.add(vec3.create(), this.lookFrom, offset),
      vec3.sub(
        vec3.create(),
        vec3.sub(
          vec3.create(),
          vec3.add(vec3.create(), vec3.add(vec3.create(), this.lowerLeftCorner, sHor), tVer),
          this.lookFrom,
        ),
        offset,
      ),
      randomNumberRange(this.time0, this.time1),
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
    array.push(this.time0);
    array.push(this.time1);

    // padding
    array.push(0, 0, 0, 0);

    return new Float32Array(array);
  }
}
