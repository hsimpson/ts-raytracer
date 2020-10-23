/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Camera = void 0;\nconst Vector = __importStar(__webpack_require__(/*! ./vec3 */ \"./src/vec3.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./raytracer-cpu/ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ./serializing */ \"./src/serializing/index.ts\");\nlet Camera = class Camera {\n    constructor() {\n        //\n    }\n    init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, t0 = 0, t1 = 0) {\n        const theta = util_1.degreeToRadians(fovY);\n        const h = Math.tan(theta / 2);\n        const viewport_height = 2 * h;\n        const viewport_width = aspectRatio * viewport_height;\n        this.w = Vector.unitVector(Vector.subVec3(lookFrom, lookAt));\n        this.u = Vector.unitVector(Vector.cross(vUp, this.w));\n        this.v = Vector.cross(this.w, this.u);\n        this.lookFrom = lookFrom;\n        this.horizontal = Vector.multScalarVec3(this.u, focusDist * viewport_width);\n        this.vertical = Vector.multScalarVec3(this.v, focusDist * viewport_height);\n        const half_horizontal = Vector.divScalarVec(this.horizontal, 2);\n        const half_vertical = Vector.divScalarVec(this.vertical, 2);\n        const focusW = Vector.multScalarVec3(this.w, focusDist);\n        this.lowerLeftCorner = Vector.subVec3(Vector.subVec3(Vector.subVec3(this.lookFrom, half_horizontal), half_vertical), focusW);\n        this.lenseRadius = aperture / 2;\n        this.time0 = t0;\n        this.time1 = t1;\n    }\n    getRay(s, t) {\n        const rd = Vector.multScalarVec3(Vector.randomInUnitdisk(), this.lenseRadius);\n        const vecU = Vector.multScalarVec3(this.u, rd[0]);\n        const vecV = Vector.multScalarVec3(this.v, rd[1]);\n        const offset = Vector.addVec3(vecU, vecV);\n        const sHor = Vector.multScalarVec3(this.horizontal, s);\n        const tVer = Vector.multScalarVec3(this.vertical, t);\n        return new ray_1.default(Vector.addVec3(this.lookFrom, offset), Vector.subVec3(Vector.subVec3(Vector.addVec3(Vector.addVec3(this.lowerLeftCorner, sHor), tVer), this.lookFrom), offset), util_1.randomNumberRange(this.time0, this.time1));\n    }\n    getUniformArray() {\n        const array = [];\n        array.push(...this.lookFrom, 0.0); // vec4 because of memory alignment\n        array.push(...this.lowerLeftCorner, 0.0);\n        array.push(...this.horizontal, 0.0);\n        array.push(...this.vertical, 0.0);\n        array.push(...this.u, 0.0);\n        array.push(...this.v, 0.0);\n        array.push(...this.w, 0.0);\n        array.push(this.lenseRadius);\n        array.push(this.time0);\n        array.push(this.time1);\n        return new Float32Array(array);\n    }\n};\nCamera = __decorate([\n    serializing_1.serializable\n], Camera);\nexports.Camera = Camera;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/camera.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/aabb.ts":
/*!***********************************!*\
  !*** ./src/raytracer-cpu/aabb.ts ***!
  \***********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar AABB_1;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet AABB = AABB_1 = class AABB {\n    constructor(min, max) {\n        this._min = min !== null && min !== void 0 ? min : [0, 0, 0];\n        this._max = max !== null && max !== void 0 ? max : [0, 0, 0];\n    }\n    copyTo(dest) {\n        dest._min = this._min;\n        dest._max = this._max;\n    }\n    get min() {\n        return this._min;\n    }\n    get max() {\n        return this._max;\n    }\n    /*\n    public hit(r: Ray, tmin: number, tmax: number): boolean {\n      for (let a = 0; a < 3; a++) {\n        const rOriginA = r.origin.array[a];\n        const rDirectionA = r.direction.array[a];\n        const t0 = Math.min((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n        const t1 = Math.max((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n  \n        tmin = Math.max(t0, tmin);\n        tmax = Math.min(t1, tmax);\n  \n        if (tmax <= tmin) {\n          return false;\n        }\n      }\n  \n      return true;\n    }*/\n    hit(r, tmin, tmax) {\n        for (let a = 0; a < 3; a++) {\n            const invD = 1.0 / r.direction[a];\n            let t0 = (this._min[a] - r.origin[a]) * invD;\n            let t1 = (this._max[a] - r.origin[a]) * invD;\n            if (invD < 0.0) {\n                const tmp = t0;\n                t0 = t1;\n                t1 = tmp;\n            }\n            tmin = t0 > tmin ? t0 : tmin;\n            tmax = t1 < tmax ? t1 : tmax;\n            if (tmax <= tmin) {\n                return false;\n            }\n        }\n        return true;\n    }\n    static surroundingBox(box0, box1) {\n        const small = [\n            Math.min(box0.min[0], box1.min[0]),\n            Math.min(box0.min[1], box1.min[1]),\n            Math.min(box0.min[2], box1.min[2]),\n        ];\n        const big = [\n            Math.max(box0.max[0], box1.max[0]),\n            Math.max(box0.max[1], box1.max[1]),\n            Math.max(box0.max[2], box1.max[2]),\n        ];\n        return new AABB_1(small, big);\n    }\n};\nAABB = AABB_1 = __decorate([\n    serializing_1.serializable\n], AABB);\nexports.default = AABB;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/aabb.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/aarect.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/aarect.ts ***!
  \*************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/*! CommonJS bailout: this is used directly at 8:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.YZRect = exports.XZRect = exports.XYRect = void 0;\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet XYRect = class XYRect extends hittable_1.Hittable {\n    constructor(x0, x1, y0, y1, k, material) {\n        super();\n        this._x0 = x0;\n        this._x1 = x1;\n        this._y0 = y0;\n        this._y1 = y1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin[2]) / r.direction[2];\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const x = r.origin[0] + t * r.direction[0];\n        const y = r.origin[1] + t * r.direction[1];\n        if (x < this._x0 || x > this._x1 || y < this._y0 || y > this._y1) {\n            return false;\n        }\n        rec.u = (x - this._x0) / (this._x1 - this._x0);\n        rec.v = (y - this._y0) / (this._y1 - this._y0);\n        rec.t = t;\n        const outwardNormal = [0, 0, 1];\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default([this._x0, this._y0, this._k - 0.0001], [this._x1, this._y1, this._k + 0.0001]);\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nXYRect = __decorate([\n    serializing_1.serializable\n], XYRect);\nexports.XYRect = XYRect;\nlet XZRect = class XZRect extends hittable_1.Hittable {\n    constructor(x0, x1, z0, z1, k, material) {\n        super();\n        this._x0 = x0;\n        this._x1 = x1;\n        this._z0 = z0;\n        this._z1 = z1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin[1]) / r.direction[1];\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const x = r.origin[0] + t * r.direction[0];\n        const z = r.origin[2] + t * r.direction[2];\n        if (x < this._x0 || x > this._x1 || z < this._z0 || z > this._z1) {\n            return false;\n        }\n        rec.u = (x - this._x0) / (this._x1 - this._x0);\n        rec.v = (z - this._z0) / (this._z1 - this._z0);\n        rec.t = t;\n        const outwardNormal = [0, 1, 0];\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default([this._x0, this._k - 0.0001, this._z0], [this._x1, this._k + 0.0001, this._z1]);\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nXZRect = __decorate([\n    serializing_1.serializable\n], XZRect);\nexports.XZRect = XZRect;\nlet YZRect = class YZRect extends hittable_1.Hittable {\n    constructor(y0, y1, z0, z1, k, material) {\n        super();\n        this._y0 = y0;\n        this._y1 = y1;\n        this._z0 = z0;\n        this._z1 = z1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin[0]) / r.direction[0];\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const y = r.origin[1] + t * r.direction[1];\n        const z = r.origin[2] + t * r.direction[2];\n        if (y < this._y0 || y > this._y1 || z < this._z0 || z > this._z1) {\n            return false;\n        }\n        rec.u = (y - this._y0) / (this._y1 - this._y0);\n        rec.v = (z - this._z0) / (this._z1 - this._z0);\n        rec.t = t;\n        const outwardNormal = [1, 0, 0];\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default([this._k - 0.0001, this._y0, this._z0], [this._k + 0.0001, this._y1, this._z1]);\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nYZRect = __decorate([\n    serializing_1.serializable\n], YZRect);\nexports.YZRect = YZRect;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/aarect.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/box.ts":
/*!**********************************!*\
  !*** ./src/raytracer-cpu/box.ts ***!
  \**********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/*! CommonJS bailout: this is used directly at 8:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst aarect_1 = __webpack_require__(/*! ./aarect */ \"./src/raytracer-cpu/aarect.ts\");\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst hittablelist_1 = __webpack_require__(/*! ./hittablelist */ \"./src/raytracer-cpu/hittablelist.ts\");\nlet Box = class Box extends hittable_1.Hittable {\n    constructor(p0, p1, mat) {\n        super();\n        this._sides = new hittablelist_1.HittableList();\n        this._boxMin = p0;\n        this._boxMax = p1;\n        this._sides.add(new aarect_1.XYRect(p0[0], p1[0], p0[1], p1[1], p1[2], mat));\n        this._sides.add(new aarect_1.XYRect(p0[0], p1[0], p0[1], p1[1], p0[2], mat));\n        this._sides.add(new aarect_1.XZRect(p0[0], p1[0], p0[2], p1[2], p1[1], mat));\n        this._sides.add(new aarect_1.XZRect(p0[0], p1[0], p0[2], p1[2], p0[1], mat));\n        this._sides.add(new aarect_1.YZRect(p0[1], p1[1], p0[2], p1[2], p1[0], mat));\n        this._sides.add(new aarect_1.YZRect(p0[1], p1[1], p0[2], p1[2], p0[0], mat));\n    }\n    hit(r, t_min, t_max, rec) {\n        return this._sides.hit(r, t_min, t_max, rec);\n    }\n    boundingBox(t0, t1, outputBox) {\n        const newOutputBox = new aabb_1.default(this._boxMin, this._boxMax);\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nBox = __decorate([\n    serializing_1.serializable\n], Box);\nexports.default = Box;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/box.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/bvhnode.ts":
/*!**************************************!*\
  !*** ./src/raytracer-cpu/bvhnode.ts ***!
  \**************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/*! CommonJS bailout: this is used directly at 8:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar BVHNode_1;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\n//let _id = 0;\nlet BVHNode = BVHNode_1 = class BVHNode extends hittable_1.Hittable {\n    //private id = _id;\n    constructor() {\n        super();\n        this.box = new aabb_1.default();\n        //console.log(`BVH-Node ${this.id}`);\n        //_id++;\n    }\n    static createFromHitableList(list, time0, time1) {\n        const node = new BVHNode_1();\n        node.init(list.objects, 0, list.objects.length, time0, time1);\n        return node;\n    }\n    static createFromObjects(objects, start, end, time0, time1) {\n        const node = new BVHNode_1();\n        node.init(objects, start, end, time0, time1);\n        return node;\n    }\n    init(objects, start, end, time0, time1) {\n        const axis = util_1.randomInt(0, 2);\n        const comparator = axis === 0 ? boxXCompare : axis === 1 ? boxYCompare : boxZCompare;\n        const objectSpan = end - start;\n        if (objectSpan === 1) {\n            this.left = this.right = objects[start];\n        }\n        else if (objectSpan === 2) {\n            if (comparator(objects[start], objects[start + 1]) === -1) {\n                this.left = objects[start];\n                this.right = objects[start + 1];\n            }\n            else {\n                this.left = objects[start + 1];\n                this.right = objects[start];\n            }\n        }\n        else {\n            util_1.sortArrayRange(objects, start, end, comparator);\n            const mid = start + Math.floor(objectSpan / 2);\n            this.left = BVHNode_1.createFromObjects(objects, start, mid, time0, time1);\n            this.right = BVHNode_1.createFromObjects(objects, mid, end, time0, time1);\n        }\n        const boxLeft = new aabb_1.default();\n        const boxRight = new aabb_1.default();\n        if (!this.left.boundingBox(time0, time1, boxLeft) || !this.right.boundingBox(time0, time1, boxRight)) {\n            console.error('No bounding box in bvh_node constructor.');\n        }\n        this.box = aabb_1.default.surroundingBox(boxLeft, boxRight);\n    }\n    // public hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {\n    //   //console.time(`BVH-hit #${this.id}`);\n    //   if (!this.box.hit(r, tMin, tMax)) {\n    //     return false;\n    //     //console.timeEnd(`BVH-hit #${this.id}`);\n    //   }\n    //   const hitLeft = this.left.hit(r, tMin, tMax, rec);\n    //   const hitRight = this.right.hit(r, tMin, hitLeft ? rec.t : tMax, rec);\n    //   //console.timeEnd(`BVH-hit #${this.id}`);\n    //   return hitLeft || hitRight;\n    // }\n    hit(r, tMin, tMax, rec) {\n        if (this.box.hit(r, tMin, tMax)) {\n            if (this.left.hit(r, tMin, tMax, rec)) {\n                this.right.hit(r, tMin, rec.t, rec);\n                return true;\n            }\n            else {\n                return this.right.hit(r, tMin, tMax, rec);\n            }\n        }\n        return false;\n    }\n    boundingBox(t0, t1, outputBox) {\n        this.box.copyTo(outputBox);\n        return true;\n    }\n};\nBVHNode = BVHNode_1 = __decorate([\n    serializing_1.serializable\n], BVHNode);\nexports.default = BVHNode;\nfunction boxCompare(a, b, axis) {\n    const boxA = new aabb_1.default();\n    const boxB = new aabb_1.default();\n    if (!a.boundingBox(0, 0, boxA) || !b.boundingBox(0, 0, boxB)) {\n        console.error('No bounding box in bvh_node constructor.');\n    }\n    return boxA.min[axis] < boxB.min[axis] ? -1 : 1;\n}\nfunction boxXCompare(a, b) {\n    return boxCompare(a, b, 0);\n}\nfunction boxYCompare(a, b) {\n    return boxCompare(a, b, 1);\n}\nfunction boxZCompare(a, b) {\n    return boxCompare(a, b, 2);\n}\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/bvhnode.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/constantmedium.ts":
/*!*********************************************!*\
  !*** ./src/raytracer-cpu/constantmedium.ts ***!
  \*********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ConstantMedium = void 0;\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst isotropic_1 = __webpack_require__(/*! ./isotropic */ \"./src/raytracer-cpu/isotropic.ts\");\nlet ConstantMedium = class ConstantMedium extends hittable_1.Hittable {\n    constructor(boundary, density, material) {\n        super();\n        this._boundary = boundary;\n        this._negInvDensity = -1 / density;\n        this._phaseFunction = new isotropic_1.IsoTropic(material);\n    }\n    hit(r, t_min, t_max, rec) {\n        const enableDebug = false;\n        const debugging = enableDebug && util_1.randomNumber() < 0.00001;\n        const rec1 = new hittable_1.HitRecord();\n        const rec2 = new hittable_1.HitRecord();\n        if (!this._boundary.hit(r, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, rec1)) {\n            return false;\n        }\n        if (!this._boundary.hit(r, rec1.t + 0.0001, Number.POSITIVE_INFINITY, rec2)) {\n            return false;\n        }\n        if (debugging) {\n            console.log(`t0=${rec1.t}, t1=${rec2.t}`);\n        }\n        if (rec1.t < t_min) {\n            rec1.t = t_min;\n        }\n        if (rec2.t > t_max) {\n            rec2.t = t_max;\n        }\n        if (rec1.t >= rec2.t) {\n            return false;\n        }\n        if (rec1.t < 0) {\n            rec1.t = 0;\n        }\n        const rayLength = Vector.length(r.direction);\n        const distanceInsideBoundary = (rec2.t - rec1.t) * rayLength;\n        const hitDistance = this._negInvDensity * Math.log(util_1.randomNumber());\n        if (hitDistance > distanceInsideBoundary) {\n            return false;\n        }\n        rec.t = rec1.t + hitDistance / rayLength;\n        rec.p = r.at(rec.t);\n        if (debugging) {\n            console.log(`hitDistance = ${hitDistance}\\n\n                   rec.t = ${rec.t}\\n\n                   rec.p = ${rec.p}\n      `);\n        }\n        rec.normal = [1, 0, 0]; // arbitrary\n        rec.frontFace = true; // also arbitrary\n        rec.mat = this._phaseFunction;\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        return this._boundary.boundingBox(t0, t1, outputBox);\n    }\n};\nConstantMedium = __decorate([\n    serializing_1.serializable\n], ConstantMedium);\nexports.ConstantMedium = ConstantMedium;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/constantmedium.ts?");

