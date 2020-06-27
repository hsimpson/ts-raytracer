export function degree_to_radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function random_number(): number {
  return Math.random();
}

export function random_numberRange(min: number, max: number): number {
  return min + (max - min) * random_number();
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
