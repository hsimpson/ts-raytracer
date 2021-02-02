import { mat4 } from 'gl-matrix';
import type { Vec3 } from './vec3';

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
  array = [].concat(
    ...array.slice(0, start),
    ...array.slice(start, start + end).sort(compareFn),
    ...array.slice(start + end, array.length)
  );
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
}
