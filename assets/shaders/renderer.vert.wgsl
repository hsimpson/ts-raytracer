struct VertexInput {
  [[location(0)]] position : vec3<f32>;
};

struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

[[stage(vertex)]]
fn main(input: VertexInput) -> VertexOutput {
  var output = VertexOutput();
  output.position = vec4<f32>(input.position, 1.0);
  output.uv = input.position.xy;
  output.uv.y = output.uv.y * -1.0;
  output.uv = (output.uv + 1.0) / 2.0;

  return output;
}