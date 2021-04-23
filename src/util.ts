import { vec3, vec4, mat4 } from 'gl-matrix';

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

export function sortArrayRange<T>(array: T[], start: number, end: number, compareFn: (a: T, b: T) => number): void {
  array = [].concat(...array.slice(0, start), ...array.slice(start, end).sort(compareFn), ...array.slice(end));
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function logMatrix(mat: mat4): void {
  const m = [];
  for (let i = 0; i < mat.length; i++) {
    m.push(mat[i].toFixed(2));
  }

  console.log(`${m[0]}, ${m[4]}, ${m[8]}, ${m[12]}`);
  console.log(`${m[1]}, ${m[5]}, ${m[9]}, ${m[13]}`);
  console.log(`${m[2]}, ${m[6]}, ${m[10]}, ${m[14]}`);
  console.log(`${m[3]}, ${m[7]}, ${m[11]}, ${m[15]}`);
}

export function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) === 0 && value !== 0;
}

export function nextPowerOf2(value: number): number {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

export function getSphereUV(p: vec3): { u: number; v: number } {
  const phi = Math.atan2(p[2], p[0]);
  const theta = Math.asin(p[1]);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}

export function writeColor(array: Uint8ClampedArray, offset: number, color: vec3, spp: number): void {
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
  array[offset++] = 255;
}

export function lengthSquared(v: vec3): number {
  return v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
}

export function reflect(v: vec3, n: vec3): vec3 {
  return vec3.subtract(vec3.create(), v, vec3.scale(vec3.create(), n, 2 * vec3.dot(v, n)));
}

export function refract(uv: vec3, n: vec3, etai_over_etat: number): vec3 {
  const cos_theta = vec3.dot(vec3.negate(vec3.create(), uv), n);
  const uvTheta = vec3.add(vec3.create(), uv, vec3.scale(vec3.create(), n, cos_theta));
  const r_out_parallel = vec3.scale(vec3.create(), uvTheta, etai_over_etat);
  const r_out_perp = vec3.scale(vec3.create(), n, -Math.sqrt(1 - lengthSquared(r_out_parallel)));
  return vec3.add(vec3.create(), r_out_parallel, r_out_perp);
}

export function random(): vec3 {
  return [randomNumber(), randomNumber(), randomNumber()];
}

export function randomInUnitSphere(): vec3 {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p = randomRange(-1, 1);
    if (lengthSquared(p) >= 1) {
      continue;
    }
    return p;
  }
}

export function randomRange(min: number, max: number): vec3 {
  return [randomNumberRange(min, max), randomNumberRange(min, max), randomNumberRange(min, max)];
}

export function randomUnitVector(): vec3 {
  const a = randomNumberRange(0, 2 * Math.PI);
  const z = randomNumberRange(-1, 1);
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), r * Math.sin(a), z];
}

export function randomInHemisphere(normal: vec3): vec3 {
  const in_unit_sphere = randomInUnitSphere();
  if (vec3.dot(in_unit_sphere, normal) > 0.0) {
    // In the same hemisphere as the normal
    return in_unit_sphere;
  }
  return vec3.negate(in_unit_sphere, in_unit_sphere);
}

export function randomInUnitdisk(): vec3 {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p: vec3 = [randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0];
    if (lengthSquared(p) >= 1) {
      continue;
    }
    return p;
  }
}

export function mod4(x: vec4, y: number): vec4 {
  // x - y * floor(x/y).

  return vec4.subtract(
    vec4.create(),
    x,
    vec4.scale(vec4.create(), vec4.floor(vec4.create(), vec4.scale(vec4.create(), x, 1 / y)), y)
  );
}

export function mod3(x: vec3, y: number): vec3 {
  // x - y * floor(x/y).

  return vec3.subtract(
    vec3.create(),
    x,
    vec3.scale(vec3.create(), vec3.floor(vec3.create(), vec3.scale(vec3.create(), x, 1 / y)), y)
  );
}

export function addScalar3(v: vec3, s: number): vec3 {
  return vec3.fromValues(v[0] + s, v[1] + s, v[2] + s);
}

export function addScalar4(v: vec4, s: number): vec4 {
  return vec4.fromValues(v[0] + s, v[1] + s, v[2] + s, v[3] + s);
}

export function subScalar3(v: vec3, s: number): vec3 {
  return vec3.fromValues(v[0] - s, v[1] - s, v[2] - s);
}

export function subScalar4(v: vec4, s: number): vec4 {
  return vec4.fromValues(v[0] - s, v[1] - s, v[2] - s, v[3] - s);
}

export function step3(edge: vec3, x: vec3): vec3 {
  // For element i of the return value, 0.0 is returned if x[i] < edge[i], and 1.0 is returned otherwise.
  return vec3.fromValues(x[0] < edge[0] ? 0.0 : 1.0, x[1] < edge[1] ? 0.0 : 1.0, x[2] < edge[2] ? 0.0 : 1.0);
}

export function step4(edge: vec4, x: vec4): vec4 {
  // For element i of the return value, 0.0 is returned if x[i] < edge[i], and 1.0 is returned otherwise.
  return vec4.fromValues(
    x[0] < edge[0] ? 0.0 : 1.0,
    x[1] < edge[1] ? 0.0 : 1.0,
    x[2] < edge[2] ? 0.0 : 1.0,
    x[3] < edge[3] ? 0.0 : 1.0
  );
}

export function abs3(x: vec3): vec3 {
  return vec3.fromValues(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
}

export function abs4(x: vec4): vec4 {
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
