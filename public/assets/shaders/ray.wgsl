#include "./utils.wgsl"

struct Ray {
  origin: vec3<f32>;
  direction: vec3<f32>;
  time: f32;
};

struct HitRecord {
  p: vec3<f32>;
  normal: vec3<f32>;
  t: f32;
  uv: vec2<f32>;
  frontFace: bool;
  materialIndex: u32;
};

fn setFaceNormal(
  rec: ptr<function, HitRecord, read_write>,
  ray: ptr<function, Ray, read_write>,
  outwardNormal: vec3<f32>) {
  if(dot((*ray).direction, outwardNormal) < 0.0) {
    (*rec).frontFace = true;
    (*rec).normal = outwardNormal;
  } else {
    (*rec).frontFace = false;
    (*rec).normal = -outwardNormal;
  }
}

fn rayAt(ray: ptr<function, Ray, read_write>, t: f32) -> vec3<f32> {
  return (*ray).origin + t * (*ray).direction;
}

fn transformRay(
  ray: ptr<function, Ray, read_write>, 
  inverseMatrix: mat4x4<f32>,
  inverseRotation: mat4x4<f32>) -> Ray {
  
  let origin: vec4<f32> = inverseMatrix * vec4<f32>((*ray).origin, 1.0);
  let direction: vec4<f32> = inverseRotation * vec4<f32>((*ray).direction, 1.0);

  return Ray (
    origin.xyz,
    direction.xyz,
    (*ray).time
  );
}

fn transformRecord(rec: ptr<function, HitRecord, read_write>, objectToWorld: mat4x4<f32>) {
  (*rec).p = (objectToWorld * vec4<f32>((*rec).p, 1.0)).xyz;
  // mat3 normalMatrix = transpose(inverse(mat3(primitve.objectToWorld)));
  // mat3 normalMatrix = /*transpose*/ (inverse(mat3(rotationMatrix)));
  // vec3 transformedN = normalMatrix * rec.normal;
  // vec3 transformedN = (rotationMatrix * vec4(rec.normal, 1.0)).xyz;
  // setFaceNormal(rec, transformedRay, normalize(transformedN));
}
