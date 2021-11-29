struct Material {
  baseColor: vec4<f32>;
  roughness: f32;
  indexOfRefraction: f32;
  materialType: u32;
  textureIndex: u32;
};

[[block]] struct Materials {
  materials: array<Material>;
};

[[binding(5), group(0)]] var<storage, read_write> materialBuffer: Materials;
