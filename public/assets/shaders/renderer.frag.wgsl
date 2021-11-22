
struct FragmentInput {
  [[location(0)]] uv: vec2<f32>;
};

struct FragmentOutput {
  [[location(0)]] fragColor: vec4<f32>;
};

[[block]] struct ComputeParams {
  width: f32;
  height: f32;
};
[[binding(0), group(0)]] var<uniform> computeParams : ComputeParams;

[[block]] struct PixelBuffer {
  pixels: array<vec4<f32>>;

};
[[binding(1), group(0)]] var<storage, read> pixelBuffer : PixelBuffer;

[[stage(fragment)]]
fn main(input: FragmentInput) -> FragmentOutput {
  var output = FragmentOutput();
  let resolution: vec2<f32> = vec2<f32>(computeParams.width, computeParams.height);

  let bufferCoord: vec2<u32> = vec2<u32>(floor(input.uv * resolution));
  let pixelIndex: u32 = bufferCoord.y * u32(resolution.x) + bufferCoord.x;
  output.fragColor = pixelBuffer.pixels[pixelIndex];

  return output;
}
