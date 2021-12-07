struct Texture {
  color: vec4<f32>;
  checkerOdd: vec4<f32>;
  checkerEven: vec4<f32>;
  uvOffset: vec2<f32>;
  scale: f32;

  textureType: u32;
  imageTextureIndex: u32;

  // padding
  pad_0: f32;
  pad_1: f32;
  pad_2: f32;
};

[[block]] struct Textures {
  textures: array<Texture>;
};

[[group(0), binding(6)]] var<storage, read_write> textureBuffer: Textures;
