import { AABB } from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { Box } from './box';
import { BVHNode } from './bvhnode';
import { ConstantMedium } from './constantmedium';
import { DielectricMaterial } from '../material/dielectric';
import { DiffuseLight } from '../material/diffuselight';
import { IsoTropic } from '../material/isotropic';
import { LambertianMaterial } from '../material/lambertian';
import { MetalMaterial } from '../material/metal';
import { MovingSphere } from './movingsphere';
import { Perlin } from './perlin';
import { Sphere } from './sphere';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor } from './texture';
import { TriangleMesh } from '../trianglemesh';
import { Triangle } from '../triangle';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DeserializerMap = {
  lambertianMaterial: LambertianMaterial,
  metalMaterial: MetalMaterial,
  dielectricMaterial: DielectricMaterial,
  sphere: Sphere,
  movingSphere: MovingSphere,
  bvhNode: BVHNode,
  aabb: AABB,
  checkerTexture: CheckerTexture,
  solidTexture: SolidColor,
  perlin: Perlin,
  noise: NoiseTexture,
  image: ImageTexture,
  diffuseLight: DiffuseLight,
  xyRect: XYRect,
  xzRect: XZRect,
  yzRect: YZRect,
  box: Box,
  constantMedium: ConstantMedium,
  isoTropic: IsoTropic,
  triangleMesh: TriangleMesh,
  triangle: Triangle,
};
