export interface GLTFBuffer {
  byteLength: number;
  uri: string;
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
  max: [number, number, number];
  min: [number, number, number];
  type: GLTFAccessorType;
}

export interface GLTFBufferView {
  buffer: number;
  byteLength: number;
  byteOffset: number;
}
