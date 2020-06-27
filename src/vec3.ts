import { random_number, random_numberRange } from './util';

export default class vec3 {
  private _arr = new Float32Array([0, 0, 0]);

  public constructor(x?: number, y?: number, z?: number) {
    this._arr[0] = x ?? 0;
    this._arr[1] = y ?? 0;
    this._arr[2] = z ?? 0;
  }

  public copyTo(dest: vec3): void {
    dest._arr = this._arr;
  }

  public get x(): number {
    return this._arr[0];
  }

  public set x(x: number) {
    this._arr[0] = x;
  }

  public get y(): number {
    return this._arr[1];
  }

  public set y(y: number) {
    this._arr[1] = y;
  }

  public get z(): number {
    return this._arr[2];
  }

  public set z(z: number) {
    this._arr[2] = z;
  }

  public get r(): number {
    return this._arr[0];
  }

  public set r(r: number) {
    this._arr[0] = r;
  }

  public get g(): number {
    return this._arr[1];
  }

  public set g(g: number) {
    this._arr[1] = g;
  }

  public get b(): number {
    return this._arr[2];
  }

  public set b(b: number) {
    this._arr[2] = b;
  }

  public length(): number {
    return Math.sqrt(this.length_squared());
  }

  public length_squared(): number {
    return this._arr[0] * this._arr[0] + this._arr[1] * this._arr[1] + this._arr[2] * this._arr[2];
  }

  public negate(): vec3 {
    return new vec3(-this._arr[0], -this._arr[1], -this._arr[2]);
  }

  public add(v: vec3): vec3 {
    this._arr[0] += v.x;
    this._arr[1] += v.y;
    this._arr[2] += v.z;
    return this;
  }

  public multiplyScalar(t: number): vec3 {
    this._arr[0] *= t;
    this._arr[1] *= t;
    this._arr[2] *= t;
    return this;
  }

  public divideScalar(t: number): vec3 {
    this._arr[0] /= t;
    this._arr[1] /= t;
    this._arr[2] /= t;
    return this;
  }

  public toString(): string {
    return `${this._arr[0]}, ${this._arr[1]}, ${this._arr[2]}`;
  }

  public static addVec3(u: vec3, v: vec3): vec3 {
    return new vec3(u.x + v.x, u.y + v.y, u.z + v.z);
  }

  public static subVec3(u: vec3, v: vec3): vec3 {
    return new vec3(u.x - v.x, u.y - v.y, u.z - v.z);
  }

  public static multVec3(u: vec3, v: vec3): vec3 {
    return new vec3(u.x * v.x, u.y * v.y, u.z * v.z);
  }

  public static multScalarVec3(v: vec3, t: number): vec3 {
    return new vec3(t * v.x, t * v.y, t * v.z);
  }

  public static divScalarVec(v: vec3, t: number): vec3 {
    return new vec3(v.x / t, v.y / t, v.z / t);
  }

  public static dot(u: vec3, v: vec3): number {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }

  public static cross(u: vec3, v: vec3): vec3 {
    // prettier-ignore
    return new vec3(
      u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x);
  }

  public static unit_vector(v: vec3): vec3 {
    return vec3.divScalarVec(v, v.length());
  }

  public static random(): vec3 {
    return new vec3(random_number(), random_number(), random_number());
  }

  public static random_range(min: number, max: number): vec3 {
    return new vec3(random_numberRange(min, max), random_numberRange(min, max), random_numberRange(min, max));
  }

  public static random_in_unit_sphere(): vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = vec3.random_range(-1, 1);
      if (p.length_squared() >= 1) {
        continue;
      }
      return p;
    }
  }

  public static random_unit_vector(): vec3 {
    const a = random_numberRange(0, 2 * Math.PI);
    const z = random_numberRange(-1, 1);
    const r = Math.sqrt(1 - z * z);
    return new vec3(r * Math.cos(a), r * Math.sin(a), z);
  }

  public static random_in_hemisphere(normal: vec3): vec3 {
    const in_unit_sphere = vec3.random_in_unit_sphere();
    if (vec3.dot(in_unit_sphere, normal) > 0.0) {
      // In the same hemisphere as the normal
      return in_unit_sphere;
    } else {
      return in_unit_sphere.negate();
    }
  }

  public static reflect(v: vec3, n: vec3): vec3 {
    return vec3.subVec3(v, vec3.multScalarVec3(n, 2 * vec3.dot(v, n)));
  }
}

export function write_color(array: Uint8ClampedArray, offset: number, color: vec3, samples_per_pixel: number): void {
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
