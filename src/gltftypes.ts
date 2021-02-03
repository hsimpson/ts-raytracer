// see: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#objects

type Num3 = [number, number, number];
type Num4 = [number, number, number, number];

export interface GLTF {
  nodes: GLTFNode[];
  buffers: GLTFBuffer[];
  scene: number;
  scenes: GLTFScene[];
  accessors: GLTFAccessor[];
  bufferViews: GLTFBufferView[];
  meshes: GLTFMesh[];
  materials: GLTFMaterial[];
}

export interface GLTFBuffer {
  byteLength: number;
  uri: string;
}

export interface GLTFScene {
  name: string;
  nodes: number[];
}

export enum GLTFComponentType {
  BYTE = 5120,
  UNSIGNED_BYTE = 5121,
  SHORT = 5122,
  UNSIGNED_SHORT = 5123,
  UNSIGNED_INT = 5125,
  FLOAT = 5126,
}

export enum GLTFAccessorType {
  SCALAR,
  VEC2,
  VEC3,
  VEC4,
  MAT2,
  MAT3,
  MAT4,
}

export interface GLTFAccessor {
  bufferView: number;
  componentType: GLTFComponentType;
  count: number;
  max: Num3;
  min: Num3;
  type: GLTFAccessorType;
}

export interface GLTFBufferView {
  buffer: number;
  byteLength: number;
  byteOffset: number;
}

export interface GLTFNode {
  mesh: number;
  name?: string;
  rotation?: Num4;
  translation?: Num3;
  scale?: Num3;
}

export interface GLTFMesh {
  name?: string;
  primitives: GLTFPrimitive[];
}

export interface GLTFPrimitive {
  attributes: GLTFAttribute;
  indices?: number;
  material?: number;
}

export type GLTFAttributeName =
  | 'POSITION'
  | 'NORMAL'
  | 'TANGENT'
  | 'TEXCOORD_0'
  | 'TEXCOORD_1'
  | 'COLOR_0'
  | 'JOINTS_0'
  | 'WEIGHTS_0';

export type GLTFAttribute = { [key in GLTFAttributeName]: number };

export interface GLTFMaterial {
  doubleSided: boolean;
  name?: string;
  pbrMetallicRoughness?: GLTFPBRMetallicRoughness;
}

export interface GLTFPBRMetallicRoughness {
  baseColorFactor?: Num4;
}
