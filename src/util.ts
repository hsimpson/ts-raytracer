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