/***/ }),

/***/ "./node_modules/ts-loader/index.js!./src/raytracer-cpu/controller.worker.ts":
/*!**********************************************************************************!*\
  !*** ./node_modules/ts-loader/index.js!./src/raytracer-cpu/controller.worker.ts ***!
  \**********************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst compute_worker_1 = __importDefault(__webpack_require__(/*! worker-loader!./compute.worker */ \"./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts\"));\nconst camera_1 = __webpack_require__(/*! ../camera */ \"./src/camera.ts\");\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst deserializermap_1 = __webpack_require__(/*! ./deserializermap */ \"./src/raytracer-cpu/deserializermap.ts\");\nconst hittablelist_1 = __webpack_require__(/*! ./hittablelist */ \"./src/raytracer-cpu/hittablelist.ts\");\nconst workerinterfaces_1 = __webpack_require__(/*! ./workerinterfaces */ \"./src/raytracer-cpu/workerinterfaces.ts\");\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst map = deserializermap_1.DeserializerMap;\nconst _controllerCtx = self;\nlet _array;\nlet _imageWidth;\nlet _imageHeight;\nlet _samplesPerPixel;\nlet _maxBounces;\nconst _computeWorkers = new Map();\nconst start = async (msg) => {\n    _imageWidth = msg.data.imageWidth;\n    _imageHeight = msg.data.imageHeight;\n    _samplesPerPixel = msg.data.samplesPerPixel;\n    _maxBounces = msg.data.maxBounces;\n    _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);\n    const world = serializing_1.deserialize(hittablelist_1.HittableList, msg.data.world);\n    const camera = serializing_1.deserialize(camera_1.Camera, msg.data.camera);\n    let startLine = msg.data.imageHeight - 1;\n    let availableLines = msg.data.imageHeight;\n    const lineLoad = Math.ceil(availableLines / msg.data.computeWorkers);\n    for (let workerId = 0; workerId < msg.data.computeWorkers; workerId++) {\n        const computeWorker = new compute_worker_1.default();\n        computeWorker.onmessage = onMessageFromComputeWorker;\n        const computeStartMessage = {\n            cmd: workerinterfaces_1.ComputeCommands.START,\n            data: {\n                workerId,\n                camera: serializing_1.serialize(camera_1.Camera, camera),\n                world: serializing_1.serialize(hittablelist_1.HittableList, world),\n                background: msg.data.background,\n                imageWidth: msg.data.imageWidth,\n                imageHeight: msg.data.imageHeight,\n                scanlineCount: availableLines - lineLoad < 0 ? availableLines : lineLoad,\n                startLine: startLine,\n                samplesPerPixel: _samplesPerPixel,\n                maxBounces: _maxBounces,\n            },\n        };\n        computeWorker.postMessage(computeStartMessage);\n        _computeWorkers.set(workerId, computeWorker);\n        availableLines -= lineLoad;\n        startLine -= lineLoad;\n    }\n};\nconst stop = () => {\n    console.log('controller stop');\n    // stop the compute workers\n    for (const [id, computeWorker] of _computeWorkers) {\n        computeWorker.terminate();\n        _computeWorkers.delete(id);\n    }\n    const controllerEndMessage = {\n        cmd: workerinterfaces_1.ControllerCommands.END,\n        data: {\n            imageArray: _array,\n        },\n    };\n    _controllerCtx.postMessage(controllerEndMessage);\n};\nconst workerIsDone = (msg) => {\n    const id = msg.data.workerId;\n    const workerArray = msg.data.pixelArray;\n    const scanlineCount = msg.data.scanlineCount;\n    const startLine = msg.data.startLine;\n    //\n    //let imageOffset = (startLine + 1 - scanlineCount) * _imageWidth * 3;\n    let imageOffset = (_imageHeight - (startLine + 1)) * _imageWidth * 3;\n    let dataOffset = 0;\n    //const endLine = startLine + scanlineCount;\n    // if (id === 0) {\n    for (let j = 0; j < scanlineCount; j++) {\n        for (let i = 0; i < _imageWidth; i++) {\n            _array[imageOffset++] = workerArray[dataOffset++];\n            _array[imageOffset++] = workerArray[dataOffset++];\n            _array[imageOffset++] = workerArray[dataOffset++];\n        }\n    }\n    // }\n    _computeWorkers.get(id).terminate();\n    _computeWorkers.delete(id);\n    if (_computeWorkers.size === 0) {\n        const controllerEndMessage = {\n            cmd: workerinterfaces_1.ControllerCommands.END,\n            data: {\n                imageArray: _array,\n            },\n        };\n        _controllerCtx.postMessage(controllerEndMessage);\n    }\n};\nconst onMessageFromComputeWorker = (event) => {\n    const msg = event.data;\n    switch (msg.cmd) {\n        case workerinterfaces_1.ComputeCommands.END:\n            workerIsDone(msg);\n            break;\n        default:\n            break;\n    }\n};\n// Respond to message from parent thread\n_controllerCtx.addEventListener('message', (event) => {\n    const msg = event.data;\n    switch (msg.cmd) {\n        case workerinterfaces_1.ControllerCommands.START:\n            start(msg);\n            break;\n        case workerinterfaces_1.ControllerCommands.STOP:\n            stop();\n            break;\n        default:\n            break;\n    }\n});\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/controller.worker.ts?./node_modules/ts-loader/index.js");

