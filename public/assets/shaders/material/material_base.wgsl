struct Material {
  baseColor: vec4<f32>,
  roughness: f32,
  indexOfRefraction: f32,
  materialType: u32,
  textureIndex: u32,
};

struct Materials {
  materials: array<Material>,
};

@group(0) @binding(5) var<storage, read_write> materialBuffer: Materials;
