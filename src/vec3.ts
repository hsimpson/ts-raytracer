import { randomNumber, randomNumberRange } from './util';
import { serializable } from './serializing';

@serializable
export default class Vec3 {
  public x = 0;
  public y = 0;
  public z = 0;

  public constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  public get array(): number[] {
    return [this.x, this.y, this.z];
  }

  public set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public copyTo(dest: Vec3): void {
    dest.x = this.x;
    dest.y = this.y;
    dest.z = this.z;
  }

  public clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public get r(): number {
    return this.x;
  }

  public set r(r: number) {
    this.x = r;
  }

  public get g(): number {
    return this.y;
  }

  public set g(g: number) {
    this.y = g;
  }

  public get b(): number {
    return this.z;
  }

  public set b(b: number) {
    this.z = b;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public negate(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  public add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public multiplyScalar(t: number): Vec3 {
    this.x *= t;
    this.y *= t;
    this.z *= t;
    return this;
  }

  public divideScalar(t: number): Vec3 {
    this.x /= t;
    this.y /= t;
    this.z /= t;
    return this;
  }

  public toString(): string {
    return `${this.x}, ${this.y}, ${this.z}`;
  }

  public static addVec3(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z);
  }

  public static subVec3(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z);
  }

  public static multVec3(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z);
  }

  public static multScalarVec3(v: Vec3, t: number): Vec3 {
    return new Vec3(t * v.x, t * v.y, t * v.z);
  }

  public static divScalarVec(v: Vec3, t: number): Vec3 {
    return new Vec3(v.x / t, v.y / t, v.z / t);
  }

  public static dot(u: Vec3, v: Vec3): number {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }

  public static cross(u: Vec3, v: Vec3): Vec3 {
    // prettier-ignore
    return new Vec3(
      u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x);
  }

  public static unitVector(v: Vec3): Vec3 {
    return Vec3.divScalarVec(v, v.length());
  }

  public static random(): Vec3 {
    return new Vec3(randomNumber(), randomNumber(), randomNumber());
  }

  public static randomRange(min: number, max: number): Vec3 {
    return new Vec3(randomNumberRange(min, max), randomNumberRange(min, max), randomNumberRange(min, max));
  }

  public static randomInUnitSphere(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = Vec3.randomRange(-1, 1);
      if (p.lengthSquared() >= 1) {
        continue;
      }
      return p;
    }
  }

  public static randomUnitVector(): Vec3 {
    const a = randomNumberRange(0, 2 * Math.PI);
    const z = randomNumberRange(-1, 1);
    const r = Math.sqrt(1 - z * z);
    return new Vec3(r * Math.cos(a), r * Math.sin(a), z);
  }

  public static randomInHemisphere(normal: Vec3): Vec3 {
    const in_unit_sphere = Vec3.randomInUnitSphere();
    if (Vec3.dot(in_unit_sphere, normal) > 0.0) {
      // In the same hemisphere as the normal
      return in_unit_sphere;
    } else {
      return in_unit_sphere.negate();
    }
  }

  public static reflect(v: Vec3, n: Vec3): Vec3 {
    return Vec3.subVec3(v, Vec3.multScalarVec3(n, 2 * Vec3.dot(v, n)));
  }

  public static refract(uv: Vec3, n: Vec3, etai_over_etat: number): Vec3 {
    const cos_theta = Vec3.dot(uv.negate(), n);
    const uvTheta = Vec3.addVec3(uv, Vec3.multScalarVec3(n, cos_theta));
    const r_out_parallel = Vec3.multScalarVec3(uvTheta, etai_over_etat);
    const r_out_perp = Vec3.multScalarVec3(n, -Math.sqrt(1 - r_out_parallel.lengthSquared()));
    return Vec3.addVec3(r_out_parallel, r_out_perp);
  }

  public static randomInUnitdisk(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = new Vec3(randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0);
      if (p.lengthSquared() >= 1) {
        continue;
      }
      return p;
    }
  }
}

export function writeColor(array: Uint8ClampedArray, offset: number, color: Vec3, samples_per_pixel: number): void {
  let r = color.r;
  let g = color.g;
  let b = color.b;

  // Divide the color total by the number of samples and gamma-correct for gamma=2.0.
  const scale = 1.0 / samples_per_pixel;
  r = Math.sqrt(scale * r);
  g = Math.sqrt(scale * g);
  b = Math.sqrt(scale * b);

  // Write the translated [0,255] value of each color component.
  array[offset++] = r * 255;
  array[offset++] = g * 255;
  array[offset++] = b * 255;
  array[offset++] = 255;
}