/***/ }),

/***/ "./src/raytracer-cpu/deserializermap.ts":
/*!**********************************************!*\
  !*** ./src/raytracer-cpu/deserializermap.ts ***!
  \**********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DeserializerMap = void 0;\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst aarect_1 = __webpack_require__(/*! ./aarect */ \"./src/raytracer-cpu/aarect.ts\");\nconst box_1 = __importDefault(__webpack_require__(/*! ./box */ \"./src/raytracer-cpu/box.ts\"));\nconst bvhnode_1 = __importDefault(__webpack_require__(/*! ./bvhnode */ \"./src/raytracer-cpu/bvhnode.ts\"));\nconst constantmedium_1 = __webpack_require__(/*! ./constantmedium */ \"./src/raytracer-cpu/constantmedium.ts\");\nconst dielectric_1 = __importDefault(__webpack_require__(/*! ./dielectric */ \"./src/raytracer-cpu/dielectric.ts\"));\nconst diffuselight_1 = __importDefault(__webpack_require__(/*! ./diffuselight */ \"./src/raytracer-cpu/diffuselight.ts\"));\nconst isotropic_1 = __webpack_require__(/*! ./isotropic */ \"./src/raytracer-cpu/isotropic.ts\");\nconst lambertian_1 = __importDefault(__webpack_require__(/*! ./lambertian */ \"./src/raytracer-cpu/lambertian.ts\"));\nconst metal_1 = __importDefault(__webpack_require__(/*! ./metal */ \"./src/raytracer-cpu/metal.ts\"));\nconst movingsphere_1 = __importDefault(__webpack_require__(/*! ./movingsphere */ \"./src/raytracer-cpu/movingsphere.ts\"));\nconst perlin_1 = __importDefault(__webpack_require__(/*! ./perlin */ \"./src/raytracer-cpu/perlin.ts\"));\nconst rotation_1 = __webpack_require__(/*! ./rotation */ \"./src/raytracer-cpu/rotation.ts\");\nconst sphere_1 = __webpack_require__(/*! ./sphere */ \"./src/raytracer-cpu/sphere.ts\");\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nconst translate_1 = __importDefault(__webpack_require__(/*! ./translate */ \"./src/raytracer-cpu/translate.ts\"));\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nexports.DeserializerMap = {\n    lambertianMaterial: lambertian_1.default,\n    metalMaterial: metal_1.default,\n    dielectricMaterial: dielectric_1.default,\n    sphere: sphere_1.Sphere,\n    movingSphere: movingsphere_1.default,\n    bvhNode: bvhnode_1.default,\n    aabb: aabb_1.default,\n    checkerTexture: texture_1.CheckerTexture,\n    solidTexture: texture_1.SolidColor,\n    perlin: perlin_1.default,\n    noise: texture_1.NoiseTexture,\n    image: texture_1.ImageTexture,\n    diffuseLight: diffuselight_1.default,\n    xyRect: aarect_1.XYRect,\n    xzRect: aarect_1.XZRect,\n    yzRect: aarect_1.YZRect,\n    box: box_1.default,\n    translate: translate_1.default,\n    rotateY: rotation_1.RotateY,\n    constantMedium: constantmedium_1.ConstantMedium,\n    isoTropic: isotropic_1.IsoTropic,\n};\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/deserializermap.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/dielectric.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/dielectric.ts ***!
  \*****************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet DielectricMaterial = class DielectricMaterial extends material_1.default {\n    constructor(refIdx) {\n        super();\n        this._indexOfRefraction = refIdx;\n    }\n    get indexOfRefraction() {\n        return this._indexOfRefraction;\n    }\n    schlick(cosine, refIdx) {\n        let r0 = (1 - refIdx) / (1 + refIdx);\n        r0 = r0 * r0;\n        return r0 + (1 - r0) * Math.pow(1 - cosine, 5);\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        Vector.set(attenuation, 1.0, 1.0, 1.0);\n        const etai_over_etat = rec.frontFace ? 1 / this._indexOfRefraction : this._indexOfRefraction;\n        const unit_direction = Vector.unitVector(r_in.direction);\n        const cos_theta = Math.min(Vector.dot(Vector.negate(unit_direction), rec.normal), 1);\n        const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);\n        if (etai_over_etat * sin_theta > 1) {\n            const reflected = Vector.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const reflect_prob = this.schlick(cos_theta, etai_over_etat);\n        if (util_1.randomNumber() < reflect_prob) {\n            const reflected = Vector.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const refracted = Vector.refract(unit_direction, rec.normal, etai_over_etat);\n        new ray_1.default(rec.p, refracted, r_in.time).copyTo(scattered);\n        return true;\n    }\n};\nDielectricMaterial = __decorate([\n    serializing_1.serializable\n], DielectricMaterial);\nexports.default = DielectricMaterial;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/dielectric.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/diffuselight.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/diffuselight.ts ***!
  \*******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/*! CommonJS bailout: this is used directly at 8:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet DiffuseLight = class DiffuseLight extends material_1.default {\n    constructor(color) {\n        super();\n        if (color) {\n            this._emit = new texture_1.SolidColor(color);\n        }\n    }\n    scatter(_r_in, _rec, _attenuation, _scattered) {\n        return false;\n    }\n    emitted(u, v, p) {\n        return this._emit.value(u, v, p);\n    }\n};\nDiffuseLight = __decorate([\n    serializing_1.serializable\n], DiffuseLight);\nexports.default = DiffuseLight;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/diffuselight.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittable.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/hittable.ts ***!
  \***************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:20-24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Hittable = exports.HitRecord = void 0;\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nclass HitRecord {\n    constructor() {\n        this.p = [0, 0, 0];\n        this.normal = [0, 0, 0];\n        this.t = 0;\n        this.u = 0;\n        this.v = 0;\n        this.frontFace = true;\n    }\n    setFaceNormal(r, outward_normal) {\n        this.frontFace = Vector.dot(r.direction, outward_normal) < 0;\n        this.normal = this.frontFace ? outward_normal : Vector.negate(outward_normal);\n    }\n    copyTo(dest) {\n        dest.p = this.p;\n        dest.normal = this.normal;\n        dest.t = this.t;\n        dest.u = this.u;\n        dest.v = this.v;\n        dest.frontFace = this.frontFace;\n        dest.mat = this.mat;\n    }\n}\nexports.HitRecord = HitRecord;\nclass Hittable {\n    get material() {\n        return undefined;\n    }\n}\nexports.Hittable = Hittable;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/hittable.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittablelist.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/hittablelist.ts ***!
  \*******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:18-22 */
/*! CommonJS bailout: this is used directly at 8:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HittableList = void 0;\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nlet HittableList = class HittableList extends hittable_1.Hittable {\n    constructor(object) {\n        super();\n        this._objects = [];\n        if (object) {\n            this.add(object);\n        }\n    }\n    get objects() {\n        return this._objects;\n    }\n    clear() {\n        this._objects.length = 0;\n    }\n    add(object) {\n        this._objects.push(object);\n    }\n    hit(r, t_min, t_max, rec) {\n        const temp_rec = new hittable_1.HitRecord();\n        let hit_anything = false;\n        let closest_so_far = t_max;\n        for (const object of this._objects) {\n            if (object.hit(r, t_min, closest_so_far, temp_rec)) {\n                hit_anything = true;\n                closest_so_far = temp_rec.t;\n                temp_rec.copyTo(rec);\n            }\n        }\n        return hit_anything;\n    }\n    boundingBox(t0, t1, outputBox) {\n        if (this._objects.length === 0) {\n            return false;\n        }\n        const tempBox = new aabb_1.default();\n        let firstBox = true;\n        for (const object of this._objects) {\n            if (!object.boundingBox(t0, t1, tempBox)) {\n                return false;\n            }\n            if (firstBox) {\n                tempBox.copyTo(outputBox);\n            }\n            else {\n                aabb_1.default.surroundingBox(outputBox, tempBox).copyTo(outputBox);\n            }\n            firstBox = false;\n        }\n        return true;\n    }\n};\nHittableList = __decorate([\n    serializing_1.serializable\n], HittableList);\nexports.HittableList = HittableList;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/hittablelist.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/isotropic.ts":
/*!****************************************!*\
  !*** ./src/raytracer-cpu/isotropic.ts ***!
  \****************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.IsoTropic = void 0;\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet IsoTropic = class IsoTropic extends material_1.default {\n    constructor(albedo) {\n        super();\n        if (Vector.isVec3(albedo)) {\n            this._albedo = new texture_1.SolidColor(albedo);\n        }\n        else {\n            this._albedo = albedo;\n        }\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        new ray_1.default(rec.p, Vector.randomInUnitSphere(), r_in.time).copyTo(scattered);\n        Vector.copyTo(this._albedo.value(rec.u, rec.v, rec.p), attenuation);\n        return true;\n    }\n};\nIsoTropic = __decorate([\n    serializing_1.serializable\n], IsoTropic);\nexports.IsoTropic = IsoTropic;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/isotropic.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/lambertian.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/lambertian.ts ***!
  \*****************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet LambertianMaterial = class LambertianMaterial extends material_1.default {\n    constructor(color) {\n        super();\n        if (color) {\n            this._albedo = new texture_1.SolidColor(color);\n        }\n    }\n    set texture(texture) {\n        this._albedo = texture;\n    }\n    get texture() {\n        return this._albedo;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());\n        new ray_1.default(rec.p, scatter_direction, r_in.time).copyTo(scattered);\n        const col = this._albedo.value(rec.u, rec.v, rec.p);\n        Vector.copyTo(col, attenuation);\n        return true;\n    }\n};\nLambertianMaterial = __decorate([\n    serializing_1.serializable\n], LambertianMaterial);\nexports.default = LambertianMaterial;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/lambertian.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/material.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/material.ts ***!
  \***************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Material {\n    emitted(_u, _v, _p) {\n        return [0, 0, 0];\n    }\n    get texture() {\n        return undefined;\n    }\n}\nexports.default = Material;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/material.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/metal.ts":
/*!************************************!*\
  !*** ./src/raytracer-cpu/metal.ts ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nlet MetalMaterial = class MetalMaterial extends material_1.default {\n    constructor(color, roughness) {\n        super();\n        this._baseColor = color;\n        this._roughness = roughness;\n    }\n    get baseColor() {\n        return this._baseColor;\n    }\n    get roughness() {\n        return this._roughness;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const reflect = Vector.reflect(Vector.unitVector(r_in.direction), rec.normal);\n        new ray_1.default(rec.p, Vector.addVec3(reflect, Vector.multScalarVec3(Vector.randomInUnitSphere(), this._roughness)), r_in.time).copyTo(scattered);\n        Vector.copyTo(this._baseColor, attenuation);\n        return Vector.dot(scattered.direction, rec.normal) > 0;\n    }\n};\nMetalMaterial = __decorate([\n    serializing_1.serializable\n], MetalMaterial);\nexports.default = MetalMaterial;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/metal.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/movingsphere.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/movingsphere.ts ***!
  \*******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nlet MovingSphere = class MovingSphere extends hittable_1.Hittable {\n    constructor(center0, center1, t0, t1, radius, mat) {\n        super();\n        this._center0 = center0;\n        this._center1 = center1;\n        this._time0 = t0;\n        this._time1 = t1;\n        this._radius = radius;\n        this._material = mat;\n    }\n    hit(r, t_min, t_max, rec) {\n        const oc = Vector.subVec3(r.origin, this.center(r.time));\n        const a = Vector.lengthSquared(r.direction);\n        const half_b = Vector.dot(oc, r.direction);\n        const c = Vector.lengthSquared(oc) - this._radius * this._radius;\n        const discriminat = half_b * half_b - a * c;\n        if (discriminat > 0) {\n            const root = Math.sqrt(discriminat);\n            let temp = (-half_b - root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this.center(r.time)), this._radius);\n                rec.setFaceNormal(r, outward_normal);\n                rec.mat = this._material;\n                return true;\n            }\n            temp = (-half_b + root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this.center(r.time)), this._radius);\n                rec.setFaceNormal(r, outward_normal);\n                rec.mat = this._material;\n                return true;\n            }\n        }\n        return false;\n    }\n    center(time) {\n        const timeDiff = (time - this._time0) / (this._time1 - this._time0);\n        const centerDiff = Vector.subVec3(this._center1, this._center0);\n        return Vector.addVec3(this._center0, Vector.multScalarVec3(centerDiff, timeDiff));\n    }\n    boundingBox(t0, t1, outputBox) {\n        const box0 = new aabb_1.default(Vector.subVec3(this.center(t0), [this._radius, this._radius, this._radius]), Vector.addVec3(this.center(t0), [this._radius, this._radius, this._radius]));\n        const box1 = new aabb_1.default(Vector.subVec3(this.center(t1), [this._radius, this._radius, this._radius]), Vector.addVec3(this.center(t1), [this._radius, this._radius, this._radius]));\n        const newOutputBox = aabb_1.default.surroundingBox(box0, box1);\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nMovingSphere = __decorate([\n    serializing_1.serializable\n], MovingSphere);\nexports.default = MovingSphere;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/movingsphere.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/perlin.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/perlin.ts ***!
  \*************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar Perlin_1;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nlet Perlin = Perlin_1 = class Perlin {\n    constructor() {\n        this._ranVecs = new Array(Perlin_1._pointCount);\n        for (let i = 0; i < Perlin_1._pointCount; i++) {\n            this._ranVecs[i] = Vector.unitVector(Vector.randomRange(-1, 1));\n        }\n        this._permX = Perlin_1.perlinGeneratePerm();\n        this._permY = Perlin_1.perlinGeneratePerm();\n        this._permZ = Perlin_1.perlinGeneratePerm();\n    }\n    noise(p) {\n        let u = p[0] - Math.floor(p[0]);\n        let v = p[1] - Math.floor(p[1]);\n        let w = p[2] - Math.floor(p[2]);\n        // const i = Math.trunc(4 * p.x) & 255;\n        // const j = Math.trunc(4 * p.y) & 255;\n        // const k = Math.trunc(4 * p.z) & 255;\n        u = u * u * (3 - 2 * u);\n        v = v * v * (3 - 2 * v);\n        w = w * w * (3 - 2 * w);\n        const i = Math.floor(p[0]);\n        const j = Math.floor(p[1]);\n        const k = Math.floor(p[2]);\n        const c = [\n            [[], []],\n            [[], []],\n        ];\n        for (let di = 0; di < 2; di++)\n            for (let dj = 0; dj < 2; dj++)\n                for (let dk = 0; dk < 2; dk++)\n                    c[di][dj][dk] = this._ranVecs[this._permX[(i + di) & 255] ^ this._permY[(j + dj) & 255] ^ this._permZ[(k + dk) & 255]];\n        // const noise = this._ranFloat[this._permX[i] ^ this._permY[j] ^ this._permZ[k]];\n        const noise = trilinearInterp(c, u, v, w);\n        return noise;\n    }\n    turb(p, depth = 7) {\n        let accum = 0.0;\n        let temp_p = p;\n        let weight = 1.0;\n        for (let i = 0; i < depth; i++) {\n            accum += weight * this.noise(temp_p);\n            weight *= 0.5;\n            temp_p = Vector.multScalarVec3(temp_p, 2);\n        }\n        return Math.abs(accum);\n    }\n    static perlinGeneratePerm() {\n        const array = new Array(Perlin_1._pointCount);\n        for (let i = 0; i < Perlin_1._pointCount; i++) {\n            array[i] = i;\n        }\n        Perlin_1.permute(array, Perlin_1._pointCount);\n        return array;\n    }\n    static permute(array, n) {\n        for (let i = n - 1; i > 0; i--) {\n            const target = util_1.randomInt(0, i);\n            const tmp = array[i];\n            array[i] = array[target];\n            array[target] = tmp;\n        }\n    }\n};\nPerlin._pointCount = 256;\nPerlin = Perlin_1 = __decorate([\n    serializing_1.serializable\n], Perlin);\nexports.default = Perlin;\nfunction trilinearInterp(c, u, v, w) {\n    const uu = u * u * (3 - 2 * u);\n    const vv = v * v * (3 - 2 * v);\n    const ww = w * w * (3 - 2 * w);\n    let accum = 0.0;\n    for (let i = 0; i < 2; i++) {\n        for (let j = 0; j < 2; j++) {\n            for (let k = 0; k < 2; k++) {\n                const weight = [u - i, v - j, w - k];\n                // prettier-ignore\n                accum += (i * uu + (1 - i) * (1 - uu))\n                    * (j * vv + (1 - j) * (1 - vv))\n                    * (k * ww + (1 - k) * (1 - ww))\n                    * Vector.dot(c[i][j][k], weight);\n            }\n        }\n    }\n    return accum;\n}\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/perlin.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/ray.ts":
/*!**********************************!*\
  !*** ./src/raytracer-cpu/ray.ts ***!
  \**********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:20-24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.rayColor = void 0;\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nclass Ray {\n    constructor(origin, direction, time = 0.0) {\n        if (origin) {\n            this._orig = origin;\n        }\n        if (direction) {\n            this._dir = direction;\n        }\n        this._time = time;\n    }\n    copyTo(dest) {\n        dest._orig = this._orig;\n        dest._dir = this._dir;\n        dest._time = this._time;\n    }\n    get origin() {\n        return this._orig;\n    }\n    set origin(origin) {\n        this._orig = origin;\n    }\n    get direction() {\n        return this._dir;\n    }\n    set direction(direction) {\n        this._dir = direction;\n    }\n    get time() {\n        return this._time;\n    }\n    at(t) {\n        return Vector.addVec3(this._orig, Vector.multScalarVec3(this._dir, t));\n    }\n}\nexports.default = Ray;\nfunction rayColor(r, background, world, depth) {\n    const rec = new hittable_1.HitRecord();\n    // If we've exceeded the ray bounce limit, no more light is gathered.\n    if (depth <= 0) {\n        return [0, 0, 0];\n    }\n    // If the ray hits nothing, return the background color.\n    if (!world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {\n        return background;\n    }\n    const scattered = new Ray();\n    const attenuation = [0, 0, 0];\n    const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);\n    if (!rec.mat.scatter(r, rec, attenuation, scattered)) {\n        return emitted;\n    }\n    return Vector.addVec3(emitted, Vector.multVec3(attenuation, rayColor(scattered, background, world, depth - 1)));\n    /*\n    const unit_direction = Vec3.unitVector(r.direction);\n    const t = 0.5 * (unit_direction.y + 1);\n    const color1 = Vec3.multScalarVec3(new Vec3(1, 1, 1), 1 - t);\n    const color2 = Vec3.multScalarVec3(new Vec3(0.5, 0.7, 1.0), t);\n  \n    return Vec3.addVec3(color1, color2);\n    */\n}\nexports.rayColor = rayColor;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/ray.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/rotation.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/rotation.ts ***!
  \***************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RotateY = void 0;\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nlet RotateY = class RotateY extends hittable_1.Hittable {\n    constructor(p, angle) {\n        super();\n        this._bbBox = new aabb_1.default();\n        this._p = p;\n        const radians = util_1.degreeToRadians(angle);\n        this._sinTheta = Math.sin(radians);\n        this._cosTheta = Math.cos(radians);\n        this._hasBox = this._p.boundingBox(0, 1, this._bbBox);\n        const min = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];\n        const max = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];\n        for (let i = 0; i < 2; i++) {\n            for (let j = 0; j < 2; j++) {\n                for (let k = 0; k < 2; k++) {\n                    const x = i * this._bbBox.max[0] + (1 - i) * this._bbBox.min[0];\n                    const y = j * this._bbBox.max[0] + (1 - j) * this._bbBox.min[0];\n                    const z = k * this._bbBox.max[2] + (1 - k) * this._bbBox.min[2];\n                    const newx = this._cosTheta * x + this._sinTheta * z;\n                    const newz = -this._sinTheta * x + this._cosTheta * z;\n                    const tester = [newx, y, newz];\n                    min[0] = Math.min(min[0], tester[0]);\n                    max[0] = Math.max(max[0], tester[0]);\n                    min[1] = Math.min(min[1], tester[1]);\n                    max[1] = Math.max(max[1], tester[1]);\n                    min[2] = Math.min(min[2], tester[2]);\n                    max[2] = Math.max(max[2], tester[2]);\n                }\n            }\n        }\n        this._bbBox = new aabb_1.default(min, max);\n    }\n    hit(r, t_min, t_max, rec) {\n        const origin = Vector.clone(r.origin);\n        const direction = Vector.clone(r.direction);\n        origin[0] = this._cosTheta * r.origin[0] - this._sinTheta * r.origin[2];\n        origin[2] = this._sinTheta * r.origin[0] + this._cosTheta * r.origin[2];\n        direction[0] = this._cosTheta * r.direction[0] - this._sinTheta * r.direction[2];\n        direction[2] = this._sinTheta * r.direction[0] + this._cosTheta * r.direction[2];\n        const rotatedRay = new ray_1.default(origin, direction, r.time);\n        if (!this._p.hit(rotatedRay, t_min, t_max, rec)) {\n            return false;\n        }\n        const p = rec.p;\n        const normal = rec.normal;\n        p[0] = this._cosTheta * rec.p[0] + this._sinTheta * rec.p[2];\n        p[2] = -this._sinTheta * rec.p[0] + this._cosTheta * rec.p[2];\n        normal[0] = this._cosTheta * rec.normal[0] + this._sinTheta * rec.normal[2];\n        normal[2] = -this._sinTheta * rec.normal[0] + this._cosTheta * rec.normal[2];\n        rec.p = p;\n        rec.setFaceNormal(rotatedRay, normal);\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        this._bbBox.copyTo(outputBox);\n        return this._hasBox;\n    }\n};\nRotateY = __decorate([\n    serializing_1.serializable\n], RotateY);\nexports.RotateY = RotateY;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/rotation.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/sphere.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/sphere.ts ***!
  \*************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Sphere = void 0;\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nfunction getSphereUV(p) {\n    const phi = Math.atan2(p[2], p[0]);\n    const theta = Math.asin(p[1]);\n    const u = 1 - (phi + Math.PI) / (2 * Math.PI);\n    const v = (theta + Math.PI / 2) / Math.PI;\n    return { u, v };\n}\nlet Sphere = class Sphere extends hittable_1.Hittable {\n    constructor(center, radius, mat) {\n        super();\n        this._center = center;\n        this._radius = radius;\n        this._material = mat;\n    }\n    get material() {\n        return this._material;\n    }\n    get center() {\n        return this._center;\n    }\n    get radius() {\n        return this._radius;\n    }\n    hit(r, t_min, t_max, rec) {\n        const oc = Vector.subVec3(r.origin, this._center);\n        const a = Vector.lengthSquared(r.direction);\n        const half_b = Vector.dot(oc, r.direction);\n        const c = Vector.lengthSquared(oc) - this._radius * this._radius;\n        const discriminat = half_b * half_b - a * c;\n        if (discriminat > 0) {\n            const root = Math.sqrt(discriminat);\n            let temp = (-half_b - root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);\n                rec.setFaceNormal(r, outward_normal);\n                const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this._material;\n                return true;\n            }\n            temp = (-half_b + root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius);\n                rec.setFaceNormal(r, outward_normal);\n                const uv = getSphereUV(Vector.divScalarVec(Vector.subVec3(rec.p, this._center), this._radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this._material;\n                return true;\n            }\n        }\n        return false;\n    }\n    boundingBox(t0, t1, outputBox) {\n        const newOutputBox = new aabb_1.default(Vector.subVec3(this._center, [this._radius, this._radius, this._radius]), Vector.addVec3(this._center, [this._radius, this._radius, this._radius]));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nSphere = __decorate([\n    serializing_1.serializable\n], Sphere);\nexports.Sphere = Sphere;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/sphere.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/texture.ts":
/*!**************************************!*\
  !*** ./src/raytracer-cpu/texture.ts ***!
  \**************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar ImageTexture_1;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ImageTexture = exports.NoiseTexture = exports.CheckerTexture = exports.SolidColor = exports.Texture = void 0;\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst perlin_1 = __importDefault(__webpack_require__(/*! ./perlin */ \"./src/raytracer-cpu/perlin.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nclass Texture {\n}\nexports.Texture = Texture;\nlet SolidColor = class SolidColor extends Texture {\n    constructor(color) {\n        super();\n        this._color = color;\n    }\n    value(_u, _v, _p) {\n        return this._color;\n    }\n    get color() {\n        return this._color;\n    }\n};\nSolidColor = __decorate([\n    serializing_1.serializable\n], SolidColor);\nexports.SolidColor = SolidColor;\nlet CheckerTexture = class CheckerTexture extends Texture {\n    constructor(odd, even) {\n        super();\n        this._odd = new SolidColor(odd);\n        this._even = new SolidColor(even);\n    }\n    value(u, v, p) {\n        const sines = Math.sin(10 * p[0]) * Math.sin(10 * p[1]) * Math.sin(10 * p[2]);\n        if (sines < 0) {\n            return this._odd.value(u, v, p);\n        }\n        else {\n            return this._even.value(u, v, p);\n        }\n    }\n    get odd() {\n        return this._odd.color;\n    }\n    get even() {\n        return this._even.color;\n    }\n};\nCheckerTexture = __decorate([\n    serializing_1.serializable\n], CheckerTexture);\nexports.CheckerTexture = CheckerTexture;\nlet NoiseTexture = class NoiseTexture extends Texture {\n    constructor(scale) {\n        super();\n        this._noise = new perlin_1.default();\n        this._scale = scale;\n    }\n    get scale() {\n        return this._scale;\n    }\n    value(u, v, p) {\n        // return Vec3.multScalarVec3(\n        //   Vec3.multScalarVec3(new Vec3(1, 1, 1), 0.5),\n        //   1.0 + this._noise.noise(Vec3.multScalarVec3(p, this._scale))\n        // );\n        //return Vec3.multScalarVec3(new Vec3(1, 1, 1), this._noise.turb(Vec3.multScalarVec3(p, this._scale)));\n        return Vector.multScalarVec3(Vector.multScalarVec3([1, 1, 1], 0.5), 1.0 + Math.sin(this._scale * p[2] + 10 * this._noise.turb(p)));\n    }\n};\nNoiseTexture = __decorate([\n    serializing_1.serializable\n], NoiseTexture);\nexports.NoiseTexture = NoiseTexture;\nlet ImageTexture = ImageTexture_1 = class ImageTexture extends Texture {\n    constructor() {\n        super();\n        this._width = 0;\n        this._height = 0;\n        this._bytesPerScanLine = 0;\n    }\n    async load(imageUrl) {\n        const response = await fetch(imageUrl);\n        const blob = await response.blob();\n        const imgBitmap = await window.createImageBitmap(blob);\n        // Firefox do not support 2D context on OffscreenCanvas :-(\n        //const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);\n        const canvas = document.createElement('canvas');\n        canvas.width = imgBitmap.width;\n        canvas.height = imgBitmap.height;\n        const ctx = canvas.getContext('2d');\n        ctx.drawImage(imgBitmap, 0, 0);\n        const imgData = ctx.getImageData(0, 0, imgBitmap.width, imgBitmap.height);\n        this._width = imgData.width;\n        this._height = imgData.height;\n        this._data = imgData.data;\n        this._bytesPerScanLine = ImageTexture_1.BytesPerPixel * this._width;\n    }\n    value(u, v, _p) {\n        // If we have no texture data, then return solid cyan as a debugging aid.\n        if (!this._data || this._data.length === 0) {\n            return [0, 1, 1];\n        }\n        // Clamp input texture coordinates to [0,1] x [1,0]\n        u = util_1.clamp(u, 0.0, 1.0);\n        v = 1.0 - util_1.clamp(v, 0.0, 1.0); // Flip V to image coordinates\n        let i = Math.trunc(u * this._width);\n        let j = Math.trunc(v * this._height);\n        // Clamp integer mapping, since actual coordinates should be less than 1.0\n        if (i >= this._width)\n            i = this._width - 1;\n        if (j >= this._height)\n            j = this._height - 1;\n        const colorScale = 1.0 / 255.0;\n        let pixelOffset = j * this._bytesPerScanLine + i * ImageTexture_1.BytesPerPixel;\n        return [\n            this._data[pixelOffset++] * colorScale,\n            this._data[pixelOffset++] * colorScale,\n            this._data[pixelOffset++] * colorScale,\n        ];\n    }\n};\nImageTexture.BytesPerPixel = 4;\nImageTexture = ImageTexture_1 = __decorate([\n    serializing_1.serializable\n], ImageTexture);\nexports.ImageTexture = ImageTexture;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/texture.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/translate.ts":
/*!****************************************!*\
  !*** ./src/raytracer-cpu/translate.ts ***!
  \****************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:26-30 */
/*! CommonJS bailout: this is used directly at 14:18-22 */
/*! CommonJS bailout: this is used directly at 20:20-24 */
/*! CommonJS bailout: this is used directly at 27:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst Vector = __importStar(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nlet Translate = class Translate extends hittable_1.Hittable {\n    constructor(p, offset) {\n        super();\n        this._p = p;\n        this._offset = offset;\n    }\n    hit(r, t_min, t_max, rec) {\n        const movedRay = new ray_1.default(Vector.subVec3(r.origin, this._offset), r.direction, r.time);\n        if (!this._p.hit(movedRay, t_min, t_max, rec)) {\n            return false;\n        }\n        rec.p = Vector.addVec3(rec.p, this._offset);\n        rec.setFaceNormal(movedRay, rec.normal);\n        return true;\n    }\n    boundingBox(t0, t1, outputBox) {\n        if (!this._p.boundingBox(t0, t1, outputBox)) {\n            return false;\n        }\n        const newOutputBox = new aabb_1.default(Vector.addVec3(outputBox.min, this._offset), Vector.addVec3(outputBox.max, this._offset));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nTranslate = __decorate([\n    serializing_1.serializable\n], Translate);\nexports.default = Translate;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/translate.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/workerinterfaces.ts":
/*!***********************************************!*\
  !*** ./src/raytracer-cpu/workerinterfaces.ts ***!
  \***********************************************/
/*! flagged exports */
/*! export ComputeCommands [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ControllerCommands [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ComputeCommands = exports.ControllerCommands = void 0;\nvar ControllerCommands;\n(function (ControllerCommands) {\n    ControllerCommands[ControllerCommands[\"START\"] = 0] = \"START\";\n    ControllerCommands[ControllerCommands[\"STOP\"] = 1] = \"STOP\";\n    ControllerCommands[ControllerCommands[\"END\"] = 2] = \"END\";\n})(ControllerCommands = exports.ControllerCommands || (exports.ControllerCommands = {}));\nvar ComputeCommands;\n(function (ComputeCommands) {\n    ComputeCommands[ComputeCommands[\"START\"] = 0] = \"START\";\n    ComputeCommands[ComputeCommands[\"END\"] = 1] = \"END\";\n})(ComputeCommands = exports.ComputeCommands || (exports.ComputeCommands = {}));\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/workerinterfaces.ts?");

/***/ }),

