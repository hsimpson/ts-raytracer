import { mat4, quat, vec2, vec4 } from 'gl-matrix';
import {
  Box,
  MovingSphere as HMovingSphere,
  Sphere as HSphere,
  Triangle as HTriangle,
  XYRect as HXYRect,
  XZRect as HXZRect,
  YZRect as HYZRect,
  Hittable,
  HittableList,
} from '../hittables';
import {
  DielectricMaterial,
  LambertianMaterial,
  DiffuseLight as MDiffuseLight,
  Material,
  MetalMaterial,
  NormalMaterial,
} from '../material';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor, Texture } from '../textures';
import { nextPowerOf2 } from '../util';
import { WebGPUContext } from './webgpucontext';

enum WebGPUMaterialType {
  Lambertian = 0,
  Metal = 1,
  Dielectric = 2,
  IsoTropic = 3,
  DiffuseLight = 4,
  Normal = 5,
}

export enum WebGPUPrimitiveType {
  Sphere = 0,
  MovingSphere = 1,
  XYRect = 2,
  XZRect = 3,
  YZRect = 4,
  // ConstantMedium = 5,
  Triangle = 6,
  // HittableList = 99,
}

export enum WebGPUTextureType {
  Solid = 0,
  Checker = 1,
  Noise = 2,
  Image = 3,
}

interface WebGPUTexture {
  color: vec4;
  checkerOdd: vec4;
  checkerEven: vec4;
  uvOffset: vec2;
  scale: number;
  textureType: number;
  imageTextureIndex: number;

  // padding
  pad_0: number;
  pad_1: number;
  pad_2: number;

  // optional for managing
  hasImageTexture?: boolean;
}
interface WebGPUMaterial {
  baseColor: vec4;
  roughness: number;
  indexOfRefraction: number;
  materialType: WebGPUMaterialType;
  textureIndex: number;
}

interface WebGPUPrimitive {
  objectToWorld: mat4;
  bounds: vec4;
  center0: vec4;
  center1: vec4;

  v0: vec4; // triangle vertex
  v1: vec4; // triangle vertex
  v2: vec4; // triangle vertex

  n0: vec4; // triangle vertex normal
  n1: vec4; // triangle vertex normal
  n2: vec4; // triangle vertex normal

  uv0: vec4; // triangle vertex texture coordinate
  uv1: vec4; // triangle vertex texture coordinate
  uv2: vec4; // triangle vertex texture coordinate

  radius: number;
  k: number;

  primitiveType: number;
  materialIndex: number;

  // padding
  // pad_0: number;
}

const PADDING_VALUE = -99;

function log(message: string, bufferData: ArrayBuffer): void {
  const bytes = new Uint8Array(bufferData);
  let byteString = '';
  bytes.forEach(value => {
    byteString += value.toString(16).padStart(2, '0') + '';
  });
  console.log(message, byteString);
}

export class RaytracingBuffers {
  private _gpuMaterials: WebGPUMaterial[] = [];
  private _gpuPrimitives: WebGPUPrimitive[] = [];
  private _gpuTextures: WebGPUTexture[] = [];
  private _textureSize = 2;
  private _imageTextures: ImageTexture[] = [];

  public constructor(world: HittableList) {
    this.traverseHittables(world, mat4.create());
  }

  public get hasImageTextures(): boolean {
    return this._imageTextures.length > 0;
  }

  private traverseHittables(list: HittableList, objectToWorld: mat4): void {
    for (const object of list.objects) {
      const currentObjectToWorld = object.transform.objectToWorld;
      mat4.multiply(currentObjectToWorld, objectToWorld, currentObjectToWorld);

      if (object instanceof HittableList) {
        this.traverseHittables(object, currentObjectToWorld);
      } else if (object instanceof Box) {
        this.traverseHittables(object.sides, currentObjectToWorld);
      } else {
        this.addPrimitive(object, currentObjectToWorld);
      }
    }
  }

