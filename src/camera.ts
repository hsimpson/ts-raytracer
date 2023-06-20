import { vec3 } from 'gl-matrix';
import { Ray } from './raytracer-cpu/ray';
import { serializable } from './serializing';
import { degreeToRadians, randomInUnitdisk, randomNumberRange } from './util';

export interface CameraOptions {
  lookFrom: vec3;
  lookAt: vec3;
  vUp: vec3;
  background: vec3;
  fovY: number;
  aperture: number;
  focusDist: number;
}

@serializable
export class Camera {
  private lookFrom: vec3;
  private lowerLeftCorner = vec3.create();
  private horizontal = vec3.create();
  private vertical = vec3.create();
  private u = vec3.create();
  private v = vec3.create();
  private w = vec3.create();
  private lenseRadius: number;
  private time0: number;
  private time1: number;

  public constructor() {
    //
  }

  public init(
    lookFrom: vec3,
    lookAt: vec3,
    vUp: vec3,
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

    vec3.normalize(this.w, vec3.subtract(vec3.create(), lookFrom, lookAt));
    vec3.normalize(this.u, vec3.cross(vec3.create(), vUp, this.w));
    vec3.cross(this.v, this.w, this.u);

    this.lookFrom = lookFrom;
    vec3.scale(this.horizontal, this.u, focusDist * viewport_width);
    vec3.scale(this.vertical, this.v, focusDist * viewport_height);

    const half_horizontal = vec3.scale(vec3.create(), this.horizontal, 0.5);
    const half_vertical = vec3.scale(vec3.create(), this.vertical, 0.5);

    const focusW = vec3.scale(vec3.create(), this.w, focusDist);

    vec3.subtract(
      this.lowerLeftCorner,
      vec3.subtract(vec3.create(), vec3.subtract(vec3.create(), this.lookFrom, half_horizontal), half_vertical),
      focusW,
    );

    this.lenseRadius = aperture / 2;
    this.time0 = t0;
    this.time1 = t1;
  }

  public getRay(s: number, t: number): Ray {
    const rd = vec3.scale(vec3.create(), randomInUnitdisk(), this.lenseRadius);

    const vecU = vec3.scale(vec3.create(), this.u, rd[0]);
    const vecV = vec3.scale(vec3.create(), this.v, rd[1]);
    const offset = vec3.add(vec3.create(), vecU, vecV);

    const sHor = vec3.scale(vec3.create(), this.horizontal, s);
    const tVer = vec3.scale(vec3.create(), this.vertical, t);

    return new Ray(
      vec3.add(vec3.create(), this.lookFrom, offset),
      vec3.sub(
        vec3.create(),
        vec3.sub(vec3.create(), vec3.add(vec3.create(), vec3.add(vec3.create(), this.lowerLeftCorner, sHor), tVer), this.lookFrom),
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
    array.push([0, 0, 0, 0]);

    return new Float32Array(array);
  }
}