/***/ "./src/serializing/decorators.ts":
/*!***************************************!*\
  !*** ./src/serializing/decorators.ts ***!
  \***************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export serializable [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.serializable = void 0;\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction serializable(type) {\n    metadata_1.addClassName(type);\n}\nexports.serializable = serializable;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/decorators.ts?");

/***/ }),

/***/ "./src/serializing/deserialize.ts":
/*!****************************************!*\
  !*** ./src/serializing/deserialize.ts ***!
  \****************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export deserialize [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.deserialize = void 0;\n/* eslint-disable @typescript-eslint/no-explicit-any */\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\nfunction _deserialize(type, data) {\n    const instance = Object.create(type.prototype);\n    for (const k in data) {\n        const v = data[k];\n        if (Array.isArray(v)) {\n            instance[k] = v.map((val) => {\n                const className = val[interfaces_1.CLASSNAME_KEY];\n                if (className) {\n                    const newtype = metadata_1.getClassConstructor(val[interfaces_1.CLASSNAME_KEY]);\n                    return _deserialize(newtype, val);\n                }\n                return val;\n            });\n        }\n        else if (typeof v === 'object') {\n            const newtype = metadata_1.getClassConstructor(v[interfaces_1.CLASSNAME_KEY]);\n            instance[k] = _deserialize(newtype, v);\n        }\n        else {\n            instance[k] = v;\n        }\n    }\n    return instance;\n}\nfunction deserialize(type, data) {\n    return _deserialize(type, data);\n}\nexports.deserialize = deserialize;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/deserialize.ts?");