  private addTexture(tex: Texture): number {
    const idx = this._gpuTextures.length;
    const gpuTex: WebGPUTexture = {
      color: [1, 1, 1, 1],
      checkerOdd: [1, 1, 1, 1],
      checkerEven: [1, 1, 1, 1],
      uvOffset: [1, 1],
      scale: 1,
      textureType: WebGPUTextureType.Solid,
      imageTextureIndex: -1,
      pad_0: PADDING_VALUE,
      pad_1: PADDING_VALUE,
      pad_2: PADDING_VALUE,
    };

    if (tex instanceof SolidColor) {
      gpuTex.color = vec4.fromValues(tex.color[0], tex.color[1], tex.color[2], 1);
      gpuTex.textureType = WebGPUTextureType.Solid;
    } else if (tex instanceof CheckerTexture) {
      gpuTex.checkerOdd = vec4.fromValues(tex.odd[0], tex.odd[1], tex.odd[2], 1);
      gpuTex.checkerEven = vec4.fromValues(tex.even[0], tex.even[1], tex.even[2], 1);
      gpuTex.scale = tex.scale;
      gpuTex.textureType = WebGPUTextureType.Checker;
    } else if (tex instanceof NoiseTexture) {
      gpuTex.scale = tex.scale;
      gpuTex.textureType = WebGPUTextureType.Noise;
    } else if (tex instanceof ImageTexture) {
      this._textureSize = Math.max(this.getNextPowerOf2(tex.width, tex.height), this._textureSize);
      gpuTex.textureType = WebGPUTextureType.Image;
      gpuTex.imageTextureIndex = this._imageTextures.length;
      gpuTex.hasImageTexture = true;
      this._imageTextures.push(tex);
    }

    this._gpuTextures.push(gpuTex);

    return idx;
  }

