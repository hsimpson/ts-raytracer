import { Box, BVHNode, ConstantMedium, MovingSphere, Sphere, Triangle, XYRect, XZRect, YZRect } from '../hittables';
import {
  DielectricMaterial,
  DiffuseLight,
  IsoTropic,
  LambertianMaterial,
  MetalMaterial,
  NormalMaterial,
  UVMaterial,
} from '../material';
import { AABB } from './aabb';
import { Perlin } from './perlin';
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