/***/ }),

/***/ "./src/serializing/index.ts":
/*!**********************************!*\
  !*** ./src/serializing/index.ts ***!
  \**********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/*! CommonJS bailout: this is used directly at 9:20-24 */
/*! CommonJS bailout: exports is used directly at 13:38-45 */
/*! CommonJS bailout: exports is used directly at 14:37-44 */
/*! CommonJS bailout: exports is used directly at 15:39-46 */
/*! CommonJS bailout: exports is used directly at 16:38-45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__exportStar(__webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./serialize */ \"./src/serializing/serialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./deserialize */ \"./src/serializing/deserialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./decorators */ \"./src/serializing/decorators.ts\"), exports);\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/index.ts?");

/***/ }),

/***/ "./src/serializing/interfaces.ts":
/*!***************************************!*\
  !*** ./src/serializing/interfaces.ts ***!
  \***************************************/
/*! flagged exports */
/*! export CLASSNAME_KEY [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CLASSNAME_KEY = void 0;\nexports.CLASSNAME_KEY = '__CLASSNAME__';\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/interfaces.ts?");

/***/ }),

/***/ "./src/serializing/metadata.ts":
/*!*************************************!*\
  !*** ./src/serializing/metadata.ts ***!
  \*************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export addClassName [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getClassConstructor [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n/* eslint-disable @typescript-eslint/no-explicit-any */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getClassConstructor = exports.addClassName = void 0;\nconst _metaMap = new Map();\nfunction addClassName(type) {\n    //console.log(`add constructor of ${type.name} to map`);\n    _metaMap.set(type.name, type);\n}\nexports.addClassName = addClassName;\nfunction getClassConstructor(name) {\n    if (_metaMap.has(name)) {\n        return _metaMap.get(name);\n    }\n    console.error(`${name} not serializable, use the @serializable decorator`);\n    return null;\n}\nexports.getClassConstructor = getClassConstructor;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/metadata.ts?");

/***/ }),

