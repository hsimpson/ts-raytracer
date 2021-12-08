var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { c as create, d as dot, n as negate, a as copy, b as add, s as scale, e as subtract, f as normalize, g as cross, h as sub, i as create$1, j as create$2, k as fromValues, t as transformMat4, m as multiply, l as fromEuler, o as translate, p as fromQuat, q as multiply$1, r as invert, u as transpose, v as set, S as SimplexNoise, w as length, x as fromValues$1, y as scale$1, z as create$3, A as multiply$2, B as getRotation, R as Recoil_index_6, C as jsxRuntime, D as Recoil_index_20, E as Recoil_index_23, F as React, G as ReactDOM, H as Recoil_index_4 } from "./vendor.1f497671.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
class HitRecord {
  constructor() {
    this.p = create();
    this.normal = create();
    this.t = 0;
    this.u = 0;
    this.v = 0;
    this.frontFace = true;
  }
  setFaceNormal(r, outward_normal) {
    this.frontFace = dot(r.direction, outward_normal) < 0;
    this.normal = this.frontFace ? outward_normal : negate(create(), outward_normal);
  }
  copyTo(dest) {
    dest.p = copy(create(), this.p);
    dest.normal = copy(create(), this.normal);
    dest.t = this.t;
    dest.u = this.u;
    dest.v = this.v;
    dest.frontFace = this.frontFace;
    dest.mat = this.mat;
  }
}
class Ray {
  constructor(origin, direction, time = 0) {
    if (origin) {
      this._orig = origin;
    }
    if (direction) {
      this._dir = direction;
    }
    this._time = time;
  }
  copyTo(dest) {
    dest._orig = copy(create(), this._orig);
    dest._dir = copy(create(), this._dir);
    dest._time = this._time;
  }
  get origin() {
    return this._orig;
  }
  set origin(origin) {
    this._orig = origin;
  }
  get direction() {
    return this._dir;
  }
  set direction(direction) {
    this._dir = direction;
  }
  get time() {
    return this._time;
  }
  at(t) {
    return add(create(), this._orig, scale(create(), this._dir, t));
  }
}
const CLASSNAME_KEY = "__CLASSNAME__";
function _serializeObject(type, instance) {
  const target = {};
  const name = instance.constructor.name;
  const props = Object.getOwnPropertyNames(instance);
  target[CLASSNAME_KEY] = name;
  for (const prop of props) {
    const val = instance[prop];
    target[prop] = _serialize(val.constructor, val);
  }
  return target;
}
function _serializeArray(type, instance) {
  const target = instance.map((val) => {
    return _serialize(val.constructor, val);
  });
  return target;
}
function _serialize(type, instance) {
  if (Array.isArray(instance)) {
    return _serializeArray(type, instance);
  } else if (instance instanceof Int8Array || instance instanceof Uint8Array || instance instanceof Uint8ClampedArray || instance instanceof Int16Array || instance instanceof Uint16Array || instance instanceof Int32Array || instance instanceof Uint32Array || instance instanceof Float32Array || instance instanceof Float64Array) {
    return Array.from(instance);
  } else if (typeof instance === "object") {
    return _serializeObject(type, instance);
  } else if (typeof instance === "string" || typeof instance === "number" || typeof instance === "boolean") {
    return instance;
  } else {
    console.error(`Instance not serializable, constructor: ${instance.constructor.name}`);
  }
}
function serialize(type, instance) {
  return _serializeObject(type, instance);
}
const _metaMap = new Map();
function addClassName(type) {
  _metaMap.set(type.name, type);
}
function serializable(type) {
  addClassName(type);
}
function degreeToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function randomNumber() {
  return Math.random();
}
function randomNumberRange(min, max) {
  return min + (max - min) * randomNumber();
}
function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}
function randomInt(min, max) {
  return Math.floor(randomNumberRange(min, max + 1));
}
function nextPowerOf2(value) {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}
function getSphereUV(p2) {
  const phi = Math.atan2(p2[2], p2[0]);
  const theta = Math.asin(p2[1]);
  const u = 1 - (phi + Math.PI) / (2 * Math.PI);
  const v = (theta + Math.PI / 2) / Math.PI;
  return { u, v };
}
function lengthSquared(v) {
  return v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
}
function reflect(v, n) {
  return subtract(create(), v, scale(create(), n, 2 * dot(v, n)));
}
function refract(uv, n, etai_over_etat) {
  const cos_theta = dot(negate(create(), uv), n);
  const uvTheta = add(create(), uv, scale(create(), n, cos_theta));
  const r_out_parallel = scale(create(), uvTheta, etai_over_etat);
  const r_out_perp = scale(create(), n, -Math.sqrt(1 - lengthSquared(r_out_parallel)));
  return add(create(), r_out_parallel, r_out_perp);
}
function random() {
  return [randomNumber(), randomNumber(), randomNumber()];
}
function randomInUnitSphere() {
  while (true) {
    const p2 = randomRange(-1, 1);
    if (lengthSquared(p2) >= 1) {
      continue;
    }
    return p2;
  }
}
function randomRange(min, max) {
  return [randomNumberRange(min, max), randomNumberRange(min, max), randomNumberRange(min, max)];
}
function randomUnitVector() {
  const a = randomNumberRange(0, 2 * Math.PI);
  const z = randomNumberRange(-1, 1);
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), r * Math.sin(a), z];
}
function randomInUnitdisk() {
  while (true) {
    const p2 = [randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0];
    if (lengthSquared(p2) >= 1) {
      continue;
    }
    return p2;
  }
}
var __defProp$m = Object.defineProperty;
var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$m(target, key, result);
  return result;
};
let Camera = class {
  constructor() {
    this.lowerLeftCorner = create();
    this.horizontal = create();
    this.vertical = create();
    this.u = create();
    this.v = create();
    this.w = create();
  }
  init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, t0 = 0, t1 = 0) {
    const theta = degreeToRadians(fovY);
    const h = Math.tan(theta / 2);
    const viewport_height = 2 * h;
    const viewport_width = aspectRatio * viewport_height;
    normalize(this.w, subtract(create(), lookFrom, lookAt));
    normalize(this.u, cross(create(), vUp, this.w));
    cross(this.v, this.w, this.u);
    this.lookFrom = lookFrom;
    scale(this.horizontal, this.u, focusDist * viewport_width);
    scale(this.vertical, this.v, focusDist * viewport_height);
    const half_horizontal = scale(create(), this.horizontal, 0.5);
    const half_vertical = scale(create(), this.vertical, 0.5);
    const focusW = scale(create(), this.w, focusDist);
    subtract(this.lowerLeftCorner, subtract(create(), subtract(create(), this.lookFrom, half_horizontal), half_vertical), focusW);
    this.lenseRadius = aperture / 2;
    this.time0 = t0;
    this.time1 = t1;
  }
  getRay(s, t) {
    const rd = scale(create(), randomInUnitdisk(), this.lenseRadius);
    const vecU = scale(create(), this.u, rd[0]);
    const vecV = scale(create(), this.v, rd[1]);
    const offset = add(create(), vecU, vecV);
    const sHor = scale(create(), this.horizontal, s);
    const tVer = scale(create(), this.vertical, t);
    return new Ray(add(create(), this.lookFrom, offset), sub(create(), sub(create(), add(create(), add(create(), this.lowerLeftCorner, sHor), tVer), this.lookFrom), offset), randomNumberRange(this.time0, this.time1));
  }
  getUniformArray() {
    const array = [];
    array.push(...this.lookFrom, 0);
    array.push(...this.lowerLeftCorner, 0);
    array.push(...this.horizontal, 0);
    array.push(...this.vertical, 0);
    array.push(...this.u, 0);
    array.push(...this.v, 0);
    array.push(...this.w, 0);
    array.push(this.lenseRadius);
    array.push(this.time0);
    array.push(this.time1);
    return new Float32Array(array);
  }
};
Camera = __decorateClass$m([
  serializable
], Camera);
class RaytracerBase {
  constructor() {
    this._isRunning = false;
    this._startTime = 0;
  }
  static msToTimeString(duration) {
    duration |= 0;
    const ms = duration % 1e3;
    duration = (duration - ms) / 1e3;
    const secs = duration % 60;
    duration = (duration - secs) / 60;
    const mins = duration % 60;
    const hrs = (duration - mins) / 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  }
  getStats(duration) {
    const stats = `spp: ${this._rayTracerOptions.samplesPerPixel}, bounces: ${this._rayTracerOptions.maxBounces}, tilesize: ${this._rayTracerOptions.tileSize}px, time: ${RaytracerBase.msToTimeString(duration)}`;
    console.log(stats);
    return stats;
  }
  writeStatsToImage(stats, context2D) {
    context2D.fillStyle = "rgba(255, 255, 255, 0.4)";
    context2D.fillRect(0, 0, this._rayTracerOptions.canvas.width, 22);
    context2D.fillStyle = "rgb(0, 0, 0)";
    context2D.strokeStyle = "rgb(0, 0, 0)";
    context2D.font = "16px Arial";
    context2D.textBaseline = "top";
    context2D.fillText(stats, 5, 5);
  }
  async canvasBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png", 1);
    });
  }
  async downloadImage(context, stats) {
    const sourceCanvas = context.canvas;
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = sourceCanvas.width;
    downloadCanvas.height = sourceCanvas.height;
    const downloadContext = downloadCanvas.getContext("2d");
    downloadContext.drawImage(sourceCanvas, 0, 0);
    if (this._rayTracerOptions.addStatsToImage) {
      this.writeStatsToImage(stats, downloadContext);
    }
    const blob = await this.canvasBlob(downloadCanvas);
    const anchor = document.createElement("a");
    anchor.download = "rendering.png";
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }
  get isRunning() {
    return this._isRunning;
  }
  set imageWidth(imageWidth) {
    this._rayTracerOptions.imageWidth = imageWidth;
  }
  set imageHeight(imageHeight) {
    this._rayTracerOptions.imageHeight = imageHeight;
  }
  set samplesPerPixel(samplesPerPixel) {
    this._rayTracerOptions.samplesPerPixel = samplesPerPixel;
  }
  set maxBounces(maxBounces) {
    this._rayTracerOptions.maxBounces = maxBounces;
  }
  set scene(scene) {
    this._rayTracerOptions.scene = scene;
  }
  set download(download) {
    this._rayTracerOptions.download = download;
  }
  set addStatsToImage(addStatsToImage) {
    this._rayTracerOptions.addStatsToImage = addStatsToImage;
  }
  set tileSize(tileSize) {
    this._rayTracerOptions.tileSize = tileSize;
  }
}
var __defProp$l = Object.defineProperty;
var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$l(target, key, result);
  return result;
};
let AABB = class {
  constructor(min, max) {
    this._min = min != null ? min : [0, 0, 0];
    this._max = max != null ? max : [0, 0, 0];
  }
  copyTo(dest) {
    dest._min = copy(create(), this._min);
    dest._max = copy(create(), this._max);
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  hit(ray, tMin, tMax) {
    for (let a = 0; a < 3; a++) {
      const rOriginA = ray.origin[a];
      const rDirectionA = ray.direction[a];
      const t0 = Math.min((this._min[a] - rOriginA) / rDirectionA, (this._max[a] - rOriginA) / rDirectionA);
      const t1 = Math.max((this._min[a] - rOriginA) / rDirectionA, (this._max[a] - rOriginA) / rDirectionA);
      tMin = Math.max(t0, tMin);
      tMax = Math.min(t1, tMax);
      if (tMax <= tMin) {
        return false;
      }
    }
    return true;
  }
  static surroundingBox(box0, box1) {
    const small = [
      Math.min(box0.min[0], box1.min[0]),
      Math.min(box0.min[1], box1.min[1]),
      Math.min(box0.min[2], box1.min[2])
    ];
    const big = [
      Math.max(box0.max[0], box1.max[0]),
      Math.max(box0.max[1], box1.max[1]),
      Math.max(box0.max[2], box1.max[2])
    ];
    return new AABB(small, big);
  }
};
AABB = __decorateClass$l([
  serializable
], AABB);
var __defProp$k = Object.defineProperty;
var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$k(target, key, result);
  return result;
};
let Transform = class {
  constructor() {
    this._objectToWorldMatrix = create$1();
    this._worldToObjectMatrix = create$1();
    this._rotationMatrix = create$1();
    this._inverseRotationMatrix = create$1();
    this._normalMatrix = create$1();
    this._position = create();
    this._rotation = create$2();
    this._isTransformed = false;
  }
  get objectToWorld() {
    return this._objectToWorldMatrix;
  }
  get normalMatrix() {
    return this._normalMatrix;
  }
  get isTransformed() {
    return this._isTransformed;
  }
  transformRay(ray) {
    if (!this._isTransformed) {
      return ray;
    }
    const movedOrigin = fromValues(ray.origin[0], ray.origin[1], ray.origin[2]);
    transformMat4(movedOrigin, movedOrigin, this._worldToObjectMatrix);
    const movedDirection = fromValues(ray.direction[0], ray.direction[1], ray.direction[2]);
    transformMat4(movedDirection, movedDirection, this._inverseRotationMatrix);
    return new Ray([movedOrigin[0], movedOrigin[1], movedOrigin[2]], [movedDirection[0], movedDirection[1], movedDirection[2]], ray.time);
  }
  transformRecord(ray, rec) {
    if (!this._isTransformed) {
      return;
    }
    const movedP = fromValues(rec.p[0], rec.p[1], rec.p[2]);
    transformMat4(movedP, movedP, this._objectToWorldMatrix);
    const movedN = fromValues(rec.normal[0], rec.normal[1], rec.normal[2]);
    transformMat4(movedN, movedN, this._normalMatrix);
    normalize(movedN, movedN);
    rec.p = [movedP[0], movedP[1], movedP[2]];
    rec.setFaceNormal(ray, [movedN[0], movedN[1], movedN[2]]);
  }
  translate(translation) {
    add(this._position, this._position, translation);
    this._updateMatrix();
  }
  rotateQuat(rotation) {
    this._rotation = multiply(this._rotation, this._rotation, rotation);
    this._updateMatrix();
  }
  rotateEuler(angleX, angelY, angleZ) {
    let tempQuat = create$2();
    tempQuat = fromEuler(tempQuat, angleX, angelY, angleZ);
    this.rotateQuat(tempQuat);
  }
  _updateMatrix() {
    this._isTransformed = true;
    const translationMatrix = create$1();
    translate(translationMatrix, translationMatrix, this._position);
    fromQuat(this._rotationMatrix, this._rotation);
    multiply$1(this._objectToWorldMatrix, translationMatrix, this._rotationMatrix);
    invert(this._worldToObjectMatrix, this._objectToWorldMatrix);
    invert(this._inverseRotationMatrix, this._rotationMatrix);
    transpose(this._normalMatrix, this._rotationMatrix);
    invert(this._normalMatrix, this._normalMatrix);
  }
};
Transform = __decorateClass$k([
  serializable
], Transform);
class Hittable {
  constructor() {
    this.name = "";
    this.transform = new Transform();
  }
}
var __defProp$j = Object.defineProperty;
var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$j(target, key, result);
  return result;
};
let XYRect = class extends Hittable {
  constructor(x0, x1, y0, y1, k, material) {
    super();
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.k = k;
    this.material = material;
    this.bbox = new AABB([this.x0, this.y0, this.k - 1e-4], [this.x1, this.y1, this.k + 1e-4]);
  }
  hit(ray, tMin, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const t = (this.k - transformedRay.origin[2]) / transformedRay.direction[2];
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = transformedRay.origin[0] + t * transformedRay.direction[0];
    const y = transformedRay.origin[1] + t * transformedRay.direction[1];
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;
    const outwardNormal = [0, 0, 1];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);
    this.transform.transformRecord(transformedRay, rec);
    return true;
  }
  boundingBox(_t0, _t1) {
    return this.bbox;
  }
};
XYRect = __decorateClass$j([
  serializable
], XYRect);
let XZRect = class extends Hittable {
  constructor(x0, x1, z0, z1, k, material) {
    super();
    this.x0 = x0;
    this.x1 = x1;
    this.z0 = z0;
    this.z1 = z1;
    this.k = k;
    this.material = material;
    this.bbox = new AABB([this.x0, this.k - 1e-4, this.z0], [this.x1, this.k + 1e-4, this.z1]);
  }
  hit(ray, tMin, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const t = (this.k - transformedRay.origin[1]) / transformedRay.direction[1];
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = transformedRay.origin[0] + t * transformedRay.direction[0];
    const z = transformedRay.origin[2] + t * transformedRay.direction[2];
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = [0, 1, 0];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);
    this.transform.transformRecord(transformedRay, rec);
    return true;
  }
  boundingBox(_t0, _t1) {
    return this.bbox;
  }
};
XZRect = __decorateClass$j([
  serializable
], XZRect);
let YZRect = class extends Hittable {
  constructor(y0, y1, z0, z1, k, material) {
    super();
    this.y0 = y0;
    this.y1 = y1;
    this.z0 = z0;
    this.z1 = z1;
    this.k = k;
    this.material = material;
    this.bbox = new AABB([this.k - 1e-4, this.y0, this.z0], [this.k + 1e-4, this.y1, this.z1]);
  }
  hit(ray, tMin, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const t = (this.k - transformedRay.origin[0]) / transformedRay.direction[0];
    if (t < tMin || t > tMax) {
      return false;
    }
    const y = transformedRay.origin[1] + t * transformedRay.direction[1];
    const z = transformedRay.origin[2] + t * transformedRay.direction[2];
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = [1, 0, 0];
    rec.setFaceNormal(transformedRay, outwardNormal);
    rec.mat = this.material;
    rec.p = transformedRay.at(t);
    this.transform.transformRecord(transformedRay, rec);
    return true;
  }
  boundingBox(_t0, _t1) {
    return this.bbox;
  }
};
YZRect = __decorateClass$j([
  serializable
], YZRect);
var __defProp$i = Object.defineProperty;
var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$i(target, key, result);
  return result;
};
let HittableList = class extends Hittable {
  constructor(object) {
    super();
    this._objects = [];
    if (object) {
      this.add(object);
    }
  }
  get objects() {
    return this._objects;
  }
  add(object) {
    this._objects.push(object);
  }
  hit(ray, tMin, tMax, rec) {
    const tempRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;
    for (const object of this._objects) {
      if (object.hit(ray, tMin, closestSoFar, tempRecord)) {
        if (tempRecord.t <= closestSoFar) {
          hitAnything = true;
          closestSoFar = tempRecord.t;
          tempRecord.copyTo(rec);
        }
      }
    }
    return hitAnything;
  }
  boundingBox(t0, t1) {
    let bbox = new AABB();
    for (const object of this._objects) {
      bbox = AABB.surroundingBox(bbox, object.boundingBox(t0, t1));
    }
    return bbox;
  }
};
HittableList = __decorateClass$i([
  serializable
], HittableList);
var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$h(target, key, result);
  return result;
};
let Box = class extends Hittable {
  constructor(p0, p1, mat) {
    super();
    this._sides = new HittableList();
    this._boxMin = p0;
    this._boxMax = p1;
    this._sides.add(new XYRect(p0[0], p1[0], p0[1], p1[1], p1[2], mat));
    this._sides.add(new XYRect(p0[0], p1[0], p0[1], p1[1], p0[2], mat));
    this._sides.add(new XZRect(p0[0], p1[0], p0[2], p1[2], p1[1], mat));
    this._sides.add(new XZRect(p0[0], p1[0], p0[2], p1[2], p0[1], mat));
    this._sides.add(new YZRect(p0[1], p1[1], p0[2], p1[2], p1[0], mat));
    this._sides.add(new YZRect(p0[1], p1[1], p0[2], p1[2], p0[0], mat));
  }
  get sides() {
    return this._sides;
  }
  hit(ray, t_min, t_max, rec) {
    const transformedRay = this.transform.transformRay(ray);
    if (!this._sides.hit(transformedRay, t_min, t_max, rec)) {
      return false;
    }
    this.transform.transformRecord(transformedRay, rec);
    return true;
  }
  boundingBox(_t0, _t1) {
    const transformedMin = transformMat4(create(), this._boxMin, this.transform.objectToWorld);
    const transformedMax = transformMat4(create(), this._boxMax, this.transform.objectToWorld);
    return new AABB(transformedMin, transformedMax);
  }
};
Box = __decorateClass$h([
  serializable
], Box);
var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$g(target, key, result);
  return result;
};
let _id = 0;
let _level = 0;
let BVHNode = class extends Hittable {
  constructor() {
    super();
    this.bbox = new AABB();
    this.id = _id;
    _id++;
  }
  static createFromHitableList(list, time0, time1) {
    _id = 0;
    _level = 0;
    console.log("BVH starting...");
    const startTime = window.performance.now();
    const node = new BVHNode();
    node.level = _level;
    const flatList = new HittableList();
    const fillFlatList = (list2) => {
      for (const object of list2.objects) {
        if (object instanceof HittableList) {
          fillFlatList(object);
        } else {
          flatList.add(object);
        }
      }
    };
    fillFlatList(list);
    console.log(`BVH objects: ${flatList.objects.length}`);
    node.init(flatList.objects, 0, flatList.objects.length, time0, time1);
    console.log(`BVH finish: ${(window.performance.now() - startTime).toFixed(2)}`);
    console.log(`BVH nodes: ${_id}`);
    console.log(`BVH levels: ${_level}`);
    return node;
  }
  static createFromObjects(objects, start, end, time0, time1) {
    const node = new BVHNode();
    node.init(objects, start, end, time0, time1);
    return node;
  }
  init(objects, start, end, time0, time1) {
    const axis = randomInt(0, 2);
    const comparator = axis === 0 ? boxXCompare : axis === 1 ? boxYCompare : boxZCompare;
    const objectSpan = end - start;
    if (objectSpan === 1) {
      this.left = this.right = objects[start];
    } else if (objectSpan === 2) {
      if (comparator(objects[start], objects[start + 1]) === -1) {
        this.left = objects[start];
        this.right = objects[start + 1];
      } else {
        this.left = objects[start + 1];
        this.right = objects[start];
      }
    } else {
      const mid = start + Math.floor(objectSpan / 2);
      const nextLevel = ++_level;
      this.left = BVHNode.createFromObjects(objects, start, mid, time0, time1);
      this.right = BVHNode.createFromObjects(objects, mid, end, time0, time1);
      this.left.level = nextLevel;
      this.right.level = nextLevel;
    }
    const boxLeft = this.left.boundingBox(time0, time1);
    const boxRight = this.right.boundingBox(time0, time1);
    this.bbox = AABB.surroundingBox(boxLeft, boxRight);
  }
  hit(ray, tMin, tMax, rec) {
    if (!this.bbox.hit(ray, tMin, tMax)) {
      return false;
    }
    const leftHit = this.left.hit(ray, tMin, tMax, rec);
    const rightHit = this.right.hit(ray, tMin, leftHit ? rec.t : tMax, rec);
    return leftHit || rightHit;
  }
  boundingBox(_t0, _t1) {
    return this.bbox;
  }
};
BVHNode = __decorateClass$g([
  serializable
], BVHNode);
function boxCompare(a, b, axis) {
  const boxA = a.boundingBox(0, 0);
  const boxB = b.boundingBox(0, 0);
  return boxA.min[axis] < boxB.min[axis] ? -1 : 1;
}
function boxXCompare(a, b) {
  return boxCompare(a, b, 0);
}
function boxYCompare(a, b) {
  return boxCompare(a, b, 1);
}
function boxZCompare(a, b) {
  return boxCompare(a, b, 2);
}
class Material {
  emitted(_u, _v, _p) {
    return create();
  }
  get texture() {
    return void 0;
  }
}
var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$f(target, key, result);
  return result;
};
let DielectricMaterial = class extends Material {
  constructor(refIdx) {
    super();
    this._indexOfRefraction = refIdx;
  }
  get indexOfRefraction() {
    return this._indexOfRefraction;
  }
  schlick(cosine, refIdx) {
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
  scatter(ray, rec, attenuation, scattered) {
    set(attenuation, 1, 1, 1);
    const etai_over_etat = rec.frontFace ? 1 / this._indexOfRefraction : this._indexOfRefraction;
    const unit_direction = normalize(create(), ray.direction);
    const cos_theta = Math.min(dot(negate(create(), unit_direction), rec.normal), 1);
    const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);
    if (etai_over_etat * sin_theta > 1) {
      const reflected = reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, ray.time).copyTo(scattered);
      return true;
    }
    const reflect_prob = this.schlick(cos_theta, etai_over_etat);
    if (randomNumber() < reflect_prob) {
      const reflected = reflect(unit_direction, rec.normal);
      new Ray(rec.p, reflected, ray.time).copyTo(scattered);
      return true;
    }
    const refracted = refract(unit_direction, rec.normal, etai_over_etat);
    new Ray(rec.p, refracted, ray.time).copyTo(scattered);
    return true;
  }
};
DielectricMaterial = __decorateClass$f([
  serializable
], DielectricMaterial);
class Texture {
}
var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$e(target, key, result);
  return result;
};
let SolidColor = class extends Texture {
  constructor(color) {
    super();
    this._color = color;
  }
  value(_u, _v, _p) {
    return this._color;
  }
  get color() {
    return this._color;
  }
};
SolidColor = __decorateClass$e([
  serializable
], SolidColor);
var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$d(target, key, result);
  return result;
};
let CheckerTexture = class extends Texture {
  constructor(odd, even, scale2) {
    super();
    this._odd = new SolidColor(odd);
    this._even = new SolidColor(even);
    this._scale = scale2 || 5;
  }
  modulo(x) {
    return x - Math.floor(x);
  }
  value(u, v, p2) {
    const x = this.modulo(u * this._scale) < 0.5;
    const y = this.modulo(v * this._scale) < 0.5;
    if (x ? !y : y) {
      return this._even.value(u, v, p2);
    } else {
      return this._odd.value(u, v, p2);
    }
  }
  get odd() {
    return this._odd.color;
  }
  get even() {
    return this._even.color;
  }
  get scale() {
    return this._scale;
  }
};
CheckerTexture = __decorateClass$d([
  serializable
], CheckerTexture);
var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$c(target, key, result);
  return result;
};
let ImageTexture = class extends Texture {
  constructor() {
    super();
    this._width = 0;
    this._height = 0;
    this._bytesPerScanLine = 0;
    this._url = "";
  }
  async load(imageUrl) {
    this._url = imageUrl;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imgBitmap = await window.createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgBitmap, 0, 0);
    const imgData = ctx.getImageData(0, 0, imgBitmap.width, imgBitmap.height);
    this._width = imgData.width;
    this._height = imgData.height;
    this._data = imgData.data;
    this._bytesPerScanLine = ImageTexture.BytesPerPixel * this._width;
  }
  value(u, v, _p) {
    if (!this._data || this._data.length === 0) {
      return [0, 1, 1];
    }
    u = clamp(u, 0, 1);
    v = 1 - clamp(v, 0, 1);
    let i = Math.trunc(u * this._width);
    let j = Math.trunc(v * this._height);
    if (i >= this._width)
      i = this._width - 1;
    if (j >= this._height)
      j = this._height - 1;
    const colorScale = 1 / 255;
    let pixelOffset = j * this._bytesPerScanLine + i * ImageTexture.BytesPerPixel;
    return [
      this._data[pixelOffset++] * colorScale,
      this._data[pixelOffset++] * colorScale,
      this._data[pixelOffset++] * colorScale
    ];
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get data() {
    return this._data;
  }
  get url() {
    return this._url;
  }
};
ImageTexture.BytesPerPixel = 4;
ImageTexture = __decorateClass$c([
  serializable
], ImageTexture);
var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$b(target, key, result);
  return result;
};
let Perlin = class {
  constructor() {
    this._ranVecs = new Array(Perlin._pointCount);
    for (let i = 0; i < Perlin._pointCount; i++) {
      this._ranVecs[i] = normalize(create(), randomRange(-1, 1));
    }
    this._permX = Perlin.perlinGeneratePerm();
    this._permY = Perlin.perlinGeneratePerm();
    this._permZ = Perlin.perlinGeneratePerm();
  }
  noise(p2) {
    let u = p2[0] - Math.floor(p2[0]);
    let v = p2[1] - Math.floor(p2[1]);
    let w = p2[2] - Math.floor(p2[2]);
    u = u * u * (3 - 2 * u);
    v = v * v * (3 - 2 * v);
    w = w * w * (3 - 2 * w);
    const i = Math.floor(p2[0]);
    const j = Math.floor(p2[1]);
    const k = Math.floor(p2[2]);
    const c = [
      [[], []],
      [[], []]
    ];
    for (let di = 0; di < 2; di++)
      for (let dj = 0; dj < 2; dj++)
        for (let dk = 0; dk < 2; dk++)
          c[di][dj][dk] = this._ranVecs[this._permX[i + di & 255] ^ this._permY[j + dj & 255] ^ this._permZ[k + dk & 255]];
    const noise = trilinearInterp(c, u, v, w);
    return noise;
  }
  turb(p2, depth = 7) {
    let accum = 0;
    const temp_p = p2;
    let weight = 1;
    for (let i = 0; i < depth; i++) {
      accum += weight * this.noise(temp_p);
      weight *= 0.5;
      scale(temp_p, temp_p, 2);
    }
    return Math.abs(accum);
  }
  static perlinGeneratePerm() {
    const array = new Array(Perlin._pointCount);
    for (let i = 0; i < Perlin._pointCount; i++) {
      array[i] = i;
    }
    Perlin.permute(array, Perlin._pointCount);
    return array;
  }
  static permute(array, n) {
    for (let i = n - 1; i > 0; i--) {
      const target = randomInt(0, i);
      const tmp = array[i];
      array[i] = array[target];
      array[target] = tmp;
    }
  }
};
Perlin._pointCount = 256;
Perlin = __decorateClass$b([
  serializable
], Perlin);
function trilinearInterp(c, u, v, w) {
  const uu = u * u * (3 - 2 * u);
  const vv = v * v * (3 - 2 * v);
  const ww = w * w * (3 - 2 * w);
  let accum = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const weight = [u - i, v - j, w - k];
        accum += (i * uu + (1 - i) * (1 - uu)) * (j * vv + (1 - j) * (1 - vv)) * (k * ww + (1 - k) * (1 - ww)) * dot(c[i][j][k], weight);
      }
    }
  }
  return accum;
}
var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$a(target, key, result);
  return result;
};
const RANDOMSEED = "just a random seed string";
let NoiseTexture = class extends Texture {
  constructor(scale2) {
    super();
    this._noise = new Perlin();
    this._scale = scale2;
  }
  get scale() {
    return this._scale;
  }
  turb(p2, depth = 7) {
    if (!this._simplexNoise) {
      this._simplexNoise = new SimplexNoise(RANDOMSEED);
    }
    let accum = 0;
    const tempP = p2;
    let weight = 1;
    for (let i = 0; i < depth; i++) {
      accum += weight * this._simplexNoise.noise3D(p2[0], p2[1], p2[2]);
      weight *= 0.5;
      scale(tempP, tempP, 2);
    }
    return Math.abs(accum);
  }
  value(u, v, p2) {
    return scale(create(), scale(create(), fromValues(1, 1, 1), 0.5), 1 + Math.sin(this._scale * p2[2] + 10 * this.turb(p2)));
  }
};
NoiseTexture = __decorateClass$a([
  serializable
], NoiseTexture);
var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$9(target, key, result);
  return result;
};
let DiffuseLight = class extends Material {
  constructor(color) {
    super();
    if (color) {
      this._emit = new SolidColor(color);
    }
  }
  get texture() {
    return this._emit;
  }
  scatter(_r_in, _rec, _attenuation, _scattered) {
    return false;
  }
  emitted(u, v, p2) {
    return this._emit.value(u, v, p2);
  }
};
DiffuseLight = __decorateClass$9([
  serializable
], DiffuseLight);
var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$8(target, key, result);
  return result;
};
let IsoTropic = class extends Material {
  constructor(albedo) {
    super();
    if (albedo instanceof Texture) {
      this._albedo = albedo;
    } else {
      this._albedo = new SolidColor(albedo);
    }
  }
  scatter(r_in, rec, attenuation, scattered) {
    new Ray(rec.p, randomInUnitSphere(), r_in.time).copyTo(scattered);
    copy(attenuation, this._albedo.value(rec.u, rec.v, rec.p));
    return true;
  }
};
IsoTropic = __decorateClass$8([
  serializable
], IsoTropic);
var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$7(target, key, result);
  return result;
};
let LambertianMaterial = class extends Material {
  constructor(color) {
    super();
    if (color) {
      this._albedo = new SolidColor(color);
    }
  }
  set texture(texture) {
    this._albedo = texture;
  }
  get texture() {
    return this._albedo;
  }
  scatter(ray, rec, attenuation, scattered) {
    const scatter_direction = add(create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    copy(attenuation, col);
    return true;
  }
};
LambertianMaterial = __decorateClass$7([
  serializable
], LambertianMaterial);
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$6(target, key, result);
  return result;
};
let MetalMaterial = class extends Material {
  constructor(color, roughness) {
    super();
    this._baseColor = color;
    this._roughness = roughness;
  }
  get baseColor() {
    return this._baseColor;
  }
  get roughness() {
    return this._roughness;
  }
  scatter(r_in, rec, attenuation, scattered) {
    const refl = reflect(normalize(create(), r_in.direction), rec.normal);
    new Ray(rec.p, add(create(), refl, scale(create(), randomInUnitSphere(), this._roughness)), r_in.time).copyTo(scattered);
    copy(attenuation, this._baseColor);
    return dot(scattered.direction, rec.normal) > 0;
  }
};
MetalMaterial = __decorateClass$6([
  serializable
], MetalMaterial);
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
let NormalMaterial = class extends Material {
  constructor() {
    super(...arguments);
    this.corrected = false;
  }
  scatter(ray, rec, attenuation, scattered) {
    const scatter_direction = add(create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = rec.normal;
    if (this.corrected) {
      add(col, col, fromValues(1, 1, 1));
      scale(col, col, 0.5);
      normalize(col, col);
    }
    copy(attenuation, col);
    return true;
  }
};
NormalMaterial = __decorateClass$5([
  serializable
], NormalMaterial);
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
let UVMaterial = class extends Material {
  scatter(ray, rec, attenuation, scattered) {
    const scatter_direction = add(create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
    const col = fromValues(rec.u, rec.v, 0);
    copy(attenuation, col);
    return true;
  }
};
UVMaterial = __decorateClass$4([
  serializable
], UVMaterial);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let ConstantMedium = class extends Hittable {
  constructor(boundary, density, material) {
    super();
    this._boundary = boundary;
    this._negInvDensity = -1 / density;
    this._phaseFunction = new IsoTropic(material);
  }
  hit(r, t_min, t_max, rec) {
    const rec1 = new HitRecord();
    const rec2 = new HitRecord();
    if (!this._boundary.hit(r, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, rec1)) {
      return false;
    }
    if (!this._boundary.hit(r, rec1.t + 1e-4, Number.POSITIVE_INFINITY, rec2)) {
      return false;
    }
    if (rec1.t < t_min) {
      rec1.t = t_min;
    }
    if (rec2.t > t_max) {
      rec2.t = t_max;
    }
    if (rec1.t >= rec2.t) {
      return false;
    }
    if (rec1.t < 0) {
      rec1.t = 0;
    }
    const rayLength = length(r.direction);
    const distanceInsideBoundary = (rec2.t - rec1.t) * rayLength;
    const hitDistance = this._negInvDensity * Math.log(randomNumber());
    if (hitDistance > distanceInsideBoundary) {
      return false;
    }
    rec.t = rec1.t + hitDistance / rayLength;
    rec.p = r.at(rec.t);
    rec.normal = [1, 0, 0];
    rec.frontFace = true;
    rec.mat = this._phaseFunction;
    return true;
  }
  boundingBox(t0, t1) {
    return this._boundary.boundingBox(t0, t1);
  }
};
ConstantMedium = __decorateClass$3([
  serializable
], ConstantMedium);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let MovingSphere = class extends Hittable {
  constructor(center0, center1, t0, t1, radius, mat) {
    super();
    this._center0 = center0;
    this._center1 = center1;
    this._time0 = t0;
    this._time1 = t1;
    this._radius = radius;
    this.material = mat;
  }
  get center0() {
    return this._center0;
  }
  get center1() {
    return this._center1;
  }
  get radius() {
    return this._radius;
  }
  get time0() {
    return this._time0;
  }
  get time1() {
    return this._time1;
  }
  hit(ray, tMin, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const oc = subtract(create(), transformedRay.origin, this.center(transformedRay.time));
    const a = lengthSquared(transformedRay.direction);
    const half_b = dot(oc, transformedRay.direction);
    const c = lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;
    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = create();
        const pMinusCenter = subtract(create(), rec.p, this.center(transformedRay.time));
        scale(outward_normal, pMinusCenter, 1 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMin) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = create();
        const pMinusCenter = subtract(create(), rec.p, this.center(transformedRay.time));
        scale(outward_normal, pMinusCenter, 1 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(transformedRay, rec);
        return true;
      }
    }
    return false;
  }
  center(time) {
    const timeDiff = (time - this._time0) / (this._time1 - this._time0);
    const centerDiff = subtract(create(), this._center1, this._center0);
    const centerDiffT = scale(create(), centerDiff, timeDiff);
    return add(create(), this._center0, centerDiffT);
  }
  boundingBox(t0, t1) {
    const transformedCenterT0 = transformMat4(create(), this.center(t0), this.transform.objectToWorld);
    const transformedCenterT1 = transformMat4(create(), this.center(t1), this.transform.objectToWorld);
    const r = fromValues(this._radius, this._radius, this._radius);
    const box0 = new AABB(sub(create(), transformedCenterT0, r), add(create(), transformedCenterT0, r));
    const box1 = new AABB(sub(create(), transformedCenterT1, r), add(create(), transformedCenterT1, r));
    return AABB.surroundingBox(box0, box1);
  }
};
MovingSphere = __decorateClass$2([
  serializable
], MovingSphere);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let Sphere = class extends Hittable {
  constructor(center, radius, mat) {
    super();
    this._center = center;
    this._radius = radius;
    this.material = mat;
  }
  get center() {
    return this._center;
  }
  get radius() {
    return this._radius;
  }
  hit(ray, tMain, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const oc = subtract(create(), transformedRay.origin, this._center);
    const a = lengthSquared(transformedRay.direction);
    const half_b = dot(oc, transformedRay.direction);
    const c = lengthSquared(oc) - this._radius * this._radius;
    const discriminat = half_b * half_b - a * c;
    if (discriminat > 0) {
      const root = Math.sqrt(discriminat);
      let temp = (-half_b - root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = create();
        const pMinusCenter = subtract(create(), rec.p, this._center);
        scale(outward_normal, pMinusCenter, 1 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
      temp = (-half_b + root) / a;
      if (temp < tMax && temp > tMain) {
        rec.t = temp;
        rec.p = transformedRay.at(rec.t);
        const outward_normal = create();
        const pMinusCenter = subtract(create(), rec.p, this._center);
        scale(outward_normal, pMinusCenter, 1 / this._radius);
        rec.setFaceNormal(transformedRay, outward_normal);
        const uv = getSphereUV(outward_normal);
        rec.u = uv.u;
        rec.v = uv.v;
        rec.mat = this.material;
        this.transform.transformRecord(ray, rec);
        return true;
      }
    }
    return false;
  }
  boundingBox(_t0, _t1) {
    const transformedCenter = transformMat4(create(), this._center, this.transform.objectToWorld);
    const r = fromValues(this._radius, this._radius, this._radius);
    return new AABB(sub(create(), transformedCenter, r), add(create(), transformedCenter, r));
  }
};
Sphere = __decorateClass$1([
  serializable
], Sphere);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
function avgVector3(vectors) {
  let x = 0, y = 0, z = 0;
  for (const v of vectors) {
    x += v[0];
    y += v[1];
    z += v[2];
  }
  return [x / vectors.length, y / vectors.length, z / vectors.length];
}
const EPSILON = 1e-8;
let Triangle = class extends Hittable {
  constructor(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2) {
    super();
    this.transform = new Transform();
    this.doubleSided = false;
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.n0 = n0;
    this.n1 = n1;
    this.n2 = n2;
    if (n0 === void 0 || n1 === void 0 || n2 === void 0) {
      const edge1 = create();
      const edge2 = create();
      const faceNormal = create();
      subtract(edge1, this.v1, this.v0);
      subtract(edge2, this.v2, this.v0);
      cross(faceNormal, edge1, edge2);
      normalize(faceNormal, faceNormal);
      this.n0 = faceNormal;
      this.n1 = faceNormal;
      this.n2 = faceNormal;
    }
    this.surfaceNormal = create();
    normalize(this.surfaceNormal, avgVector3([this.n0, this.n1, this.n2]));
    this.uv0 = uv0 != null ? uv0 : [0, 0];
    this.uv1 = uv1 != null ? uv1 : [0, 0];
    this.uv2 = uv2 != null ? uv2 : [0, 0];
  }
  applyTransform() {
    transformMat4(this.v0, this.v0, this.transform.objectToWorld);
    transformMat4(this.v1, this.v1, this.transform.objectToWorld);
    transformMat4(this.v2, this.v2, this.transform.objectToWorld);
    transformMat4(this.n0, this.n0, this.transform.normalMatrix);
    transformMat4(this.n1, this.n1, this.transform.normalMatrix);
    transformMat4(this.n2, this.n2, this.transform.normalMatrix);
    normalize(this.n0, this.n0);
    normalize(this.n1, this.n1);
    normalize(this.n2, this.n2);
  }
  hit(ray, tMin, tMax, rec) {
    const transformedRay = this.transform.transformRay(ray);
    const edge1 = subtract(create(), this.v1, this.v0);
    const edge2 = subtract(create(), this.v2, this.v0);
    const pvec = cross(create(), transformedRay.direction, edge2);
    const det = dot(edge1, pvec);
    let t, u, v;
    if (!this.doubleSided) {
      if (det < EPSILON) {
        return false;
      }
      const tvec = subtract(create(), transformedRay.origin, this.v0);
      u = dot(tvec, pvec);
      if (u < 0 || u > det) {
        return false;
      }
      const qvec = cross(create(), tvec, edge1);
      v = dot(transformedRay.direction, qvec);
      if (v < 0 || u + v > det) {
        return false;
      }
      t = dot(edge2, qvec);
      const invDet = 1 / det;
      t *= invDet;
      u *= invDet;
      v *= invDet;
    } else {
      if (det > -EPSILON && det < EPSILON) {
        return false;
      }
      const invDet = 1 / det;
      const tvec = subtract(create(), transformedRay.origin, this.v0);
      u = dot(tvec, pvec) * invDet;
      if (u < 0 || u > 1) {
        return false;
      }
      const qvec = cross(create(), tvec, edge1);
      v = dot(transformedRay.direction, qvec) * invDet;
      if (v < 0 || u + v > 1) {
        return false;
      }
      t = dot(edge2, qvec);
    }
    if (t < EPSILON) {
      return false;
    }
    rec.t = t;
    rec.p = transformedRay.at(t);
    rec.mat = this.material;
    const w = 1 - u - v;
    const n0 = scale(create(), this.n0, w);
    const n1 = scale(create(), this.n1, u);
    const n2 = scale(create(), this.n2, v);
    const outwardNormal = normalize(create(), add(create(), add(create(), n0, n1), n2));
    rec.normal = outwardNormal;
    rec.frontFace = true;
    return true;
  }
  boundingBox(_t0, _t1) {
    let v0;
    let v1;
    let v2;
    if (this.transform.isTransformed) {
      v0 = transformMat4(create(), this.v0, this.transform.objectToWorld);
      v1 = transformMat4(create(), this.v1, this.transform.objectToWorld);
      v2 = transformMat4(create(), this.v2, this.transform.objectToWorld);
    } else {
      v0 = this.v0;
      v1 = this.v1;
      v2 = this.v2;
    }
    const minX = Math.min(v0[0], v1[0], v2[0]) - EPSILON;
    const minY = Math.min(v0[1], v1[1], v2[1]) - EPSILON;
    const minZ = Math.min(v0[2], v1[2], v2[2]) - EPSILON;
    const maxX = Math.max(v0[0], v1[0], v2[0]) + EPSILON;
    const maxY = Math.max(v0[1], v1[1], v2[1]) + EPSILON;
    const maxZ = Math.max(v0[2], v1[2], v2[2]) + EPSILON;
    return new AABB([minX, minY, minZ], [maxX, maxY, maxZ]);
  }
};
Triangle = __decorateClass([
  serializable
], Triangle);
function isAbsoluteUrl(url) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}
function isDataUrl(url) {
  return /^data:/.test(url);
}
function urlDirname(url) {
  const dirname = url.substring(0, url.lastIndexOf("/") + 1);
  return dirname;
}
const NORMALMATERIAL = new NormalMaterial();
NORMALMATERIAL.corrected = true;
async function load(url) {
  var _a;
  const triangleMeshArray = new HittableList();
  const response = await fetch(url);
  const gltf = await response.json();
  const baseUrl = urlDirname(url);
  const buffers = await decodeBuffers(gltf.buffers, baseUrl);
  const scene = gltf.scenes[gltf.scene];
  const accessors = gltf.accessors;
  const bufferViews = gltf.bufferViews;
  const materials = gltf.materials;
  const raytracingMaterial = [];
  for (const material of materials) {
    let baseColor = material.pbrMetallicRoughness.baseColorFactor;
    if (!baseColor) {
      baseColor = fromValues$1(0.5, 0.5, 0.5, 1);
    }
    let mat;
    if (material.emissiveFactor) {
      const emissiveColor = scale$1(create$3(), baseColor, 50);
      mat = new DiffuseLight(fromValues(emissiveColor[0], emissiveColor[1], emissiveColor[2]));
    } else {
      mat = new LambertianMaterial([baseColor[0], baseColor[1], baseColor[2]]);
    }
    raytracingMaterial.push(mat);
  }
  for (const nodeIdx of scene.nodes) {
    const node = gltf.nodes[nodeIdx];
    const mesh = gltf.meshes[node.mesh];
    const triangleMesh = new HittableList();
    triangleMesh.name = (_a = mesh.name) != null ? _a : "unknown";
    let translation = create();
    let rotation = create$2();
    let scale2 = create();
    set(scale2, 1, 1, 1);
    if (node.translation) {
      translation = node.translation;
    }
    if (node.rotation) {
      rotation = node.rotation;
    }
    if (node.scale) {
      scale2 = node.scale;
    }
    for (const primitive of mesh.primitives) {
      const positionAccessor = accessors[primitive.attributes.POSITION];
      const normalAccessor = accessors[primitive.attributes.NORMAL];
      const textureCoordAccessor = accessors[primitive.attributes.TEXCOORD_0];
      const positionBufferView = bufferViews[positionAccessor.bufferView];
      const vertices = getVec3List(new Float32Array(buffers[positionBufferView.buffer], positionBufferView.byteOffset, positionBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT));
      let normals;
      let textureCoords;
      if (normalAccessor) {
        const normalBufferView = bufferViews[normalAccessor.bufferView];
        normals = getVec3List(new Float32Array(buffers[normalBufferView.buffer], normalBufferView.byteOffset, normalBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT));
      }
      if (textureCoordAccessor) {
        const textureCoordBufferView = bufferViews[textureCoordAccessor.bufferView];
        textureCoords = getVec2List(new Float32Array(buffers[textureCoordBufferView.buffer], textureCoordBufferView.byteOffset, textureCoordBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT));
      }
      if (primitive.indices !== void 0) {
        const indicesAccessor = accessors[primitive.indices];
        const indicesBufferView = bufferViews[indicesAccessor.bufferView];
        const indexArray = new Uint16Array(buffers[indicesBufferView.buffer], indicesBufferView.byteOffset, indicesBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);
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
          const triangle = new Triangle(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2);
          triangle.material = raytracingMaterial[primitive.material];
          if (node.translation) {
            triangle.transform.translate(translation);
          }
          if (node.rotation) {
            triangle.transform.rotateQuat(rotation);
          }
          triangleMesh.add(triangle);
        }
      }
    }
    triangleMeshArray.add(triangleMesh);
  }
  return triangleMeshArray;
}
async function decodeBuffers(buffers, dirname) {
  const arrayBuffers = [];
  for (const buffer of buffers) {
    let urlStr = buffer.uri;
    if (!isAbsoluteUrl(urlStr) && !isDataUrl(urlStr)) {
      const url = new URL(urlStr, dirname);
      urlStr = url.toString();
    }
    const response = await fetch(urlStr);
    arrayBuffers.push(await response.arrayBuffer());
  }
  return arrayBuffers;
}
function getVec3List(array) {
  const vec3List = [];
  for (let i = 0; i < array.length; i++) {
    const x = array[i];
    const y = array[++i];
    const z = array[++i];
    vec3List.push([x, y, z]);
  }
  return vec3List;
}
function getVec2List(array) {
  const vec2List = [];
  for (let i = 0; i < array.length; i++) {
    const u = array[i];
    const v = array[++i];
    vec2List.push([u, v]);
  }
  return vec2List;
}
const defaultCameraOptions = {
  lookFrom: [0, 0, 5],
  lookAt: [0, 0, 0],
  vUp: [0, 1, 0],
  background: [0.7, 0.8, 1],
  focusDist: 10,
  aperture: 0,
  fovY: 40
};
function randomScene(useBVH) {
  const world = new HittableList();
  const groundMaterial = new LambertianMaterial([0.5, 0.5, 0.5]);
  world.add(new Sphere([0, -1e3, 0], 1e3, groundMaterial));
  const count = 8;
  for (let a = -count; a < count; a++) {
    for (let b = -count; b < count; b++) {
      const chooseMat = randomNumber();
      const center = [a + 0.9 * randomNumber(), 0.2, b + 0.9 * randomNumber()];
      if (length(sub(create(), center, [4, 0.2, 0])) > 0.9) {
        let sphereMaterial;
        if (chooseMat < 0.8) {
          const albedo = multiply$2(create(), random(), random());
          sphereMaterial = new LambertianMaterial(albedo);
          const center2 = add(create(), center, [0, randomNumberRange(0, 1), 0]);
          world.add(new MovingSphere(center, center2, 0, 1, 0.2, sphereMaterial));
        } else if (chooseMat < 0.95) {
          const albedo = randomRange(0.5, 1);
          const roughness = randomNumberRange(0, 0.5);
          sphereMaterial = new MetalMaterial(albedo, roughness);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else {
          sphereMaterial = new DielectricMaterial(1.5);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }
  const material1 = new DielectricMaterial(1.5);
  const material2 = new LambertianMaterial([0.4, 0.2, 0.1]);
  const material3 = new MetalMaterial([0.7, 0.6, 0.5], 0);
  world.add(new Sphere([1, 1, 0], 1, material1));
  world.add(new Sphere([-4, 1, 0], 1, material2));
  world.add(new Sphere([4, 1, 0], 1, material3));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), { lookFrom: [13, 2, 3], fovY: 20 });
  if (useBVH) {
    return { world: new HittableList(BVHNode.createFromHitableList(world, 0, 1)), cameraOptions };
  } else {
    return { world, cameraOptions };
  }
}
function twoCheckerSpheres(_useBVH) {
  const world = new HittableList();
  const checkerTexture = new CheckerTexture([0.2, 0.3, 0.1], [0.9, 0.9, 0.9], 40);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = checkerTexture;
  world.add(new Sphere([0, -10, 0], 10, sphereMaterial));
  world.add(new Sphere([0, 10, 0], 10, sphereMaterial));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), { lookFrom: [13, 2, 3], fovY: 20 });
  return { world, cameraOptions };
}
function twoNoiseSpheres(_useBVH) {
  const world = new HittableList();
  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;
  world.add(new Sphere([0, -1e3, 0], 1e3, sphereMaterial));
  world.add(new Sphere([0, 2, 0], 2, sphereMaterial));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), { lookFrom: [13, 2, 3], fovY: 20 });
  return { world, cameraOptions };
}
async function earthSphere(_useBVH) {
  const world = new HittableList();
  const earthTexture = new ImageTexture();
  await earthTexture.load("assets/textures/earthmap.jpg");
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = earthTexture;
  world.add(new Sphere([0, 0, 0], 2, sphereMaterial));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), { lookFrom: [13, 2, 3], fovY: 20 });
  return { world, cameraOptions };
}
function areaLight(_useBVH) {
  const world = new HittableList();
  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;
  world.add(new Sphere([0, -1e3, 0], 1e3, sphereMaterial));
  world.add(new Sphere([0, 2, 0], 2, sphereMaterial));
  const diffuseLight = new DiffuseLight([4, 4, 4]);
  world.add(new XYRect(3, 5, 1, 3, -2, diffuseLight));
  world.add(new Sphere([0, 7, 0], 2, diffuseLight));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), {
    lookFrom: [26, 3, 6],
    lookAt: [0, 2, 0],
    background: [0, 0, 0],
    fovY: 20
  });
  return { world, cameraOptions };
}
function cornellBox(useBVH) {
  const world = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);
  world.add(new YZRect(0, 555, 0, 555, 555, red));
  world.add(new YZRect(0, 555, 0, 555, 0, green));
  world.add(new XZRect(213, 343, 227, 332, 554, light));
  world.add(new XZRect(0, 555, 0, 555, 0, white));
  world.add(new XZRect(0, 555, 0, 555, 555, white));
  world.add(new XYRect(0, 555, 0, 555, 555, white));
  const box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1.transform.translate([265, 0, 295]);
  box1.transform.rotateEuler(0, 15, 0);
  world.add(box1);
  const box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2.transform.translate([130, 0, 65]);
  box2.transform.rotateEuler(0, -18, 0);
  world.add(box2);
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), {
    lookFrom: [278, 278, -800],
    lookAt: [278, 278, 0],
    background: [0, 0, 0]
  });
  if (useBVH) {
    return { world: new HittableList(BVHNode.createFromHitableList(world, 0, 1)), cameraOptions };
  } else {
    return { world, cameraOptions };
  }
}
function cornellBoxSmoke(useBVH) {
  const world = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);
  world.add(new YZRect(0, 555, 0, 555, 555, red));
  world.add(new YZRect(0, 555, 0, 555, 0, green));
  world.add(new XZRect(213, 343, 227, 332, 554, light));
  world.add(new XZRect(0, 555, 0, 555, 0, white));
  world.add(new XZRect(0, 555, 0, 555, 555, white));
  world.add(new XYRect(0, 555, 0, 555, 555, white));
  const box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1.transform.translate([265, 0, 295]);
  box1.transform.rotateEuler(0, 15, 0);
  world.add(new ConstantMedium(box1, 0.01, [0, 0, 0]));
  const box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2.transform.translate([130, 0, 65]);
  box2.transform.rotateEuler(0, -18, 0);
  world.add(new ConstantMedium(box2, 0.01, [1, 1, 1]));
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), {
    lookFrom: [278, 278, -800],
    lookAt: [278, 278, 0],
    background: [0, 0, 0]
  });
  if (useBVH) {
    return { world: new HittableList(BVHNode.createFromHitableList(world, 0, 1)), cameraOptions };
  } else {
    return { world, cameraOptions };
  }
}
async function finalScene(useBVH) {
  const world = new HittableList();
  const boxes1 = new HittableList();
  const ground = new LambertianMaterial([0.48, 0.83, 0.53]);
  const boxesPerSide = 20;
  const w = 100;
  const y0 = 0;
  for (let i = 0; i < boxesPerSide; i++) {
    for (let j = 0; j < boxesPerSide; j++) {
      const x0 = -1e3 + i * w;
      const z0 = -1e3 + j * w;
      const x1 = x0 + w;
      const y1 = randomNumberRange(1, 101);
      const z1 = z0 + w;
      boxes1.add(new Box([x0, y0, z0], [x1, y1, z1], ground));
    }
  }
  if (useBVH) {
    world.add(BVHNode.createFromHitableList(boxes1, 0, 1));
  } else {
    world.add(boxes1);
  }
  const light = new DiffuseLight([7, 7, 7]);
  world.add(new XZRect(123, 423, 147, 412, 554, light));
  const center1 = [400, 400, 200];
  const center2 = add(create(), center1, [30, 0, 0]);
  const movingSphereMaterial = new LambertianMaterial([0.7, 0.3, 0.1]);
  world.add(new MovingSphere(center1, center2, 0, 1, 50, movingSphereMaterial));
  world.add(new Sphere([260, 150, 45], 50, new DielectricMaterial(1.5)));
  world.add(new Sphere([0, 150, 145], 50, new MetalMaterial([0.8, 0.8, 0.9], 10)));
  const boundary1 = new Sphere([360, 150, 145], 70, new DielectricMaterial(1.5));
  world.add(boundary1);
  world.add(new ConstantMedium(boundary1, 0.2, [0.2, 0.4, 0.9]));
  const boundary2 = new Sphere([0, 0, 0], 5e3, new DielectricMaterial(1.5));
  world.add(new ConstantMedium(boundary2, 1e-4, [1, 1, 1]));
  const earthTexture = new ImageTexture();
  await earthTexture.load("assets/textures/earthmap.jpg");
  const earthMaterial = new LambertianMaterial();
  earthMaterial.texture = earthTexture;
  world.add(new Sphere([400, 200, 400], 100, earthMaterial));
  const perlinTexture = new NoiseTexture(0.1);
  const perlinMaterial = new LambertianMaterial();
  perlinMaterial.texture = perlinTexture;
  world.add(new Sphere([220, 280, 300], 80, perlinMaterial));
  const boxes2 = new HittableList();
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  for (let j = 0; j < 1e3; j++) {
    boxes2.add(new Sphere(randomRange(0, 165), 10, white));
  }
  boxes2.transform.translate([-100, 270, 395]);
  boxes2.transform.rotateEuler(0, 15, 0);
  if (useBVH) {
    world.add(BVHNode.createFromHitableList(boxes2, 0, 1));
  } else {
    world.add(boxes2);
  }
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), {
    lookFrom: [478, 278, -600],
    lookAt: [278, 278, 0],
    background: [0, 0, 0]
  });
  return { world, cameraOptions };
}
async function gltfScene(useBVH) {
  const world = await load("assets/models/mesh_light.gltf");
  const lookFrom = [0, 0.8, 1.9];
  const lookAt = [0, 0.8, -1];
  const fovY = 71.74995067;
  const background = [0, 0, 0];
  const cameraOptions = __spreadProps(__spreadValues({}, defaultCameraOptions), { lookFrom, lookAt, fovY, background });
  if (useBVH) {
    return {
      world: new HittableList(BVHNode.createFromHitableList(world, 0, 1)),
      cameraOptions
    };
  } else {
    return { world, cameraOptions };
  }
}
const sceneCreators = [
  randomScene,
  twoCheckerSpheres,
  twoNoiseSpheres,
  earthSphere,
  areaLight,
  cornellBox,
  cornellBoxSmoke,
  finalScene,
  gltfScene
];
async function getScene(sceneIndex, useBVH = false) {
  const { world, cameraOptions } = await sceneCreators[sceneIndex](useBVH);
  return { world, cameraOptions };
}
function createComputeTiles(imageWidth, imageHeight, tileSize) {
  const computeTiles = [];
  for (let y = 0; y < imageHeight; y += tileSize) {
    for (let x = 0; x < imageWidth; x += tileSize) {
      computeTiles.push({
        x,
        y,
        width: x + tileSize < imageWidth ? tileSize : imageWidth - x,
        height: y + tileSize < imageHeight ? tileSize : imageHeight - y
      });
    }
  }
  return computeTiles;
}
class WebGPUContext {
  static createContext(device, queue, context) {
    WebGPUContext._device = device;
    WebGPUContext._queue = queue;
    WebGPUContext._context = context;
  }
  static get device() {
    return WebGPUContext._device;
  }
  static get queue() {
    return WebGPUContext._queue;
  }
  static get context() {
    return WebGPUContext._context;
  }
}
class WebGPUBuffer {
  constructor() {
    this._size = 0;
  }
  create(size, usage) {
    this._size = size;
    this._gpuBuffer = WebGPUContext.device.createBuffer({
      size: this._size,
      usage
    });
  }
  createWithArrayMapped(srcArrayBuffer, usage) {
    this._size = srcArrayBuffer.byteLength;
    this._gpuBuffer = WebGPUContext.device.createBuffer({
      mappedAtCreation: true,
      size: this._size,
      usage
    });
    const bufferMapped = this._gpuBuffer.getMappedRange();
    new Float32Array(bufferMapped).set(new Float32Array(srcArrayBuffer));
    this._gpuBuffer.unmap();
  }
  async mapRead(offset, size) {
    await this._gpuBuffer.mapAsync(GPUMapMode.READ);
    return this._gpuBuffer.getMappedRange(offset, size);
  }
  async mapWrite(offset, size) {
    await this._gpuBuffer.mapAsync(GPUMapMode.WRITE);
    return this._gpuBuffer.getMappedRange(offset, size);
  }
  get gpuBuffer() {
    return this._gpuBuffer;
  }
  get size() {
    return this._size;
  }
}
var WebGPUMaterialType;
(function(WebGPUMaterialType2) {
  WebGPUMaterialType2[WebGPUMaterialType2["Lambertian"] = 0] = "Lambertian";
  WebGPUMaterialType2[WebGPUMaterialType2["Metal"] = 1] = "Metal";
  WebGPUMaterialType2[WebGPUMaterialType2["Dielectric"] = 2] = "Dielectric";
  WebGPUMaterialType2[WebGPUMaterialType2["IsoTropic"] = 3] = "IsoTropic";
  WebGPUMaterialType2[WebGPUMaterialType2["DiffuseLight"] = 4] = "DiffuseLight";
  WebGPUMaterialType2[WebGPUMaterialType2["Normal"] = 5] = "Normal";
})(WebGPUMaterialType || (WebGPUMaterialType = {}));
var WebGPUPrimitiveType;
(function(WebGPUPrimitiveType2) {
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["Sphere"] = 0] = "Sphere";
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["MovingSphere"] = 1] = "MovingSphere";
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["XYRect"] = 2] = "XYRect";
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["XZRect"] = 3] = "XZRect";
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["YZRect"] = 4] = "YZRect";
  WebGPUPrimitiveType2[WebGPUPrimitiveType2["Triangle"] = 6] = "Triangle";
})(WebGPUPrimitiveType || (WebGPUPrimitiveType = {}));
var WebGPUTextureType;
(function(WebGPUTextureType2) {
  WebGPUTextureType2[WebGPUTextureType2["Solid"] = 0] = "Solid";
  WebGPUTextureType2[WebGPUTextureType2["Checker"] = 1] = "Checker";
  WebGPUTextureType2[WebGPUTextureType2["Noise"] = 2] = "Noise";
  WebGPUTextureType2[WebGPUTextureType2["Image"] = 3] = "Image";
})(WebGPUTextureType || (WebGPUTextureType = {}));
const PADDING_VALUE = -99;
class RaytracingBuffers {
  constructor(world) {
    this._gpuMaterials = [];
    this._gpuPrimitives = [];
    this._gpuTextures = [];
    this._textureSize = 2;
    this._imageTextures = [];
    this.traverseHittables(world, create$1());
  }
  get hasImageTextures() {
    return this._imageTextures.length > 0;
  }
  traverseHittables(list, objectToWorld) {
    for (const object of list.objects) {
      const currentObjectToWorld = object.transform.objectToWorld;
      multiply$1(currentObjectToWorld, objectToWorld, currentObjectToWorld);
      if (object instanceof HittableList) {
        this.traverseHittables(object, currentObjectToWorld);
      } else if (object instanceof Box) {
        this.traverseHittables(object.sides, currentObjectToWorld);
      } else {
        this.addPrimitive(object, currentObjectToWorld);
      }
    }
  }
  addTexture(tex) {
    const idx = this._gpuTextures.length;
    const gpuTex = {
      color: [1, 1, 1, 1],
      checkerOdd: [1, 1, 1, 1],
      checkerEven: [1, 1, 1, 1],
      uvOffset: [1, 1],
      scale: 1,
      textureType: 0,
      imageTextureIndex: -1,
      pad_0: PADDING_VALUE,
      pad_1: PADDING_VALUE,
      pad_2: PADDING_VALUE
    };
    if (tex instanceof SolidColor) {
      gpuTex.color = fromValues$1(tex.color[0], tex.color[1], tex.color[2], 1);
      gpuTex.textureType = 0;
    } else if (tex instanceof CheckerTexture) {
      gpuTex.checkerOdd = fromValues$1(tex.odd[0], tex.odd[1], tex.odd[2], 1);
      gpuTex.checkerEven = fromValues$1(tex.even[0], tex.even[1], tex.even[2], 1);
      gpuTex.scale = tex.scale;
      gpuTex.textureType = 1;
    } else if (tex instanceof NoiseTexture) {
      gpuTex.scale = tex.scale;
      gpuTex.textureType = 2;
    } else if (tex instanceof ImageTexture) {
      this._textureSize = Math.max(this.getNextPowerOf2(tex.width, tex.height), this._textureSize);
      gpuTex.textureType = 3;
      gpuTex.imageTextureIndex = this._imageTextures.length;
      gpuTex.hasImageTexture = true;
      this._imageTextures.push(tex);
    }
    this._gpuTextures.push(gpuTex);
    return idx;
  }
  addMaterial(mat) {
    const idx = this._gpuMaterials.length;
    let gpuMat;
    mat.texture;
    const textureIndex = this.addTexture(mat.texture);
    if (mat instanceof LambertianMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: 0,
        textureIndex
      };
    } else if (mat instanceof MetalMaterial) {
      gpuMat = {
        baseColor: fromValues$1(mat.baseColor[0], mat.baseColor[1], mat.baseColor[2], 1),
        roughness: mat.roughness,
        indexOfRefraction: 1,
        materialType: 1,
        textureIndex
      };
    } else if (mat instanceof DielectricMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: mat.indexOfRefraction,
        materialType: 2,
        textureIndex
      };
    } else if (mat instanceof DiffuseLight) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: 4,
        textureIndex
      };
    } else if (mat instanceof NormalMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: 5,
        textureIndex
      };
    }
    this._gpuMaterials.push(gpuMat);
    return idx;
  }
  addPrimitive(obj, objectToWorld) {
    const idx = this._gpuPrimitives.length;
    let gpuPrimitive;
    const mat = obj.material;
    const materialIndex = obj.material ? this.addMaterial(mat) : -1;
    const sphereDummy = {
      center0: create$3(),
      center1: create$3(),
      radius: 0
    };
    const rectDummy = {
      bounds: create$3(),
      k: 0
    };
    const triangleDummy = {
      v0: create$3(),
      v1: create$3(),
      v2: create$3(),
      n0: create$3(),
      n1: create$3(),
      n2: create$3(),
      uv0: create$3(),
      uv1: create$3(),
      uv2: create$3()
    };
    if (obj instanceof Sphere) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues({
        objectToWorld,
        center0: fromValues$1(obj.center[0], obj.center[1], obj.center[2], 0),
        center1: [0, 0, 0, 1],
        radius: obj.radius
      }, rectDummy), triangleDummy), {
        primitiveType: 0,
        materialIndex
      });
    } else if (obj instanceof MovingSphere) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues({
        objectToWorld,
        center0: fromValues$1(obj.center0[0], obj.center0[1], obj.center0[2], obj.time0),
        center1: fromValues$1(obj.center1[0], obj.center1[1], obj.center1[2], obj.time1),
        radius: obj.radius
      }, rectDummy), triangleDummy), {
        primitiveType: 1,
        materialIndex
      });
    } else if (obj instanceof XYRect) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues({
        objectToWorld,
        bounds: [obj.x0, obj.x1, obj.y0, obj.y1],
        k: obj.k
      }, sphereDummy), triangleDummy), {
        primitiveType: 2,
        materialIndex
      });
    } else if (obj instanceof XZRect) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues({
        objectToWorld,
        bounds: [obj.x0, obj.x1, obj.z0, obj.z1],
        k: obj.k
      }, sphereDummy), triangleDummy), {
        primitiveType: 3,
        materialIndex
      });
    } else if (obj instanceof YZRect) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues({
        objectToWorld,
        bounds: [obj.y0, obj.y1, obj.z0, obj.z1],
        k: obj.k
      }, sphereDummy), triangleDummy), {
        primitiveType: 4,
        materialIndex
      });
    } else if (obj instanceof Triangle) {
      gpuPrimitive = __spreadProps(__spreadValues(__spreadValues(__spreadValues({
        objectToWorld
      }, triangleDummy), rectDummy), sphereDummy), {
        primitiveType: 6,
        materialIndex
      });
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
  getNextPowerOf2(width, height) {
    return nextPowerOf2(Math.max(width, height));
  }
  textureBuffer() {
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
      bufferDataF32[offset++] = texture.pad_0;
      bufferDataF32[offset++] = texture.pad_1;
      bufferDataF32[offset++] = texture.pad_2;
    }
    return bufferData;
  }
  async imageTexture() {
    const sampler = WebGPUContext.device.createSampler({
      minFilter: "linear",
      magFilter: "linear"
    });
    let imageBitmap;
    const imageSize = {
      width: 2,
      height: 2,
      depthOrArrayLayers: 1
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
      imageBitmap = await window.createImageBitmap(new ImageData(2, 2));
    }
    const texture = WebGPUContext.device.createTexture({
      size: imageSize,
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    const textureView = texture.createView();
    WebGPUContext.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, imageSize);
    return { sampler, textureView };
  }
  materialBuffer() {
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
    return bufferData;
  }
  writeMat4(buffer, offset, mat) {
    for (let i = 0; i < 16; i++) {
      buffer[offset++] = mat[i];
    }
    return offset;
  }
  writeVec4(buffer, offset, vec) {
    for (let i = 0; i < 4; i++) {
      buffer[offset++] = vec[i];
    }
    return offset;
  }
  primitiveBuffer() {
    const elementCount = 100;
    const primitiveSize = elementCount * 4;
    const bufferData = new ArrayBuffer(primitiveSize * this._gpuPrimitives.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);
    let offset = 0;
    for (const primitiv of this._gpuPrimitives) {
      const inverseMatrix = invert(create$1(), primitiv.objectToWorld);
      const rotation = getRotation(create$2(), primitiv.objectToWorld);
      const inverseRotation = invert(create$1(), fromQuat(create$1(), rotation));
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
    }
    return bufferData;
  }
}
class WebGPUObjectBase {
  constructor() {
    this._name = "";
  }
  set name(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
}
const INCLUDE_REGEX = /^#include\s"(.*)"$/gm;
let shaderMap;
async function getShaderHash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
async function getUrlContent(url) {
  const shaderUrl = url.toString();
  const response = await fetch(shaderUrl);
  let content = "";
  if (response.ok) {
    const shaderCode = await response.text();
    const hash = await getShaderHash(shaderCode);
    if (!shaderMap[hash]) {
      console.log(`Using shader module ${shaderUrl}`);
      shaderMap[hash] = true;
      content = shaderCode;
    }
  } else {
    console.error(`Failed to load shader module ${shaderUrl}`);
  }
  return content;
}
async function includeShaders(shaderUrl) {
  let shaderText = await getUrlContent(shaderUrl);
  let match;
  INCLUDE_REGEX.lastIndex = 0;
  const shaderUrlStr = shaderUrl.toString();
  const baseUrl = urlDirname(shaderUrlStr);
  while ((match = INCLUDE_REGEX.exec(shaderText)) !== null) {
    if (match.index === INCLUDE_REGEX.lastIndex) {
      INCLUDE_REGEX.lastIndex++;
    }
    if (match.length === 2) {
      const replacement = match[0];
      const filename = match[1];
      const includeUrl = new URL(filename, baseUrl);
      const includeText = await includeShaders(includeUrl);
      shaderText = shaderText.replace(replacement, includeText);
    }
  }
  return shaderText;
}
async function preprocessShader(shaderUrl) {
  shaderMap = {};
  return await includeShaders(shaderUrl);
}
class WebGPUPipelineBase extends WebGPUObjectBase {
  constructor() {
    super(...arguments);
    this._initialized = false;
  }
  async loadShader(shaderUrl) {
    console.log(`compiling shader: ${shaderUrl}`);
    const code = await preprocessShader(shaderUrl);
    const shaderModule = WebGPUContext.device.createShaderModule({
      code
    });
    let error = false;
    let warning = false;
    const compilationInfo = await shaderModule.compilationInfo();
    for (const message of compilationInfo.messages) {
      if (message.type === "error") {
        error = true;
      }
      if (message.type === "warning") {
        warning = true;
      }
      console.log(message.message);
    }
    if (error || warning) {
      console.log(code);
    }
    return shaderModule;
  }
  getParamsArray(object) {
    const keys = Object.keys(object);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
      const val = object[keys[i]];
      if (Array.isArray(val)) {
        array.push(...val);
      } else {
        array.push(val);
      }
    }
    return new Float32Array(array);
  }
  get gpuPipeline() {
    return this._pipeline;
  }
  get bindGroup() {
    return this._bindGroup;
  }
}
var Bindings;
(function(Bindings2) {
  Bindings2[Bindings2["ComputeParams"] = 0] = "ComputeParams";
  Bindings2[Bindings2["Camera"] = 1] = "Camera";
  Bindings2[Bindings2["PixelBuffer"] = 2] = "PixelBuffer";
  Bindings2[Bindings2["AccumulationBuffer"] = 3] = "AccumulationBuffer";
  Bindings2[Bindings2["Primitives"] = 4] = "Primitives";
  Bindings2[Bindings2["Materials"] = 5] = "Materials";
  Bindings2[Bindings2["Textures"] = 6] = "Textures";
  Bindings2[Bindings2["Sampler"] = 7] = "Sampler";
  Bindings2[Bindings2["ImageTexture"] = 8] = "ImageTexture";
})(Bindings || (Bindings = {}));
class WebGPUComputePipline extends WebGPUPipelineBase {
  constructor(options) {
    super();
    this._computeParamsUniformBuffer = new WebGPUBuffer();
    this._computeCameraUniformBuffer = new WebGPUBuffer();
    this._pixelBuffer = new WebGPUBuffer();
    this._accumulationBuffer = new WebGPUBuffer();
    this._primitivesBuffer = new WebGPUBuffer();
    this._materialsBuffer = new WebGPUBuffer();
    this._texturesBuffer = new WebGPUBuffer();
    this._options = options;
    this._options.uniformParams.currentSample = 0;
    this._raytracingBuffers = new RaytracingBuffers(this._options.world);
  }
  async initialize() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    const pixelBufferSize = this._options.uniformParams.imageWidth * this._options.uniformParams.imageHeight * 4 * Float32Array.BYTES_PER_ELEMENT;
    this._pixelBuffer.create(pixelBufferSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    this._accumulationBuffer.create(pixelBufferSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._computeParamsUniformBuffer.createWithArrayMapped(uniformArray, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    const cameraArray = this._options.camera.getUniformArray();
    this._computeCameraUniformBuffer.createWithArrayMapped(cameraArray, GPUBufferUsage.UNIFORM);
    this.createObjects();
    const bindGroupLayoutDescriptor = {
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform"
          }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage"
          }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage"
          }
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage"
          }
        },
        {
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage"
          }
        },
        {
          binding: 6,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage"
          }
        }
      ]
    };
    bindGroupLayoutDescriptor.entries = [
      ...bindGroupLayoutDescriptor.entries,
      {
        binding: 7,
        visibility: GPUShaderStage.COMPUTE,
        sampler: {
          type: "filtering"
        }
      },
      {
        binding: 8,
        visibility: GPUShaderStage.COMPUTE,
        texture: {
          sampleType: "float"
        }
      }
    ];
    this._bindGroupLayout = WebGPUContext.device.createBindGroupLayout(bindGroupLayoutDescriptor);
    await this.createBindGroup();
  }
  createObjects() {
    this._primitivesBuffer.createWithArrayMapped(this._raytracingBuffers.primitiveBuffer(), GPUBufferUsage.STORAGE);
    this._materialsBuffer.createWithArrayMapped(this._raytracingBuffers.materialBuffer(), GPUBufferUsage.STORAGE);
    this._texturesBuffer.createWithArrayMapped(this._raytracingBuffers.textureBuffer(), GPUBufferUsage.STORAGE);
  }
  updateUniformBuffer(sample, tile) {
    if (this._initialized) {
      this._options.uniformParams.currentSample = sample;
      this._options.uniformParams.tileOffsetX = tile.x;
      this._options.uniformParams.tileOffsetY = tile.y;
      const uniformArray = this.getParamsArray(this._options.uniformParams);
      WebGPUContext.queue.writeBuffer(this._computeParamsUniformBuffer.gpuBuffer, 0, uniformArray.buffer);
    }
  }
  async createBindGroup() {
    const bindGroupDescriptor = {
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._computeParamsUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._computeParamsUniformBuffer.size
          }
        },
        {
          binding: 1,
          resource: {
            buffer: this._computeCameraUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._computeCameraUniformBuffer.size
          }
        },
        {
          binding: 2,
          resource: {
            buffer: this._pixelBuffer.gpuBuffer,
            offset: 0,
            size: this._pixelBuffer.size
          }
        },
        {
          binding: 3,
          resource: {
            buffer: this._accumulationBuffer.gpuBuffer,
            offset: 0,
            size: this._accumulationBuffer.size
          }
        },
        {
          binding: 4,
          resource: {
            buffer: this._primitivesBuffer.gpuBuffer,
            offset: 0,
            size: this._primitivesBuffer.size
          }
        },
        {
          binding: 5,
          resource: {
            buffer: this._materialsBuffer.gpuBuffer,
            offset: 0,
            size: this._materialsBuffer.size
          }
        },
        {
          binding: 6,
          resource: {
            buffer: this._texturesBuffer.gpuBuffer,
            offset: 0,
            size: this._texturesBuffer.size
          }
        }
      ]
    };
    const { sampler, textureView } = await this._raytracingBuffers.imageTexture();
    bindGroupDescriptor.entries = [
      ...bindGroupDescriptor.entries,
      {
        binding: 7,
        resource: sampler
      },
      {
        binding: 8,
        resource: textureView
      }
    ];
    this._bindGroup = WebGPUContext.device.createBindGroup(bindGroupDescriptor);
    this._bindGroup.label = `${this.name}-BindGroup`;
    const layout = WebGPUContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout]
    });
    const computeStage = {
      module: await this.loadShader(this._options.computeShaderUrl),
      entryPoint: "main"
    };
    const pipelineDesc = {
      layout,
      compute: computeStage
    };
    this._pipeline = WebGPUContext.device.createComputePipeline(pipelineDesc);
  }
  get gpuPipeline() {
    return this._pipeline;
  }
  get pixelBuffer() {
    return this._pixelBuffer;
  }
}
const _attributeElementCount = 3;
const _vertexPositions = new Float32Array([
  -1,
  1,
  0,
  1,
  1,
  0,
  -1,
  -1,
  0,
  1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1,
  0
]);
class WebGPURenderPipeline extends WebGPUPipelineBase {
  constructor(options) {
    super();
    this._vertexPositionBuffer = new WebGPUBuffer();
    this._renderParamsUniformBuffer = new WebGPUBuffer();
    this._options = options;
  }
  async initialize() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    this._vertexPositionBuffer.createWithArrayMapped(_vertexPositions, GPUBufferUsage.VERTEX);
    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._renderParamsUniformBuffer.createWithArrayMapped(uniformArray, GPUBufferUsage.UNIFORM);
    this._bindGroupLayout = WebGPUContext.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "storage"
          }
        }
      ]
    });
    await this.createBindGroup();
  }
  async createBindGroup() {
    this._bindGroup = WebGPUContext.device.createBindGroup({
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._renderParamsUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._renderParamsUniformBuffer.size
          }
        },
        {
          binding: 1,
          resource: {
            buffer: this._options.sharedPixelBuffer.gpuBuffer,
            offset: 0,
            size: this._options.sharedPixelBuffer.size
          }
        }
      ]
    });
    this._bindGroup.label = `${this.name}-BindGroup`;
    const layout = WebGPUContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout]
    });
    const primitiveState = {
      topology: "triangle-list",
      frontFace: "cw",
      cullMode: "none"
    };
    const vertexBufferDesc = {
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: "float32x3"
        }
      ],
      arrayStride: _attributeElementCount * Float32Array.BYTES_PER_ELEMENT,
      stepMode: "vertex"
    };
    const vertexState = {
      module: await this.loadShader(this._options.vertexShaderUrl),
      entryPoint: "main",
      buffers: [vertexBufferDesc]
    };
    const colorState = {
      format: "bgra8unorm",
      blend: {
        color: {
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha",
          operation: "add"
        },
        alpha: {
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha",
          operation: "add"
        }
      },
      writeMask: GPUColorWrite.ALL
    };
    const fragmentState = {
      module: await this.loadShader(this._options.fragmentShaderUrl),
      entryPoint: "main",
      targets: [colorState]
    };
    const pipelineDesc = {
      layout,
      vertex: vertexState,
      primitive: primitiveState,
      fragment: fragmentState,
      multisample: {
        count: 1
      }
    };
    this._pipeline = WebGPUContext.device.createRenderPipeline(pipelineDesc);
  }
  get gpuPipeline() {
    return this._pipeline;
  }
  get vertexPostionBuffer() {
    return this._vertexPositionBuffer.gpuBuffer;
  }
}
const LOCAL_SIZE = 8;
class RaytracerGPU extends RaytracerBase {
  constructor(rayTracerGPUOptions) {
    super();
    this._initialized = false;
    this._rayTracerOptions = rayTracerGPUOptions;
  }
  static supportsWebGPU() {
    if (navigator.gpu) {
      return true;
    }
    return false;
  }
  async start(doneCallback) {
    console.time("RaytracerGPU initialization");
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;
    const textureSize = {
      width: this._rayTracerOptions.imageWidth,
      height: this._rayTracerOptions.imageHeight,
      depthOrArrayLayers: 1
    };
    const colorTextureDesc = {
      size: textureSize,
      sampleCount: 1,
      format: "bgra8unorm",
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    };
    WebGPUContext.device.createTexture(colorTextureDesc);
    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;
    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene);
    const camera = new Camera();
    camera.init(cameraOptions.lookFrom, cameraOptions.lookAt, cameraOptions.vUp, cameraOptions.fovY, aspectRatio, cameraOptions.aperture, cameraOptions.focusDist, 0, 0.1);
    const baseUrl = window.location.origin;
    const computePipeline = new WebGPUComputePipline({
      computeShaderUrl: new URL("assets/shaders/raytracer.comp.wgsl", baseUrl),
      uniformParams: {
        background: cameraOptions.background,
        tileOffsetX: 0,
        tileOffsetY: 0,
        imageWidth: this._rayTracerOptions.imageWidth,
        imageHeight: this._rayTracerOptions.imageHeight,
        currentSample: 1,
        maxBounces: this._rayTracerOptions.maxBounces,
        padding_0: 0,
        padding_1: 0,
        padding_2: 0
      },
      camera,
      world
    });
    await computePipeline.initialize();
    const renderPipeline = new WebGPURenderPipeline({
      vertexShaderUrl: new URL("assets/shaders/renderer.vert.wgsl", baseUrl),
      fragmentShaderUrl: new URL("assets/shaders/renderer.frag.wgsl", baseUrl),
      sharedPixelBuffer: computePipeline.pixelBuffer,
      uniformParams: {
        width: this._rayTracerOptions.imageWidth,
        height: this._rayTracerOptions.imageHeight
      }
    });
    await renderPipeline.initialize();
    const raytracing = async () => {
      return new Promise((resolve) => {
        const computeTiles = createComputeTiles(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight, this._rayTracerOptions.tileSize);
        const frequency = 50;
        let sample = 1;
        let tile;
        const frame = () => {
          const frameStartTime = window.performance.now();
          let duration2 = 0;
          do {
            if (sample === 1) {
              tile = computeTiles.shift();
            }
            this.computePass(computePipeline, sample, tile);
            if (sample < this._rayTracerOptions.samplesPerPixel) {
              sample++;
            } else {
              sample = 1;
            }
            duration2 += window.performance.now() - frameStartTime;
          } while (computeTiles.length && duration2 < frequency);
          this.renderPass(renderPipeline);
          if (computeTiles.length || sample < this._rayTracerOptions.samplesPerPixel - 1) {
            window.requestAnimationFrame(frame);
          } else {
            resolve();
          }
        };
        window.requestAnimationFrame(frame);
      });
    };
    console.timeEnd("RaytracerGPU initialization");
    await raytracing();
    const duration = performance.now() - this._startTime;
    const stats = `WebGPU -- ${this.getStats(duration)}`;
    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer(computePipeline);
      const canvas2d = document.createElement("canvas");
      canvas2d.width = this._rayTracerOptions.imageWidth;
      canvas2d.height = this._rayTracerOptions.imageHeight;
      const canvas2dContext = canvas2d.getContext("2d");
      const imageData = canvas2dContext.createImageData(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight);
      for (let i = 0; i < pixelBuffer.length; i++) {
        imageData.data[i] = pixelBuffer[i] * 255;
      }
      canvas2dContext.putImageData(imageData, 0, 0);
      await this.downloadImage(canvas2dContext, stats);
    }
    if (this._doneCallback) {
      this._doneCallback(stats);
    }
    this._isRunning = false;
  }
  stop() {
  }
  async initialize() {
    if (this._initialized) {
      return;
    }
    const gpu = navigator.gpu;
    try {
      const adapter = await gpu.requestAdapter();
      const device = await adapter.requestDevice();
      const queue = device.queue;
      const context = this._rayTracerOptions.canvas.getContext("webgpu");
      this._presentationFormat = context.getPreferredFormat(adapter);
      WebGPUContext.createContext(device, queue, context);
      const canvasConfigure = {
        device,
        format: this._presentationFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
      };
      context.configure(canvasConfigure);
      this._initialized = true;
    } catch (error) {
      console.log(error);
    }
  }
  computePass(computePipeline, sample, tile) {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();
    computePipeline.updateUniformBuffer(sample, tile);
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline.gpuPipeline);
    passEncoder.setBindGroup(0, computePipeline.bindGroup);
    passEncoder.dispatch(tile.width / LOCAL_SIZE, tile.height / LOCAL_SIZE, 1);
    passEncoder.endPass();
    WebGPUContext.queue.submit([commandEncoder.finish()]);
  }
  renderPass(renderPipeLine) {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();
    const colorAttachment = {
      view: WebGPUContext.context.getCurrentTexture().createView(),
      loadValue: { r: 0, g: 0, b: 0, a: 0 },
      storeOp: "store"
    };
    const renderPassDesc = {
      colorAttachments: [colorAttachment]
    };
    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(renderPipeLine.gpuPipeline);
    passEncoder.setBindGroup(0, renderPipeLine.bindGroup);
    passEncoder.setVertexBuffer(0, renderPipeLine.vertexPostionBuffer);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.endPass();
    WebGPUContext.queue.submit([commandEncoder.finish()]);
  }
  async copyBuffer(computePipeline) {
    const commandEncoder = WebGPUContext.device.createCommandEncoder();
    const bufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4 * 4;
    const gpuDestBuffer = new WebGPUBuffer();
    gpuDestBuffer.create(bufferSize, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
    commandEncoder.copyBufferToBuffer(computePipeline.pixelBuffer.gpuBuffer, 0, gpuDestBuffer.gpuBuffer, 0, bufferSize);
    WebGPUContext.queue.submit([commandEncoder.finish()]);
    const arrayBuffer = await gpuDestBuffer.mapRead();
    return new Float32Array(arrayBuffer);
  }
}
const RaytracerProperties = Recoil_index_6({
  key: "raytracerProperties",
  default: {
    imageWidth: 1280,
    imageHeight: 720,
    samplesPerPixel: 20,
    maxBounces: 12,
    numOfWorkers: navigator.hardwareConcurrency,
    webGPUavailable: false,
    webGPUenabled: false,
    download: true,
    addStatsToImage: true,
    scene: 0,
    tileSize: 64
  }
});
const RaytracerRunningState = Recoil_index_6({
  key: "raytracerState",
  default: {
    isRunning: false,
    stats: ""
  }
});
const jsx = jsxRuntime.exports.jsx;
const jsxs = jsxRuntime.exports.jsxs;
const Fragment = jsxRuntime.exports.Fragment;
const CheckBox = (props) => {
  const onInputChange = (event) => {
    const value = event.target.checked;
    props.onValueChange(value);
  };
  let classes = "checkbox";
  if (props.disabled) {
    classes += " disabled";
  }
  return /* @__PURE__ */ jsxs("div", {
    className: classes,
    children: [/* @__PURE__ */ jsx("input", {
      type: "checkbox",
      disabled: props.disabled,
      checked: props.checked,
      onChange: onInputChange
    }), /* @__PURE__ */ jsx("span", {
      children: props.label
    })]
  });
};
const NumberInput = (props) => {
  const onInputChange = (event) => {
    const value = parseInt(event.target.value);
    if (!Number.isNaN(value)) {
      props.onValueChange(value);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "input",
    children: [/* @__PURE__ */ jsx("label", {
      children: props.label
    }), /* @__PURE__ */ jsx("input", {
      type: "number",
      size: props.size,
      min: props.min,
      max: props.max,
      value: props.value,
      onChange: onInputChange
    })]
  });
};
const DropDown = (props) => {
  const onSelectChange = (event) => {
    const value = event.target.value;
    props.onValueChange(parseInt(value));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "dropdown",
    children: [/* @__PURE__ */ jsx("span", {
      children: props.label
    }), /* @__PURE__ */ jsx("select", {
      defaultValue: props.default,
      onChange: onSelectChange,
      children: props.items.map((item) => {
        return /* @__PURE__ */ jsx("option", {
          value: item.value,
          disabled: item.disabled,
          children: item.text
        }, item.value);
      })
    })]
  });
};
const Gui = () => {
  const [raytracerState, setRaytracerState] = Recoil_index_20(RaytracerProperties);
  const resetRaytracerState = Recoil_index_23(RaytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = Recoil_index_20(RaytracerRunningState);
  React.useEffect(() => {
    if (RaytracerGPU.supportsWebGPU()) {
      setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        webGPUavailable: true,
        webGPUenabled: true
      }));
    }
  }, []);
  const onResetClicked = () => {
    resetRaytracerState();
  };
  const onStartRenderClicked = () => {
    setRaytracerRunningState(__spreadProps(__spreadValues({}, raytracerRunningState), {
      isRunning: true,
      stats: ""
    }));
  };
  const sceneConfig = [
    {
      text: "Random Spheres",
      value: 0,
      disabled: false
    },
    {
      text: "2 Checkboard spheres",
      value: 1,
      disabled: false
    },
    {
      text: "2 Noise spheres",
      value: 2,
      disabled: false
    },
    {
      text: "Earth sphere",
      value: 3,
      disabled: false
    },
    {
      text: "Area light",
      value: 4,
      disabled: false
    },
    {
      text: "Cornell Box",
      value: 5,
      disabled: false
    },
    {
      text: "GLTF Scene",
      value: 8,
      disabled: false
    }
  ];
  return /* @__PURE__ */ jsxs("div", {
    className: "gui",
    children: [/* @__PURE__ */ jsx(NumberInput, {
      label: "Image width:",
      size: 5,
      min: 1,
      value: raytracerState.imageWidth,
      onValueChange: (imageWidth) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        imageWidth
      }))
    }), /* @__PURE__ */ jsx(NumberInput, {
      label: "Image height:",
      size: 5,
      min: 1,
      value: raytracerState.imageHeight,
      onValueChange: (imageHeight) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        imageHeight
      }))
    }), /* @__PURE__ */ jsx(NumberInput, {
      label: "Samples per pixel:",
      size: 5,
      min: 1,
      value: raytracerState.samplesPerPixel,
      onValueChange: (samplesPerPixel) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        samplesPerPixel
      }))
    }), /* @__PURE__ */ jsx(NumberInput, {
      label: "Max bounces:",
      size: 5,
      min: 1,
      value: raytracerState.maxBounces,
      onValueChange: (maxBounces) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        maxBounces
      }))
    }), raytracerState.webGPUenabled === false ? /* @__PURE__ */ jsx(NumberInput, {
      label: "Num of CPU workers:",
      size: 5,
      min: 1,
      max: navigator.hardwareConcurrency,
      value: raytracerState.numOfWorkers,
      onValueChange: (numOfWorkers) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        numOfWorkers
      }))
    }) : "", /* @__PURE__ */ jsx(NumberInput, {
      label: "Tile size (px):",
      size: 5,
      min: 8,
      max: 512,
      value: raytracerState.tileSize,
      onValueChange: (tileSize) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        tileSize
      }))
    }), /* @__PURE__ */ jsx(CheckBox, {
      label: "WebGPU-compute",
      checked: raytracerState.webGPUenabled,
      disabled: !raytracerState.webGPUavailable,
      onValueChange: (webGPUenabled) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        webGPUenabled
      }))
    }), /* @__PURE__ */ jsx(DropDown, {
      label: "Scene:",
      items: sceneConfig,
      default: raytracerState.scene,
      onValueChange: (scene) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        scene
      }))
    }), /* @__PURE__ */ jsx(CheckBox, {
      label: "Download",
      checked: raytracerState.download,
      disabled: false,
      onValueChange: (download) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        download
      }))
    }), /* @__PURE__ */ jsx(CheckBox, {
      label: "Add stats to download",
      checked: raytracerState.addStatsToImage,
      disabled: !raytracerState.download,
      onValueChange: (addStatsToImage) => setRaytracerState(__spreadProps(__spreadValues({}, raytracerState), {
        addStatsToImage
      }))
    }), /* @__PURE__ */ jsx("button", {
      className: "resetButton",
      onClick: onResetClicked,
      children: "Reset to default"
    }), /* @__PURE__ */ jsx("button", {
      className: "renderButton",
      onClick: onStartRenderClicked,
      children: raytracerRunningState.isRunning ? "Stop rendering!" : "Start rendering!"
    })]
  });
};
function WorkerWrapper() {
  return new Worker("/assets/controller.worker.699444e7.js", {
    "type": "module"
  });
}
var ControllerCommands;
(function(ControllerCommands2) {
  ControllerCommands2[ControllerCommands2["START"] = 0] = "START";
  ControllerCommands2[ControllerCommands2["STOP"] = 1] = "STOP";
  ControllerCommands2[ControllerCommands2["UPDATE"] = 2] = "UPDATE";
  ControllerCommands2[ControllerCommands2["END"] = 3] = "END";
})(ControllerCommands || (ControllerCommands = {}));
var ComputeCommands;
(function(ComputeCommands2) {
  ComputeCommands2[ComputeCommands2["INIT"] = 0] = "INIT";
  ComputeCommands2[ComputeCommands2["READY"] = 1] = "READY";
  ComputeCommands2[ComputeCommands2["START"] = 2] = "START";
  ComputeCommands2[ComputeCommands2["END"] = 3] = "END";
})(ComputeCommands || (ComputeCommands = {}));
class RaytracerCPU extends RaytracerBase {
  constructor(rayTracerCPUOptions) {
    super();
    this._controllerWorker = new WorkerWrapper();
    this._rayTracerOptions = rayTracerCPUOptions;
  }
  updateImage(imageArray) {
    const imageData = this._context2D.createImageData(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight);
    let j = 0;
    for (let y = this._rayTracerOptions.imageHeight - 1; y >= 0; y--) {
      for (let x = 0; x < this._rayTracerOptions.imageWidth; x++) {
        const imageIndex = (y * this._rayTracerOptions.imageWidth + x) * 4;
        imageData.data[imageIndex] = imageArray[j++];
        imageData.data[imageIndex + 1] = imageArray[j++];
        imageData.data[imageIndex + 2] = imageArray[j++];
        imageData.data[imageIndex + 3] = imageArray[j++];
      }
    }
    this._context2D.putImageData(imageData, 0, 0);
  }
  async onControllerFinshed() {
    this._isRunning = false;
    const duration = performance.now() - this._startTime;
    const cores = this._rayTracerOptions.numOfWorkers;
    const stats = `CPU, cores: ${cores} -- ${this.getStats(duration)}`;
    if (this._rayTracerOptions.download) {
      await this.downloadImage(this._context2D, stats);
    }
    if (this._doneCallback) {
      this._doneCallback(stats);
    }
  }
  async onControllerMessage(event) {
    const msg = event.data;
    switch (msg.cmd) {
      case ControllerCommands.END:
        await this.onControllerFinshed();
        break;
      case ControllerCommands.UPDATE:
        this.updateImage(msg.data.imageArray);
        break;
    }
  }
  async start(doneCallback) {
    this._doneCallback = doneCallback;
    this._context2D = this._rayTracerOptions.canvas.getContext("2d");
    this._isRunning = true;
    this._startTime = performance.now();
    this._controllerWorker.onmessage = async (event) => this.onControllerMessage(event);
    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene, true);
    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;
    const camera = new Camera();
    camera.init(cameraOptions.lookFrom, cameraOptions.lookAt, cameraOptions.vUp, cameraOptions.fovY, aspectRatio, cameraOptions.aperture, cameraOptions.focusDist, 0, 0.1);
    const controllerStartMessage = {
      cmd: ControllerCommands.START,
      data: {
        imageWidth: this._rayTracerOptions.imageWidth,
        imageHeight: this._rayTracerOptions.imageHeight,
        samplesPerPixel: this._rayTracerOptions.samplesPerPixel,
        maxBounces: this._rayTracerOptions.maxBounces,
        computeWorkers: this._rayTracerOptions.numOfWorkers,
        sceneIdx: this._rayTracerOptions.scene,
        world: serialize(HittableList, world),
        camera: serialize(Camera, camera),
        background: cameraOptions.background,
        tileSize: this._rayTracerOptions.tileSize
      }
    };
    this._controllerWorker.postMessage(controllerStartMessage);
  }
  stop() {
    const controllerStopMessage = {
      cmd: ControllerCommands.STOP,
      data: {}
    };
    this._controllerWorker.postMessage(controllerStopMessage);
  }
  set numOfWorkers(numOfWorkers) {
    this._rayTracerOptions.numOfWorkers = numOfWorkers;
  }
}
const Canvas = () => {
  const canvasCPURef = React.useRef(void 0);
  const canvasGPURef = React.useRef(void 0);
  const [raytracerState] = Recoil_index_20(RaytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = Recoil_index_20(RaytracerRunningState);
  const rayTracerCPURef = React.useRef(void 0);
  const rayTracerGPURef = React.useRef(void 0);
  const onRayTracerDone = (stats) => {
    setRaytracerRunningState(__spreadProps(__spreadValues({}, raytracerRunningState), {
      isRunning: false,
      stats
    }));
  };
  React.useEffect(() => {
    const options = {
      imageWidth: raytracerState.imageWidth,
      imageHeight: raytracerState.imageHeight,
      samplesPerPixel: raytracerState.samplesPerPixel,
      maxBounces: raytracerState.maxBounces,
      scene: raytracerState.scene,
      download: raytracerState.download,
      addStatsToImage: raytracerState.addStatsToImage,
      tileSize: raytracerState.tileSize
    };
    if (!rayTracerCPURef.current) {
      rayTracerCPURef.current = new RaytracerCPU(__spreadProps(__spreadValues({}, options), {
        canvas: canvasCPURef.current,
        numOfWorkers: raytracerState.numOfWorkers
      }));
    }
    if (RaytracerGPU.supportsWebGPU() && !rayTracerGPURef.current) {
      rayTracerGPURef.current = new RaytracerGPU(__spreadProps(__spreadValues({}, options), {
        canvas: canvasGPURef.current
      }));
    }
    let raytracer;
    if (raytracerState.webGPUenabled) {
      raytracer = rayTracerGPURef.current;
    } else {
      raytracer = rayTracerCPURef.current;
      raytracer.numOfWorkers = raytracerState.numOfWorkers;
    }
    raytracer.imageWidth = raytracerState.imageWidth;
    raytracer.imageHeight = raytracerState.imageHeight;
    raytracer.samplesPerPixel = raytracerState.samplesPerPixel;
    raytracer.maxBounces = raytracerState.maxBounces;
    raytracer.scene = raytracerState.scene;
    raytracer.download = raytracerState.download;
    raytracer.addStatsToImage = raytracerState.addStatsToImage;
    raytracer.tileSize = raytracerState.tileSize;
    if (raytracerRunningState.isRunning && !raytracer.isRunning) {
      void raytracer.start(onRayTracerDone);
    } else if (!raytracerRunningState.isRunning && raytracer.isRunning) {
      raytracer.stop();
    }
  }, [raytracerRunningState.isRunning]);
  const cpuCanvasClasses = `canvas ${raytracerState.webGPUenabled ? "" : "enabled"}`;
  const gpuCanvasClasses = `canvas ${raytracerState.webGPUenabled ? "enabled" : ""}`;
  return /* @__PURE__ */ jsxs("div", {
    className: "render-container",
    children: [/* @__PURE__ */ jsx("div", {
      className: "stats",
      children: /* @__PURE__ */ jsx("span", {
        children: `Render stats: ${raytracerRunningState.stats}`
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "canvas-container",
      children: [/* @__PURE__ */ jsx("canvas", {
        id: "canvas-cpu",
        className: cpuCanvasClasses,
        ref: canvasCPURef,
        width: raytracerState.imageWidth,
        height: raytracerState.imageHeight
      }), /* @__PURE__ */ jsx("canvas", {
        id: "canvas-gpu",
        className: gpuCanvasClasses,
        ref: canvasGPURef,
        width: raytracerState.imageWidth,
        height: raytracerState.imageHeight
      })]
    })]
  });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Gui, {}), /* @__PURE__ */ jsx(Canvas, {})]
  });
};
ReactDOM.render(/* @__PURE__ */ jsx(Recoil_index_4, {
  children: /* @__PURE__ */ jsx(App, {})
}), document.getElementById("root"));
