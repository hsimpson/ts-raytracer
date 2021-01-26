import {
  DielectricMaterial,
  DiffuseLight,
  IsoTropic,
  LambertianMaterial,
  MetalMaterial,
  NormalMaterial,
  UVMaterial,
} from '../material';
import { Triangle } from '../triangle';
import { AABB } from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { Box } from './box';
import { BVHNode } from './bvhnode';
import { ConstantMedium } from './constantmedium';
import { MovingSphere } from './movingsphere';
import { Perlin } from './perlin';
import { Sphere } from './sphere';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor } from './texture';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DeserializerMap = {
  lambertianMaterial: LambertianMaterial,
  metalMaterial: MetalMaterial,
  dielectricMaterial: DielectricMaterial,
  normalMaterial: NormalMaterial,
  uvMaterial: UVMaterial,
  isoTropic: IsoTropic,
  diffuseLight: DiffuseLight,

  sphere: Sphere,
  movingSphere: MovingSphere,
  bvhNode: BVHNode,
  aabb: AABB,
  checkerTexture: CheckerTexture,
  solidTexture: SolidColor,
  perlin: Perlin,
  noise: NoiseTexture,
  image: ImageTexture,
  xyRect: XYRect,
  xzRect: XZRect,
  yzRect: YZRect,
  box: Box,
  constantMedium: ConstantMedium,
  triangle: Triangle,
};