/***/ "./src/serializing/serialize.ts":
/*!**************************************!*\
  !*** ./src/serializing/serialize.ts ***!
  \**************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export serialize [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.serialize = void 0;\n/* eslint-disable @typescript-eslint/explicit-module-boundary-types */\n/* eslint-disable @typescript-eslint/no-explicit-any */\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nfunction _serializeObject(type, instance) {\n    const target = {};\n    const name = instance.constructor.name;\n    const props = Object.getOwnPropertyNames(instance);\n    target[interfaces_1.CLASSNAME_KEY] = name;\n    for (const prop of props) {\n        const val = instance[prop];\n        target[prop] = _serialize(val.constructor, val);\n    }\n    return target;\n}\nfunction _serializeArray(type, instance) {\n    const target = instance.map((val) => {\n        return _serialize(val.constructor, val);\n    });\n    return target;\n}\nfunction _serialize(type, instance) {\n    if (Array.isArray(instance)) {\n        return _serializeArray(type, instance);\n    }\n    else if (instance instanceof Int8Array ||\n        instance instanceof Uint8Array ||\n        instance instanceof Uint8ClampedArray ||\n        instance instanceof Int16Array ||\n        instance instanceof Uint16Array ||\n        instance instanceof Int32Array ||\n        instance instanceof Uint32Array ||\n        instance instanceof Float32Array ||\n        instance instanceof Float64Array) {\n        return Array.from(instance);\n    }\n    else if (typeof instance === 'object') {\n        return _serializeObject(type, instance);\n    }\n    else if (typeof instance === 'string' || typeof instance === 'number' || typeof instance === 'boolean') {\n        return instance;\n    }\n    else {\n        console.error(`Instance not serializable, constructor: ${instance.constructor.name}`);\n    }\n}\nfunction serialize(type, instance) {\n    return _serializeObject(type, instance);\n}\nexports.serialize = serialize;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/serializing/serialize.ts?");

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export clamp [provided] [no usage info] [missing usage info prevents renaming] */
/*! export degreeToRadians [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomInt [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomNumber [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomNumberRange [provided] [no usage info] [missing usage info prevents renaming] */
/*! export sortArrayRange [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.sortArrayRange = exports.randomInt = exports.clamp = exports.randomNumberRange = exports.randomNumber = exports.degreeToRadians = void 0;\nfunction degreeToRadians(degrees) {\n    return (degrees * Math.PI) / 180;\n}\nexports.degreeToRadians = degreeToRadians;\nfunction randomNumber() {\n    return Math.random();\n}\nexports.randomNumber = randomNumber;\nfunction randomNumberRange(min, max) {\n    return min + (max - min) * randomNumber();\n}\nexports.randomNumberRange = randomNumberRange;\nfunction clamp(x, min, max) {\n    if (x < min) {\n        return min;\n    }\n    if (x > max) {\n        return max;\n    }\n    return x;\n}\nexports.clamp = clamp;\nfunction randomInt(min, max) {\n    // Returns a random integer in [min,max].\n    return Math.floor(randomNumberRange(min, max + 1));\n}\nexports.randomInt = randomInt;\nfunction sortArrayRange(array, start, end, compareFn) {\n    array = [].concat(...array.slice(0, start), ...array.slice(start, start + end).sort(compareFn), ...array.slice(start + end, array.length));\n}\nexports.sortArrayRange = sortArrayRange;\n\n\n//# sourceURL=webpack://ts-raytracer/./src/util.ts?");

/***/ }),

