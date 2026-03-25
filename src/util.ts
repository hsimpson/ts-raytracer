import { Mat4, vec3, Vec3, vec4, Vec4 } from 'wgpu-matrix';

// gamma 2.2
const GAMMA = 1.0 / 2.2;

export function degreeToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function randomNumber(): number {
  return Math.random();
}

export function randomNumberRange(min: number, max: number): number {
  return min + (max - min) * randomNumber();
}

export function clamp(x: number, min: number, max: number): number {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}

export function randomInt(min: number, max: number): number {
  // Returns a random integer in [min,max].
  return Math.floor(randomNumberRange(min, max + 1));
}

export function logMatrix(mat: Mat4): void {
  const m = [];
  for (const v of mat) {
    m.push(v.toFixed(2));
  }

  console.log(`${m[0]}, ${m[4]}, ${m[8]}, ${m[12]}`);
  console.log(`${m[1]}, ${m[5]}, ${m[9]}, ${m[13]}`);
  console.log(`${m[2]}, ${m[6]}, ${m[10]}, ${m[14]}`);
  console.log(`${m[3]}, ${m[7]}, ${m[11]}, ${m[15]}`);
}

// export function isPowerOf2(value: number): boolean {
//   return (value & (value - 1)) === 0 && value !== 0;
// }

export function nextPowerOf2(value: number): number {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

export function getSphereUV(p: Vec3): { u: number; v: number } {
  const phi = Math.atan2(p[2], p[0]);
  const theta = Math.asin(p[1]);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}

export function writeColor(array: Uint8ClampedArray, offset: number, color: Vec3, spp: number): void {
  let [r, g, b] = color;

  // Divide the color total by the number of samples
  const scale = 1.0 / spp;

  // gamma 2.0
  // r = Math.sqrt(scale * r);
  // g = Math.sqrt(scale * g);
  // b = Math.sqrt(scale * b);

  // gamma 2.2
  r = Math.pow(scale * r, GAMMA);
  g = Math.pow(scale * g, GAMMA);
  b = Math.pow(scale * b, GAMMA);

  // Write the translated [0,255] value of each color component.
  array[offset++] = r * 255;
  array[offset++] = g * 255;
  array[offset++] = b * 255;
  array[offset] = 255;
}

export function reflect(v: Vec3, n: Vec3): Vec3 {
  return vec3.subtract(v, vec3.scale(n, 2 * vec3.dot(v, n)));
}

export function refract(uv: Vec3, n: Vec3, etai_over_etat: number): Vec3 {
  const cos_theta = vec3.dot(vec3.negate(vec3.create(), uv), n);
  const uvTheta = vec3.add(vec3.create(), uv, vec3.scale(n, cos_theta));
  const r_out_parallel = vec3.scale(uvTheta, etai_over_etat);
  const r_out_perp = vec3.scale(n, -Math.sqrt(1 - vec3.lengthSq(r_out_parallel)));
  return vec3.add(r_out_parallel, r_out_perp);
}

export function random(): Vec3 {
  return vec3.create(randomNumber(), randomNumber(), randomNumber());
}

export function randomInUnitSphere(): Vec3 {
  let p: Vec3;
  do {
    p = randomRange(-1, 1);
  } while (vec3.lengthSq(p) >= 1);
  return p;
}

export function randomRange(min: number, max: number): Vec3 {
  return vec3.create(randomNumberRange(min, max), randomNumberRange(min, max), randomNumberRange(min, max));
}

export function randomUnitVector(): Vec3 {
  const a = randomNumberRange(0, 2 * Math.PI);
  const z = randomNumberRange(-1, 1);
  const r = Math.sqrt(1 - z * z);
  return vec3.create(r * Math.cos(a), r * Math.sin(a), z);
}

export function randomInHemisphere(normal: Vec3): Vec3 {
  const in_unit_sphere = randomInUnitSphere();
  if (vec3.dot(in_unit_sphere, normal) > 0.0) {
    // In the same hemisphere as the normal
    return in_unit_sphere;
  }
  return vec3.negate(in_unit_sphere, in_unit_sphere);
}

export function randomInUnitDisk(): Vec3 {
  let p: Vec3;
  do {
    p = vec3.create(randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0);
  } while (vec3.lengthSq(p) >= 1);

  return p;
}

export function mod4(x: Vec4, y: number): Vec4 {
  // x - y * floor(x/y).

  return vec4.subtract(x, vec4.scale(vec4.floor(vec4.scale(x, 1 / y)), y));
}

export function mod3(x: Vec3, y: number): Vec3 {
  // x - y * floor(x/y).

  return vec3.subtract(x, vec3.scale(vec3.floor(vec3.scale(x, 1 / y)), y));
}

export function addScalar3(v: Vec3, s: number): Vec3 {
  return vec3.fromValues(v[0] + s, v[1] + s, v[2] + s);
}

export function addScalar4(v: Vec4, s: number): Vec4 {
  return vec4.fromValues(v[0] + s, v[1] + s, v[2] + s, v[3] + s);
}

export function subScalar3(v: Vec3, s: number): Vec3 {
  return vec3.fromValues(v[0] - s, v[1] - s, v[2] - s);
}

export function subScalar4(v: Vec4, s: number): Vec4 {
  return vec4.fromValues(v[0] - s, v[1] - s, v[2] - s, v[3] - s);
}

export function step3(edge: Vec3, x: Vec3): Vec3 {
  // For element i of the return value, 0.0 is returned if x[i] < edge[i], and 1.0 is returned otherwise.
  return vec3.fromValues(x[0] < edge[0] ? 0.0 : 1.0, x[1] < edge[1] ? 0.0 : 1.0, x[2] < edge[2] ? 0.0 : 1.0);
}

export function step4(edge: Vec4, x: Vec4): Vec4 {
  // For element i of the return value, 0.0 is returned if x[i] < edge[i], and 1.0 is returned otherwise.
  return vec4.fromValues(
    x[0] < edge[0] ? 0.0 : 1.0,
    x[1] < edge[1] ? 0.0 : 1.0,
    x[2] < edge[2] ? 0.0 : 1.0,
    x[3] < edge[3] ? 0.0 : 1.0,
  );
}

export function abs3(x: Vec3): Vec3 {
  return vec3.fromValues(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
}

export function abs4(x: Vec4): Vec4 {
  return vec4.fromValues(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]), Math.abs(x[3]));
}

// export function mix3(x: vec3, y: vec3, a: vec3): vec3 {
//   // x * (1 − a) + y * a
//   return x;
// }

/*
function createRandomVecs(count: number): void {
  for (let i = 0; i < count; i++) {
    const v = unitVector(randomRange(-1, 1));
    console.log(`vec3(${v[0]}, ${v[1]}, ${v[2]}),`);
  }
}

createRandomVecs(256);
*/
