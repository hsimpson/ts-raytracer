import { quat, vec2, vec3 } from 'gl-matrix';
import { GLTF, GLTFAccessor, GLTFBuffer, GLTFBufferView, GLTFMesh, GLTFNode } from './gltftypes';
import { HittableList, Triangle } from './hittables';
import { LambertianMaterial, Material, NormalMaterial } from './material';

// const REDMATERIAL = new LambertianMaterial([0.65, 0.05, 0.05]);
// const WHITEMATERIAL = new LambertianMaterial([0.73, 0.73, 0.73]);
const NORMALMATERIAL = new NormalMaterial();
NORMALMATERIAL.corrected = true;

export async function load(url: string): Promise<HittableList> {
  const triangleMeshArray: HittableList = new HittableList();

  const response = await fetch(url);
  const gltf = (await response.json()) as GLTF;

  // decode buffers
  const buffers = await decodeBuffers(gltf.buffers);

  // get the default scene
  const scene = gltf.scenes[gltf.scene];

  const accessors = gltf.accessors;
  const bufferViews = gltf.bufferViews;
  const materials = gltf.materials;

  const raytracingMaterial: Material[] = [];

  // create materials
  for (const material of materials) {
    const baseColor = material.pbrMetallicRoughness.baseColorFactor;
    const lamberMat = new LambertianMaterial([baseColor[0], baseColor[1], baseColor[2]]);
    raytracingMaterial.push(lamberMat);
  }

  // for each node
  for (const nodeIdx of scene.nodes) {
    const node: GLTFNode = gltf.nodes[nodeIdx];
    const mesh: GLTFMesh = gltf.meshes[node.mesh];

    const triangleMesh = new HittableList();
    triangleMesh.name = mesh.name;

    let translation = vec3.create();
    let rotation = quat.create();
    let scale = vec3.create();
    vec3.set(scale, 1, 1, 1);

    if (node.translation) {
      translation = node.translation;
    }
    if (node.rotation) {
      rotation = node.rotation;
    }

    if (node.scale) {
      scale = node.scale;
    }

    // const rot = vec3.create();
    // const rad = quat.getAxisAngle(rot, rotation);

    for (const primitive of mesh.primitives) {
      const positionAccessor: GLTFAccessor = accessors[primitive.attributes.POSITION];
      const normalAccessor: GLTFAccessor = accessors[primitive.attributes.NORMAL];
      const textureCoordAccessor: GLTFAccessor = accessors[primitive.attributes.TEXCOORD_0];

      const positionBufferView: GLTFBufferView = bufferViews[positionAccessor.bufferView];

      const vertices = getVec3List(
        new Float32Array(
          buffers[positionBufferView.buffer],
          positionBufferView.byteOffset,
          positionBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
        )
      );

      let normals;
      let textureCoords;

      if (normalAccessor) {
        const normalBufferView: GLTFBufferView = bufferViews[normalAccessor.bufferView];

        normals = getVec3List(
          new Float32Array(
            buffers[normalBufferView.buffer],
            normalBufferView.byteOffset,
            normalBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
          )
        );
      }

      if (textureCoordAccessor) {
        const textureCoordBufferView: GLTFBufferView = bufferViews[textureCoordAccessor.bufferView];

        textureCoords = getVec2List(
          new Float32Array(
            buffers[textureCoordBufferView.buffer],
            textureCoordBufferView.byteOffset,
            textureCoordBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
          )
        );
      }

      if (primitive.indices !== undefined) {
        const indicesAccessor: GLTFAccessor = accessors[primitive.indices];
        const indicesBufferView: GLTFBufferView = bufferViews[indicesAccessor.bufferView];
        const indexArray = new Uint16Array(
          buffers[indicesBufferView.buffer],
          indicesBufferView.byteOffset,
          indicesBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT
        );

        for (let i = 0; i < indicesAccessor.count; i++) {
          const a = indexArray[i];
          const b = indexArray[++i];
          const c = indexArray[++i];

          const v0 = vertices[a];
          const v1 = vertices[b];
          const v2 = vertices[c];

          let n0, n1, n2, uv0, uv1, uv2;

          if (normals) {
            n0 = normals[a];
            n1 = normals[b];
            n2 = normals[c];
          }

          if (textureCoords) {
            uv0 = textureCoords[a];
            uv1 = textureCoords[b];
            uv2 = textureCoords[c];
          }

          const triangle = new Triangle(
            v0,
            v1,
            v2,

            n0,
            n1,
            n2,

            uv0,
            uv1,
            uv2
          );

          // // TODO: material
          // triangle.material = WHITEMATERIAL;
          // triangle.material = NORMALMATERIAL;
          triangle.material = raytracingMaterial[primitive.material];

          if (node.translation) {
            triangle.transform.translate(translation);
          }
          if (node.rotation) {
            triangle.transform.rotateQuat(rotation);
          }

          // const m = mat4.create();
          // mat4.fromRotationTranslationScale(m, rotation, translation, scale);

          // TODO scale

          // triangle.applyTransform();
          triangleMesh.add(triangle);
        }
      } else {
        // TODO: non indexed vertices
      }
    }
    triangleMeshArray.add(triangleMesh);
  }

  return triangleMeshArray;
}

async function decodeBuffers(buffers: GLTFBuffer[]): Promise<ArrayBuffer[]> {
  const arrayBuffers: ArrayBuffer[] = [];

  for (const buffer of buffers) {
    const response = await fetch(buffer.uri);
    arrayBuffers.push(await response.arrayBuffer());
  }

  return arrayBuffers;
}

function getVec3List(array: Float32Array): vec3[] {
  const vec3List: vec3[] = [];

  for (let i = 0; i < array.length; i++) {
    const x = array[i];
    const y = array[++i];
    const z = array[++i];
    vec3List.push([x, y, z]);
  }

  return vec3List;
}

function getVec2List(array: Float32Array): vec2[] {
  const vec2List: vec2[] = [];

  for (let i = 0; i < array.length; i++) {
    const u = array[i];
    const v = array[++i];
    vec2List.push([u, v]);
  }

  return vec2List;
}