/***/ "./src/vec3.ts":
/*!*********************!*\
  !*** ./src/vec3.ts ***!
  \*********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export add [provided] [no usage info] [missing usage info prevents renaming] */
/*! export addVec3 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export b [provided] [no usage info] [missing usage info prevents renaming] */
/*! export clone [provided] [no usage info] [missing usage info prevents renaming] */
/*! export copyTo [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cross [provided] [no usage info] [missing usage info prevents renaming] */
/*! export divScalarVec [provided] [no usage info] [missing usage info prevents renaming] */
/*! export divideScalar [provided] [no usage info] [missing usage info prevents renaming] */
/*! export dot [provided] [no usage info] [missing usage info prevents renaming] */
/*! export g [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isVec3 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export length [provided] [no usage info] [missing usage info prevents renaming] */
/*! export lengthSquared [provided] [no usage info] [missing usage info prevents renaming] */
/*! export multScalarVec3 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export multVec3 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export multiplyScalar [provided] [no usage info] [missing usage info prevents renaming] */
/*! export negate [provided] [no usage info] [missing usage info prevents renaming] */
/*! export r [provided] [no usage info] [missing usage info prevents renaming] */
/*! export random [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomInHemisphere [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomInUnitSphere [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomInUnitdisk [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomRange [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomUnitVector [provided] [no usage info] [missing usage info prevents renaming] */
/*! export reflect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export refract [provided] [no usage info] [missing usage info prevents renaming] */
/*! export set [provided] [no usage info] [missing usage info prevents renaming] */
/*! export subVec3 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export toString [provided] [no usage info] [provision prevents renaming (no use info)] */
/*! export unitVector [provided] [no usage info] [missing usage info prevents renaming] */
/*! export writeColor [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.writeColor = exports.randomInUnitdisk = exports.refract = exports.reflect = exports.randomInHemisphere = exports.randomUnitVector = exports.randomInUnitSphere = exports.randomRange = exports.random = exports.unitVector = exports.cross = exports.dot = exports.divScalarVec = exports.multScalarVec3 = exports.multVec3 = exports.subVec3 = exports.addVec3 = exports.toString = exports.divideScalar = exports.multiplyScalar = exports.add = exports.negate = exports.lengthSquared = exports.length = exports.b = exports.g = exports.r = exports.clone = exports.copyTo = exports.set = exports.isVec3 = void 0;\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\n// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\nfunction isVec3(v) {\n    return Array.isArray(v) && typeof v[0] === 'number' && typeof v[1] === 'number' && typeof v[2] === 'number';\n}\nexports.isVec3 = isVec3;\nfunction set(v, ...u) {\n    [v[0], v[1], v[2]] = u;\n}\nexports.set = set;\nfunction copyTo(v, dest) {\n    [dest[0], dest[1], dest[2]] = v;\n}\nexports.copyTo = copyTo;\nfunction clone(v) {\n    return [...v];\n}\nexports.clone = clone;\nfunction r(v, r) {\n    return r === undefined ? v[0] : (v[0] = r);\n}\nexports.r = r;\nfunction g(v, g) {\n    return g === undefined ? v[1] : (v[1] = g);\n}\nexports.g = g;\nfunction b(v, b) {\n    return r === undefined ? v[2] : (v[2] = b);\n}\nexports.b = b;\nfunction length(v) {\n    return Math.sqrt(lengthSquared(v));\n}\nexports.length = length;\nfunction lengthSquared(v) {\n    return v[0] ** 2 + v[1] ** 2 + v[2] ** 2;\n}\nexports.lengthSquared = lengthSquared;\nfunction negate(v) {\n    return [-v[0], -v[1], -v[2]];\n}\nexports.negate = negate;\nfunction add(v, o) {\n    return [v[0] + o[0], v[1] + o[1], v[2] + o[2]];\n}\nexports.add = add;\nfunction multiplyScalar(v, t) {\n    return [v[0] * t, v[1] * t, v[2] * t];\n}\nexports.multiplyScalar = multiplyScalar;\nfunction divideScalar(v, t) {\n    return [v[0] / t, v[1] / t, v[2] / t];\n}\nexports.divideScalar = divideScalar;\nfunction toString(v) {\n    return `${v[0]}, ${v[1]}, ${v[2]}`;\n}\nexports.toString = toString;\nfunction addVec3(u, v) {\n    return [u[0] + v[0], u[1] + v[1], u[2] + v[2]];\n}\nexports.addVec3 = addVec3;\nfunction subVec3(u, v) {\n    return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];\n}\nexports.subVec3 = subVec3;\nfunction multVec3(u, v) {\n    return [u[0] * v[0], u[1] * v[1], u[2] * v[2]];\n}\nexports.multVec3 = multVec3;\nfunction multScalarVec3(v, t) {\n    return [t * v[0], t * v[1], t * v[2]];\n}\nexports.multScalarVec3 = multScalarVec3;\nfunction divScalarVec(v, t) {\n    return [v[0] / t, v[1] / t, v[2] / t];\n}\nexports.divScalarVec = divScalarVec;\nfunction dot(u, v) {\n    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];\n}\nexports.dot = dot;\nfunction cross(u, v) {\n    // prettier-ignore\n    return [\n        u[1] * v[2] - u[2] * v[1],\n        u[2] * v[0] - u[0] * v[2],\n        u[0] * v[1] - u[1] * v[0]\n    ];\n}\nexports.cross = cross;\nfunction unitVector(v) {\n    return divScalarVec(v, length(v));\n}\nexports.unitVector = unitVector;\nfunction random() {\n    return [util_1.randomNumber(), util_1.randomNumber(), util_1.randomNumber()];\n}\nexports.random = random;\nfunction randomRange(min, max) {\n    return [util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max)];\n}\nexports.randomRange = randomRange;\nfunction randomInUnitSphere() {\n    // eslint-disable-next-line no-constant-condition\n    while (true) {\n        const p = randomRange(-1, 1);\n        if (lengthSquared(p) >= 1) {\n            continue;\n        }\n        return p;\n    }\n}\nexports.randomInUnitSphere = randomInUnitSphere;\nfunction randomUnitVector() {\n    const a = util_1.randomNumberRange(0, 2 * Math.PI);\n    const z = util_1.randomNumberRange(-1, 1);\n    const r = Math.sqrt(1 - z * z);\n    return [r * Math.cos(a), r * Math.sin(a), z];\n}\nexports.randomUnitVector = randomUnitVector;\nfunction randomInHemisphere(normal) {\n    const in_unit_sphere = randomInUnitSphere();\n    if (dot(in_unit_sphere, normal) > 0.0) {\n        // In the same hemisphere as the normal\n        return in_unit_sphere;\n    }\n    else {\n        return negate(in_unit_sphere);\n    }\n}\nexports.randomInHemisphere = randomInHemisphere;\nfunction reflect(v, n) {\n    return subVec3(v, multScalarVec3(n, 2 * dot(v, n)));\n}\nexports.reflect = reflect;\nfunction refract(uv, n, etai_over_etat) {\n    const cos_theta = dot(negate(uv), n);\n    const uvTheta = addVec3(uv, multScalarVec3(n, cos_theta));\n    const r_out_parallel = multScalarVec3(uvTheta, etai_over_etat);\n    const r_out_perp = multScalarVec3(n, -Math.sqrt(1 - lengthSquared(r_out_parallel)));\n    return addVec3(r_out_parallel, r_out_perp);\n}\nexports.refract = refract;\nfunction randomInUnitdisk() {\n    // eslint-disable-next-line no-constant-condition\n    while (true) {\n        const p = [util_1.randomNumberRange(-1, 1), util_1.randomNumberRange(-1, 1), 0];\n        if (lengthSquared(p) >= 1) {\n            continue;\n        }\n        return p;\n    }\n}\nexports.randomInUnitdisk = randomInUnitdisk;\nfunction writeColor(array, offset, color, samples_per_pixel) {\n    let r = color[0];\n    let g = color[1];\n    let b = color[2];\n    // Divide the color total by the number of samples and gamma-correct for gamma=2.0.\n    const scale = 1.0 / samples_per_pixel;\n    r = Math.sqrt(scale * r);\n    g = Math.sqrt(scale * g);\n    b = Math.sqrt(scale * b);\n    // Write the translated [0,255] value of each color component.\n    array[offset++] = r * 255;\n    array[offset++] = g * 255;\n    array[offset++] = b * 255;\n    array[offset++] = 255;\n}\nexports.writeColor = writeColor;\n/*\nfunction createRandomVecs(count: number): void {\n  for (let i = 0; i < count; i++) {\n    const v = unitVector(randomRange(-1, 1));\n    console.log(`vec3(${v[0]}, ${v[1]}, ${v[2]}),`);\n  }\n}\n\ncreateRandomVecs(256);\n*/\n\n\n//# sourceURL=webpack://ts-raytracer/./src/vec3.ts?");

/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts":
/*!**************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts ***!
  \**************************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.p, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return new Worker(__webpack_require__.p + \"compute.worker.worker.worker.js\");\n}\n\n\n//# sourceURL=webpack://ts-raytracer/./src/raytracer-cpu/compute.worker.ts?./node_modules/worker-loader/dist/cjs.js");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./node_modules/ts-loader/index.js!./src/raytracer-cpu/controller.worker.ts");
/******/ })()
;