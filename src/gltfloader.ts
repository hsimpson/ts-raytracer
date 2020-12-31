import { Triangle } from './triangle';
import { TriangleMesh } from './trianglemesh';
import { GLTFBuffer, GLTFBufferView, GLTFAccessor } from './gltftypes';
import { vec2, vec3 } from 'gl-matrix';

export async function load(url: string): Promise<TriangleMesh> {
  const triangleMesh: TriangleMesh = new TriangleMesh();

  const response = await fetch(url);
  const gltf = await response.json();

  // decode buffers
  const buffers = await decodeBuffers(gltf.buffers);

  // get 1st scene
  const scene = gltf.scenes[0];

  const accessors = gltf.accessors;
  const bufferViews = gltf.bufferViews;

  // for each node
  for (const nodeIdx of scene.nodes) {
    const node = gltf.nodes[nodeIdx];
    const mesh = gltf.meshes[node.mesh];

    for (const primitive of mesh.primitives) {
      const positionAccessor: GLTFAccessor = accessors[primitive.attributes.POSITION];
      const normalAccessor: GLTFAccessor = accessors[primitive.attributes.NORMAL];
      const textureCoordAccessor: GLTFAccessor = accessors[primitive.attributes.TEXCOORD_0];

      const positionBufferView: GLTFBufferView = bufferViews[positionAccessor.bufferView];
      const normalBufferView: GLTFBufferView = bufferViews[normalAccessor.bufferView];
      const textureCoordBufferView: GLTFBufferView = bufferViews[textureCoordAccessor.bufferView];

      const vertices = getVec3List(
        new Float32Array(
          buffers[positionBufferView.buffer],
          positionBufferView.byteOffset,
          positionBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
        )
      );

      const normals = getVec3List(
        new Float32Array(
          buffers[normalBufferView.buffer],
          normalBufferView.byteOffset,
          normalBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
        )
      );

      const textureCoords = getVec2List(
        new Float32Array(
          buffers[textureCoordBufferView.buffer],
          textureCoordBufferView.byteOffset,
          textureCoordBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT
        )
      );

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

          const triangle = new Triangle(
            vertices[a],
            vertices[b],
            vertices[c],
            normals[a],
            normals[b],
            normals[c],
            textureCoords[a],
            textureCoords[b],
            textureCoords[c]
          );
          triangleMesh.add(triangle);
        }
      } else {
        // TODO: non indexed vertices
      }

      // TODO: material
    }
  }

  return triangleMesh;
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
