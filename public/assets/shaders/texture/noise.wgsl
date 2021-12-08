#include "./simplex3d_noise.wgsl"
#include "./texture_base.wgsl"
#include "../utils.wgsl"

fn turb(p: vec3<f32>) -> f32 {
  var accum = 0.0;
  var tempP = p;
  var weight = 1.0;

  let depth = 7;
  for(var i=0; i<depth; i = i + 1){
    accum = accum + weight * snoise(tempP);
    weight = weight * 0.5;
    tempP = tempP * 2.0;
  }

  return abs(accum);
}

fn noiseTextureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(1.0, 1.0, 1.0) * 0.5 * (1.0 + sin(texture.scale * p.z + 10.0 * turb(p)));
}