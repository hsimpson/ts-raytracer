struct Primitve {
  objectToWorld: mat4x4<f32>;
  bounds: vec4<f32>;
  center0: vec4<f32>;  // center0 xyz, time0 w
  center1: vec4<f32>;  // center1 xyz, time1 w

  v0: vec4<f32>;  // triangle vertex normal
  v1: vec4<f32>;  // triangle vertex normal
  v2: vec4<f32>;  // triangle vertex normal
  
  n0: vec4<f32>;  // triangle vertex normal
  n1: vec4<f32>;  // triangle vertex normal
  n2: vec4<f32>;  // triangle vertex normal
  
  uv0: vec4<f32>;  // triangle vertex texture coordinate
  uv1: vec4<f32>;  // triangle vertex texture coordinate
  uv2: vec4<f32>;  // triangle vertex texture coordinate

  radius: f32;
  k: f32;

  primitiveType: u32;
  materialIndex: u32;

  // padding
  // float pad_0;
  // float pad_1;
};

[[block]] struct Primitives {
  primitives: array<Primitve>;
};

[[binding(4), group(0)]] var<storage, read_write> primitivesBuffer: Primitives;