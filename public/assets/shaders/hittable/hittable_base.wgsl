struct Primitve {
  objectToWorld: mat4x4<f32>,
  inverseMatrix: mat4x4<f32>,
  inverseRotation: mat4x4<f32>,
  
  bounds: vec4<f32>,
  center0: vec4<f32>,  // center0 xyz, time0 w
  center1: vec4<f32>,  // center1 xyz, time1 w

  v0: vec4<f32>,  // triangle vertex normal
  v1: vec4<f32>,  // triangle vertex normal
  v2: vec4<f32>,  // triangle vertex normal
  
  n0: vec4<f32>,  // triangle vertex normal
  n1: vec4<f32>,  // triangle vertex normal
  n2: vec4<f32>,  // triangle vertex normal
  
  uv0: vec4<f32>,  // triangle vertex texture coordinate
  uv1: vec4<f32>,  // triangle vertex texture coordinate
  uv2: vec4<f32>,  // triangle vertex texture coordinate

  radius: f32,
  k: f32,

  primitiveType: u32,
  materialIndex: u32,

  // padding
  // float pad_0,
  // float pad_1,
};

struct Primitives {
  primitives: array<Primitve>,
};

@group(0) @binding(4) var<storage, read_write> primitivesBuffer: Primitives;
