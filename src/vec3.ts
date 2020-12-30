import { randomNumber, randomNumberRange } from './util';
export type Vec3 = [r: number, g: number, b: number] | [x: number, y: number, z: number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isVec3(v: any): v is Vec3 {
  return Array.isArray(v) && typeof v[0] === 'number' && typeof v[1] === 'number' && typeof v[2] === 'number';
}

export function set(v: Vec3, ...u: Vec3): void {
  [v[0], v[1], v[2]] = u;
}

export function copyTo(v: Vec3, dest: Vec3): void {
  [dest[0], dest[1], dest[2]] = v;
}

export function clone(v: Vec3): Vec3 {
  return [...v];
}

export function r(v: Vec3): number;
export function r(v: Vec3, r: number): void;
export function r(v: Vec3, r?: number): number {
  return r === undefined ? v[0] : (v[0] = r);
}

export function g(v: Vec3): number;
export function g(v: Vec3, g: number): void;
export function g(v: Vec3, g?: number): number {
  return g === undefined ? v[1] : (v[1] = g);
}

export function b(v: Vec3): number;
export function b(v: Vec3, b: number): void;
export function b(v: Vec3, b?: number): number {
  return r === undefined ? v[2] : (v[2] = b);
}

export function length(v: Vec3): number {
  return Math.sqrt(lengthSquared(v));
}

export function lengthSquared(v: Vec3): number {
  return v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
}

export function negate(v: Vec3): Vec3 {
  return [-v[0], -v[1], -v[2]];
}

export function addScalar(v: Vec3, t: number): Vec3 {
  return [v[0] + t, v[1] + t, v[2] + t];
}

export function multiplyScalar(v: Vec3, t: number): Vec3 {
  return [v[0] * t, v[1] * t, v[2] * t];
}

export function divideScalar(v: Vec3, t: number): Vec3 {
  return [v[0] / t, v[1] / t, v[2] / t];
}

export function toString(v: Vec3): string {
  return `${v[0]}, ${v[1]}, ${v[2]}`;
}

export function addVec3(u: Vec3, v: Vec3): Vec3 {
  return [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
}

export function subVec3(u: Vec3, v: Vec3): Vec3 {
  return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
}

export function multVec3(u: Vec3, v: Vec3): Vec3 {
  return [u[0] * v[0], u[1] * v[1], u[2] * v[2]];
}

export function multScalarVec3(v: Vec3, t: number): Vec3 {
  return [t * v[0], t * v[1], t * v[2]];
}

export function divScalarVec(v: Vec3, t: number): Vec3 {
  return [v[0] / t, v[1] / t, v[2] / t];
}

export function dot(u: Vec3, v: Vec3): number {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}

export function cross(u: Vec3, v: Vec3): Vec3 {
  // prettier-ignore
  return [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0]
  ];
}

export function unitVector(v: Vec3): Vec3 {
  return divScalarVec(v, length(v));
}

export function random(): Vec3 {
  return [randomNumber(), randomNumber(), randomNumber()];
}

export function randomRange(min: number, max: number): Vec3 {
  return [randomNumberRange(min, max), randomNumberRange(min, max), randomNumberRange(min, max)];
}

export function randomInUnitSphere(): Vec3 {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p = randomRange(-1, 1);
    if (lengthSquared(p) >= 1) {
      continue;
    }
    return p;
  }
}

export function randomUnitVector(): Vec3 {
  const a = randomNumberRange(0, 2 * Math.PI);
  const z = randomNumberRange(-1, 1);
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), r * Math.sin(a), z];
}

export function randomInHemisphere(normal: Vec3): Vec3 {
  const in_unit_sphere = randomInUnitSphere();
  if (dot(in_unit_sphere, normal) > 0.0) {
    // In the same hemisphere as the normal
    return in_unit_sphere;
  } else {
    return negate(in_unit_sphere);
  }
}

export function reflect(v: Vec3, n: Vec3): Vec3 {
  return subVec3(v, multScalarVec3(n, 2 * dot(v, n)));
}

export function refract(uv: Vec3, n: Vec3, etai_over_etat: number): Vec3 {
  const cos_theta = dot(negate(uv), n);
  const uvTheta = addVec3(uv, multScalarVec3(n, cos_theta));
  const r_out_parallel = multScalarVec3(uvTheta, etai_over_etat);
  const r_out_perp = multScalarVec3(n, -Math.sqrt(1 - lengthSquared(r_out_parallel)));
  return addVec3(r_out_parallel, r_out_perp);
}

export function randomInUnitdisk(): Vec3 {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p: Vec3 = [randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0];
    if (lengthSquared(p) >= 1) {
      continue;
    }
    return p;
  }
}

export function writeColor(array: Uint8ClampedArray, offset: number, color: Vec3, samples_per_pixel: number): void {
  let r = color[0];
  let g = color[1];
  let b = color[2];

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

/*
function createRandomVecs(count: number): void {
  for (let i = 0; i < count; i++) {
    const v = unitVector(randomRange(-1, 1));
    console.log(`vec3(${v[0]}, ${v[1]}, ${v[2]}),`);
  }
}

createRandomVecs(256);
*/
