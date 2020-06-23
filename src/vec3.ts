export default class vec3 {
  private _arr = new Float32Array(3);

  public constructor(x?: number, y?: number, z?: number) {
    this._arr[0] = x ?? 0;
    this._arr[1] = y ?? 0;
    this._arr[2] = z ?? 0;
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

  public static multSclarVec3(v: vec3, t: number): vec3 {
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
}

export function write_color(array: Uint8ClampedArray, offset: number, color: vec3): void {
  array[offset++] = color.r * 255;
  array[offset++] = color.g * 255;
  array[offset++] = color.b * 255;
  array[offset++] = 255;
}