  private addMaterial(mat: Material): number {
    const idx = this._gpuMaterials.length;
    let gpuMat: WebGPUMaterial;

    const tex = mat.texture;
    // const textureIndex = mat.texture ? this.addTexture(tex) : -1;
    const textureIndex = this.addTexture(mat.texture);

    if (mat instanceof LambertianMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.Lambertian,
        textureIndex,
      };
    } else if (mat instanceof MetalMaterial) {
      gpuMat = {
        baseColor: vec4.fromValues(mat.baseColor[0], mat.baseColor[1], mat.baseColor[2], 1),
        roughness: mat.roughness,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.Metal,
        textureIndex,
      };
    } else if (mat instanceof DielectricMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: mat.indexOfRefraction,
        materialType: WebGPUMaterialType.Dielectric,
        textureIndex,
      };
    } else if (mat instanceof MDiffuseLight) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.DiffuseLight,
        textureIndex,
      };
    } else if (mat instanceof NormalMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.Normal,
        textureIndex,
      };
    }

    this._gpuMaterials.push(gpuMat);

    return idx;
  }

  private addPrimitive(obj: Hittable, objectToWorld: mat4): number {
    const idx = this._gpuPrimitives.length;
    let gpuPrimitive: WebGPUPrimitive;

    const mat = obj.material;
    const materialIndex = obj.material ? this.addMaterial(mat) : -1;

    const sphereDummy = {
      center0: vec4.create(),
      center1: vec4.create(),
      radius: 0,
    };

    const rectDummy = {
      bounds: vec4.create(),
      k: 0,
    };

    const triangleDummy = {
      v0: vec4.create(),
      v1: vec4.create(),
      v2: vec4.create(),

      n0: vec4.create(),
      n1: vec4.create(),
      n2: vec4.create(),

      uv0: vec4.create(),
      uv1: vec4.create(),
      uv2: vec4.create(),
    };

    if (obj instanceof HSphere) {
      gpuPrimitive = {
        objectToWorld,
        center0: vec4.fromValues(obj.center[0], obj.center[1], obj.center[2], 0),
        center1: [0, 0, 0, 1],
        radius: obj.radius,

        ...rectDummy,
        ...triangleDummy,

        primitiveType: WebGPUPrimitiveType.Sphere,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof HMovingSphere) {
      gpuPrimitive = {
        objectToWorld,
        center0: vec4.fromValues(obj.center0[0], obj.center0[1], obj.center0[2], obj.time0),
        center1: vec4.fromValues(obj.center1[0], obj.center1[1], obj.center1[2], obj.time1),
        radius: obj.radius,

        ...rectDummy,
        ...triangleDummy,

        primitiveType: WebGPUPrimitiveType.MovingSphere,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof HXYRect) {
      gpuPrimitive = {
        objectToWorld,
        bounds: [obj.x0, obj.x1, obj.y0, obj.y1],
        k: obj.k,

        ...sphereDummy,
        ...triangleDummy,

        primitiveType: WebGPUPrimitiveType.XYRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof HXZRect) {
      gpuPrimitive = {
        objectToWorld,
        bounds: [obj.x0, obj.x1, obj.z0, obj.z1],
        k: obj.k,

        ...sphereDummy,
        ...triangleDummy,

        primitiveType: WebGPUPrimitiveType.XZRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof HYZRect) {
      gpuPrimitive = {
        objectToWorld,
        bounds: [obj.y0, obj.y1, obj.z0, obj.z1],
        k: obj.k,

        ...sphereDummy,
        ...triangleDummy,

        primitiveType: WebGPUPrimitiveType.YZRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof HTriangle) {
      gpuPrimitive = {
        objectToWorld,

        ...triangleDummy,
        ...rectDummy,
        ...sphereDummy,

        primitiveType: WebGPUPrimitiveType.Triangle,
        materialIndex,
      };

      gpuPrimitive.v0 = [obj.v0[0], obj.v0[1], obj.v0[2], 1];
      gpuPrimitive.v1 = [obj.v1[0], obj.v1[1], obj.v1[2], 1];
      gpuPrimitive.v2 = [obj.v2[0], obj.v2[1], obj.v2[2], 1];

      gpuPrimitive.n0 = [obj.n0[0], obj.n0[1], obj.n0[2], 1];
      gpuPrimitive.n1 = [obj.n1[0], obj.n1[1], obj.n1[2], 1];
      gpuPrimitive.n2 = [obj.n2[0], obj.n2[1], obj.n2[2], 1];

      gpuPrimitive.uv0 = [obj.uv0[0], obj.uv0[1], 1, 1];
      gpuPrimitive.uv1 = [obj.uv1[0], obj.uv1[1], 1, 1];
      gpuPrimitive.uv2 = [obj.uv2[0], obj.uv2[1], 1, 1];
    }

    if (gpuPrimitive) {
      this._gpuPrimitives.push(gpuPrimitive);
    }
    return idx;
  }

  private getNextPowerOf2(width: number, height: number): number {
    return nextPowerOf2(Math.max(width, height));
  }

  public textureBuffer(): ArrayBuffer {
    const elementCount = 20;
    const materialSize = elementCount * 4;

    const bufferData = new ArrayBuffer(materialSize * this._gpuTextures.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const texture of this._gpuTextures) {
      bufferDataF32[offset++] = texture.color[0];
      bufferDataF32[offset++] = texture.color[1];
      bufferDataF32[offset++] = texture.color[2];
      bufferDataF32[offset++] = texture.color[3];

      bufferDataF32[offset++] = texture.checkerOdd[0];
      bufferDataF32[offset++] = texture.checkerOdd[1];
      bufferDataF32[offset++] = texture.checkerOdd[2];
      bufferDataF32[offset++] = texture.checkerOdd[3];

      bufferDataF32[offset++] = texture.checkerEven[0];
      bufferDataF32[offset++] = texture.checkerEven[1];
      bufferDataF32[offset++] = texture.checkerEven[2];
      bufferDataF32[offset++] = texture.checkerEven[3];

      let uOffset = texture.uvOffset[0];
      let vOffset = texture.uvOffset[0];
      if (texture.hasImageTexture) {
        const tex = this._imageTextures[texture.imageTextureIndex];
        uOffset = tex.width / this._textureSize;
        vOffset = tex.height / this._textureSize;
      }

      bufferDataF32[offset++] = uOffset;
      bufferDataF32[offset++] = vOffset;

      bufferDataF32[offset++] = texture.scale;

      bufferDataU32[offset++] = texture.textureType;
      bufferDataU32[offset++] = texture.imageTextureIndex;

      // paddings
      bufferDataF32[offset++] = texture.pad_0;
      bufferDataF32[offset++] = texture.pad_1;
      bufferDataF32[offset++] = texture.pad_2;
    }

    // log('Textures:', bufferData);
    return bufferData;
  }

  public async imageTexture(): Promise<{ sampler: GPUSampler; textureView: GPUTextureView }> {
    const sampler = WebGPUContext.device.createSampler({
      minFilter: 'linear',
      magFilter: 'linear',
      // addressModeU: 'repeat',
      // addressModeV: 'repeat',
      // addressModeW: 'repeat',
    });

    /*
    dictionary GPUTextureDescriptor : GPUObjectDescriptorBase {
      required GPUExtent3D size;
      GPUIntegerCoordinate mipLevelCount = 1;
      GPUSize32 sampleCount = 1;
      GPUTextureDimension dimension = "2d";
      required GPUTextureFormat format;
      required GPUTextureUsageFlags usage;
    };
    */

    let imageBitmap: ImageBitmap;

    const imageSize = {
      width: 2,
      height: 2,
      depthOrArrayLayers: 1,
    };

    if (this._imageTextures.length) {
      const tex = this._imageTextures[0];
      const image = new Image();
      image.src = tex.url;
      await image.decode();
      imageBitmap = await window.createImageBitmap(image);
      imageSize.width = tex.width;
      imageSize.height = tex.height;
    } else {
      // create fake imageBitmap
      imageBitmap = await window.createImageBitmap(new ImageData(2, 2));
    }

    const texture = WebGPUContext.device.createTexture({
      size: imageSize,
      // mipLevelCount: 1,
      // sampleCount: 1,
      // dimension: '2d',
      format: 'rgba8unorm', // rgba8unorm-srgb ???
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    /*
    dictionary GPUTextureViewDescriptor : GPUObjectDescriptorBase {
      GPUTextureFormat format;
      GPUTextureViewDimension dimension;
      GPUTextureAspect aspect = "all";
      GPUIntegerCoordinate baseMipLevel = 0;
      GPUIntegerCoordinate mipLevelCount;
      GPUIntegerCoordinate baseArrayLayer = 0;
      GPUIntegerCoordinate arrayLayerCount;
    };
    */

    const textureView = texture
      .createView
      /*
      {
      format: 'rgba8unorm', // rgba8unorm-srgb ???
      dimension: '2d-array',
      aspect: 'all',
      baseArrayLayer: 0,
      baseMipLevel: 0,
      arrayLayerCount: this._imageTextures.length,
      mipLevelCount: 1,
    }*/
      ();

    WebGPUContext.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, imageSize);

    /*
    const textureCopyBuffer = new WebGPUBuffer();
    textureCopyBuffer.create(
      this._textureSize * this._textureSize * 4,
      GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    );

    for (let i = 0; i < this._imageTextures.length; i++) {
      const tex = this._imageTextures[i];
      const data = tex.data;
      WebGPUContext.queue.writeBuffer(textureCopyBuffer.gpuBuffer, 0, data);

      const commandEncoder = WebGPUContext.device.createCommandEncoder();
      commandEncoder.copyBufferToTexture(
        {
          buffer: textureCopyBuffer.gpuBuffer,
          bytesPerRow: this._textureSize * 4,
        },
        {
          texture,
        },
        {
          width: this._textureSize,
          height: this._textureSize,
          depth: i,
        }
      );
      WebGPUContext.queue.submit([commandEncoder.finish()]);
    }*/

    return { sampler, textureView };
  }

  public materialBuffer(): ArrayBuffer {
    const elementCount = 8;
    const materialSize = elementCount * 4;

    const bufferData = new ArrayBuffer(materialSize * this._gpuMaterials.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const material of this._gpuMaterials) {
      bufferDataF32[offset++] = material.baseColor[0];
      bufferDataF32[offset++] = material.baseColor[1];
      bufferDataF32[offset++] = material.baseColor[2];
      bufferDataF32[offset++] = material.baseColor[3];

      bufferDataF32[offset++] = material.roughness;
      bufferDataF32[offset++] = material.indexOfRefraction;
      bufferDataU32[offset++] = material.materialType;
      bufferDataU32[offset++] = material.textureIndex;
    }

    //log('Materials:', bufferData);
    return bufferData;
  }

  private writeMat4(buffer: Float32Array, offset: number, mat: mat4): number {
    for (let i = 0; i < 16; i++) {
      buffer[offset++] = mat[i];
    }
    return offset;
  }

  private writeVec4(buffer: Float32Array, offset: number, vec: vec4): number {
    for (let i = 0; i < 4; i++) {
      buffer[offset++] = vec[i];
    }
    return offset;
  }

  public primitiveBuffer(): ArrayBuffer {
    const elementCount = 100;
    const primitiveSize = elementCount * 4;

    const bufferData = new ArrayBuffer(primitiveSize * this._gpuPrimitives.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const primitiv of this._gpuPrimitives) {
      const inverseMatrix = mat4.invert(mat4.create(), primitiv.objectToWorld);
      const rotation = mat4.getRotation(quat.create(), primitiv.objectToWorld);
      const inverseRotation = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), rotation));

      offset = this.writeMat4(bufferDataF32, offset, primitiv.objectToWorld);
      offset = this.writeMat4(bufferDataF32, offset, inverseMatrix);
      offset = this.writeMat4(bufferDataF32, offset, inverseRotation);

      offset = this.writeVec4(bufferDataF32, offset, primitiv.bounds);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.center0);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.center1);

      offset = this.writeVec4(bufferDataF32, offset, primitiv.v0);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.v1);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.v2);

      offset = this.writeVec4(bufferDataF32, offset, primitiv.n0);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.n1);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.n2);

      offset = this.writeVec4(bufferDataF32, offset, primitiv.uv0);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.uv1);
      offset = this.writeVec4(bufferDataF32, offset, primitiv.uv2);

      bufferDataF32[offset++] = primitiv.radius;
      bufferDataF32[offset++] = primitiv.k;

      bufferDataU32[offset++] = primitiv.primitiveType;
      bufferDataU32[offset++] = primitiv.materialIndex;

      // padding
      // bufferDataF32[offset++] = 0;
      // bufferDataF32[offset++] = 0;
    }

    // log('Primitives:', bufferData);

    return bufferData;
  }
}
