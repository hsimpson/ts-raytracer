import AABB from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import Box from './box';
import BVHNode from './bvhnode';
import DielectricMaterial from './dielectric';
import DiffuseLight from './diffuselight';
import LambertianMaterial from './lambertian';
import MetalMaterial from './metal';
import MovingSphere from './movingsphere';
import Perlin from './perlin';
import { RotateY } from './rotation';
import Sphere from './sphere';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor } from './texture';
import Translate from './translate';

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
  translate: Translate,
  rotateY: RotateY,
};
