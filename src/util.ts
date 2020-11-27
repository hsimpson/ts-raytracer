import { mat4 } from 'gl-matrix';

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
