#include "./texture_base.wgsl"

// TODO: support other textures then SolidTexture

fn modulo(x: f32) -> f32 {
  return x - floor(x);
}

fn checkerTextureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  let xy = uv * texture.scale;
  let x = bool(modulo(xy.x) < 0.5);
  let y = bool(modulo(xy.y) < 0.5);

  if ( (x && y) || (!x && !y) ) {
    return texture.checkerOdd.rgb;
  }

  return texture.checkerEven.rgb;
}