export interface ComputeTile {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createComputeTiles(imageWidth: number, imageHeight: number, tileSize: number): ComputeTile[] {
  const computeTiles: ComputeTile[] = [];
  for (let y = 0; y < imageHeight; y += tileSize) {
    for (let x = 0; x < imageWidth; x += tileSize) {
      computeTiles.push({
        x,
        y,
        width: x + tileSize < imageWidth ? tileSize : imageWidth - x,
        height: y + tileSize < imageHeight ? tileSize : imageHeight - y,
      });
    }
  }
  return computeTiles;
}
