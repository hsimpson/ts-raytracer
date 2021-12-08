
let PI = 3.1415926538;
var<private> seed: u32;

fn initSeed(s: u32) {
    seed = s;
}

fn tauStep(z: u32, s1: u32, s2: u32, s3: u32, M: u32) -> u32 {
  let b: u32 = (((z << s1) ^ z) >> s2);
  var z1 = (((z & M) << s3) ^ b);
  return z1;
}

fn random() -> f32 {
  var z1: u32;
  var z2: u32;
  var z3: u32;
  var z4: u32;
  var r:  u32;

  z1    = tauStep(seed, 13u, 19u, 12u, 429496729u);
  z2    = tauStep(seed, 2u, 25u, 4u, 4294967288u);
  z3    = tauStep(seed, 3u, 11u, 17u, 429496280u);
  z4    = (1664525u * seed + 1013904223u);
  seed = (z1 ^ z2 ^ z3 ^ z4);
  return f32(seed) * 2.3283064365387e-10;
}

fn randomMinMax(min: f32, max: f32) -> f32 {
  return min + (max - min) * random();
}

fn randomVec3() -> vec3<f32> {
  return vec3<f32>(random(), random(), random());
}

fn randomVec3MinMax(min: f32, max: f32) -> vec3<f32> {
  return vec3<f32>(randomMinMax(min, max), randomMinMax(min, max), randomMinMax(min, max));
}

fn lengthSquared(v: vec3<f32>) -> f32 {
  return v.x * v.x + v.y * v.y + v.z * v.z;
}

fn randomInUnitSphere() ->vec3<f32> {
  var notInSphere = true;
  var p: vec3<f32>;

  loop {
    if(notInSphere == false) {
      break;
    }

    p = randomVec3MinMax(-1.0, 1.0);
    if(lengthSquared(p) < 1.0) {
      notInSphere = false;
    }
  }

  return p;
}

fn randomUnitVector() -> vec3<f32> {
  let a = randomMinMax(0.0, 2.0 * PI);
  let z = randomMinMax(-1.0, 1.0);
  let r = sqrt(1.0 - z * z);
  return vec3<f32>(r * cos(a), r * sin(a), z);
}

fn randomInHemisphere(normal: vec3<f32>) -> vec3<f32> {
  let inUnitSphere = randomInUnitSphere();
  if(dot(inUnitSphere, normal) > 0.0) {
    return inUnitSphere;
  } 
  return -inUnitSphere;
}

fn randomInUnitDisk() -> vec3<f32> {
  let p = vec3<f32>(randomMinMax(-1.0, 1.0), randomMinMax(-1.0, 1.0), 0.0);
  return normalize(p);
}

fn getSphereUV(p: vec3<f32>) -> vec2<f32> {
  let phi = atan2(p.z, p.x);
  let theta = asin(p.y);
  var uv: vec2<f32>;
  uv.x = 1.0 - (phi + PI) / (2.0 * PI);
  uv.y = (theta + PI / 2.0) / PI;
  return uv;
}
