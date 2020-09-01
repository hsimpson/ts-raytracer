/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js!./src/raytracer-cpu/controller.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js!./src/raytracer-cpu/controller.worker.ts":
/*!*************************************************************************!*\
  !*** ./node_modules/ts-loader!./src/raytracer-cpu/controller.worker.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst compute_worker_1 = __importDefault(__webpack_require__(/*! worker-loader!./compute.worker */ \"./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts\"));\nconst workerinterfaces_1 = __webpack_require__(/*! ./workerinterfaces */ \"./src/raytracer-cpu/workerinterfaces.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst camera_1 = __importDefault(__webpack_require__(/*! ../camera */ \"./src/camera.ts\"));\nconst hittablelist_1 = __webpack_require__(/*! ./hittablelist */ \"./src/raytracer-cpu/hittablelist.ts\");\nconst scenes_1 = __webpack_require__(/*! ./scenes */ \"./src/raytracer-cpu/scenes.ts\");\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst _controllerCtx = self;\nlet _array;\nlet _imageWidth;\nlet _imageHeight;\nlet _samplesPerPixel;\nlet _maxBounces;\nconst _computeWorkers = new Map();\nconst start = (msg) => {\n    _imageWidth = msg.data.imageWidth;\n    _imageHeight = msg.data.imageHeight;\n    _samplesPerPixel = msg.data.samplesPerPixel;\n    _maxBounces = msg.data.maxBounces;\n    _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);\n    const aspectRatio = msg.data.imageWidth / msg.data.imageHeight;\n    let lookFrom;\n    let lookAt;\n    const focusDist = 10;\n    let aperture = 0.0;\n    //const aperture = 0.0;\n    //const fovY = 20;\n    let fovY = 40;\n    let world;\n    let scene;\n    // eslint-disable-next-line prefer-const\n    scene = 1;\n    switch (scene) {\n        case 1:\n            world = scenes_1.randomScene();\n            lookFrom = new vec3_1.default(13, 2, 3);\n            lookAt = new vec3_1.default(0, 0, 0);\n            fovY = 20.0;\n            aperture = 0.1;\n            break;\n        case 2:\n            world = scenes_1.twoSpheres();\n            lookFrom = new vec3_1.default(13, 2, 3);\n            lookAt = new vec3_1.default(0, 0, 0);\n            fovY = 20.0;\n            break;\n        default:\n            break;\n    }\n    const camera = new camera_1.default();\n    const vUp = new vec3_1.default(0, 1, 0);\n    //camera.init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, 0.0, 1.0);\n    camera.init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, 0.0, 0.0);\n    let startLine = msg.data.imageHeight - 1;\n    let availableLines = msg.data.imageHeight;\n    const lineLoad = Math.ceil(availableLines / msg.data.computeWorkers);\n    for (let workerId = 0; workerId < msg.data.computeWorkers; workerId++) {\n        const computeWorker = new compute_worker_1.default();\n        computeWorker.onmessage = onMessageFromComputeWorker;\n        const computeStartMessage = {\n            cmd: workerinterfaces_1.ComputeCommands.START,\n            data: {\n                workerId,\n                camera: serializing_1.serialize(camera_1.default, camera),\n                world: serializing_1.serialize(hittablelist_1.HittableList, world),\n                imageWidth: msg.data.imageWidth,\n                imageHeight: msg.data.imageHeight,\n                scanlineCount: availableLines - lineLoad < 0 ? availableLines : lineLoad,\n                startLine: startLine,\n                samplesPerPixel: _samplesPerPixel,\n                maxBounces: _maxBounces,\n            },\n        };\n        computeWorker.postMessage(computeStartMessage);\n        _computeWorkers.set(workerId, computeWorker);\n        availableLines -= lineLoad;\n        startLine -= lineLoad;\n    }\n};\nconst stop = () => {\n    console.log('controller stop');\n    // stop the compute workers\n    for (const [id, computeWorker] of _computeWorkers) {\n        computeWorker.terminate();\n        _computeWorkers.delete(id);\n    }\n    const controllerEndMessage = {\n        cmd: workerinterfaces_1.ControllerCommands.END,\n        data: {\n            imageArray: _array,\n        },\n    };\n    _controllerCtx.postMessage(controllerEndMessage);\n};\nconst workerIsDone = (msg) => {\n    const id = msg.data.workerId;\n    const workerArray = msg.data.pixelArray;\n    const scanlineCount = msg.data.scanlineCount;\n    const startLine = msg.data.startLine;\n    //\n    //let imageOffset = (startLine + 1 - scanlineCount) * _imageWidth * 3;\n    let imageOffset = (_imageHeight - (startLine + 1)) * _imageWidth * 3;\n    let dataOffset = 0;\n    //const endLine = startLine + scanlineCount;\n    // if (id === 0) {\n    for (let j = 0; j < scanlineCount; j++) {\n        for (let i = 0; i < _imageWidth; i++) {\n            _array[imageOffset++] = workerArray[dataOffset++];\n            _array[imageOffset++] = workerArray[dataOffset++];\n            _array[imageOffset++] = workerArray[dataOffset++];\n        }\n    }\n    // }\n    _computeWorkers.get(id).terminate();\n    _computeWorkers.delete(id);\n    if (_computeWorkers.size === 0) {\n        const controllerEndMessage = {\n            cmd: workerinterfaces_1.ControllerCommands.END,\n            data: {\n                imageArray: _array,\n            },\n        };\n        _controllerCtx.postMessage(controllerEndMessage);\n    }\n};\nconst onMessageFromComputeWorker = (event) => {\n    const msg = event.data;\n    switch (msg.cmd) {\n        case workerinterfaces_1.ComputeCommands.END:\n            workerIsDone(msg);\n            break;\n        default:\n            break;\n    }\n};\n// Respond to message from parent thread\n_controllerCtx.addEventListener('message', (event) => {\n    const msg = event.data;\n    switch (msg.cmd) {\n        case workerinterfaces_1.ControllerCommands.START:\n            start(msg);\n            break;\n        case workerinterfaces_1.ControllerCommands.STOP:\n            stop();\n            break;\n        default:\n            break;\n    }\n});\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/controller.worker.ts?./node_modules/ts-loader");

/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts":
/*!**************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./src/raytracer-cpu/compute.worker.ts ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function() {\n  return new Worker(__webpack_require__.p + \"compute.worker.worker.worker.js\");\n});\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/compute.worker.ts?./node_modules/worker-loader/dist/cjs.js");

/***/ }),

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vec3_1 = __importDefault(__webpack_require__(/*! ./vec3 */ \"./src/vec3.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./raytracer-cpu/ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ./serializing */ \"./src/serializing/index.ts\");\nlet Camera = class Camera {\n    constructor() {\n        //\n    }\n    init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, t0 = 0, t1 = 0) {\n        const theta = util_1.degreeToRadians(fovY);\n        const h = Math.tan(theta / 2);\n        const viewport_height = 2 * h;\n        const viewport_width = aspectRatio * viewport_height;\n        this.w = vec3_1.default.unit_vector(vec3_1.default.subVec3(lookFrom, lookAt));\n        this.u = vec3_1.default.unit_vector(vec3_1.default.cross(vUp, this.w));\n        this.v = vec3_1.default.cross(this.w, this.u);\n        this.lookFrom = lookFrom;\n        this.horizontal = vec3_1.default.multScalarVec3(this.u, focusDist * viewport_width);\n        this.vertical = vec3_1.default.multScalarVec3(this.v, focusDist * viewport_height);\n        const half_horizontal = vec3_1.default.divScalarVec(this.horizontal, 2);\n        const half_vertical = vec3_1.default.divScalarVec(this.vertical, 2);\n        const focusW = vec3_1.default.multScalarVec3(this.w, focusDist);\n        this.lowerLeftCorner = vec3_1.default.subVec3(vec3_1.default.subVec3(vec3_1.default.subVec3(this.lookFrom, half_horizontal), half_vertical), focusW);\n        this.lenseRadius = aperture / 2;\n        this.time0 = t0;\n        this.time1 = t1;\n    }\n    getRay(s, t) {\n        const rd = vec3_1.default.multScalarVec3(vec3_1.default.randomInUnitdisk(), this.lenseRadius);\n        const vecU = vec3_1.default.multScalarVec3(this.u, rd.x);\n        const vecV = vec3_1.default.multScalarVec3(this.v, rd.y);\n        const offset = vec3_1.default.addVec3(vecU, vecV);\n        const sHor = vec3_1.default.multScalarVec3(this.horizontal, s);\n        const tVer = vec3_1.default.multScalarVec3(this.vertical, t);\n        return new ray_1.default(vec3_1.default.addVec3(this.lookFrom, offset), vec3_1.default.subVec3(vec3_1.default.subVec3(vec3_1.default.addVec3(vec3_1.default.addVec3(this.lowerLeftCorner, sHor), tVer), this.lookFrom), offset), util_1.randomNumberRange(this.time0, this.time1));\n    }\n    getUniformArray() {\n        const array = [];\n        array.push(...this.lookFrom.array, 0.0); // vec4 because of memory alignment\n        array.push(...this.lowerLeftCorner.array, 0.0);\n        array.push(...this.horizontal.array, 0.0);\n        array.push(...this.vertical.array, 0.0);\n        array.push(...this.u.array, 0.0);\n        array.push(...this.v.array, 0.0);\n        array.push(...this.w.array, 0.0);\n        array.push(this.lenseRadius);\n        return new Float32Array(array);\n    }\n};\nCamera = __decorate([\n    serializing_1.serializable\n], Camera);\nexports.default = Camera;\n\n\n//# sourceURL=webpack:///./src/camera.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/aabb.ts":
/*!***********************************!*\
  !*** ./src/raytracer-cpu/aabb.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar AABB_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet AABB = AABB_1 = class AABB {\n    constructor(min, max) {\n        this._min = min !== null && min !== void 0 ? min : new vec3_1.default();\n        this._max = max !== null && max !== void 0 ? max : new vec3_1.default();\n    }\n    copyTo(dest) {\n        dest._min = this._min;\n        dest._max = this._max;\n    }\n    get min() {\n        return this._min;\n    }\n    get max() {\n        return this._max;\n    }\n    /*\n    public hit(r: Ray, tmin: number, tmax: number): boolean {\n      for (let a = 0; a < 3; a++) {\n        const rOriginA = r.origin.array[a];\n        const rDirectionA = r.direction.array[a];\n        const t0 = Math.min((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n        const t1 = Math.max((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n  \n        tmin = Math.max(t0, tmin);\n        tmax = Math.min(t1, tmax);\n  \n        if (tmax <= tmin) {\n          return false;\n        }\n      }\n  \n      return true;\n    }*/\n    hit(r, tmin, tmax) {\n        for (let a = 0; a < 3; a++) {\n            const invD = 1.0 / r.direction.array[a];\n            let t0 = (this._min.array[a] - r.origin.array[a]) * invD;\n            let t1 = (this._max.array[a] - r.origin.array[a]) * invD;\n            if (invD < 0.0) {\n                const tmp = t0;\n                t0 = t1;\n                t1 = tmp;\n            }\n            tmin = t0 > tmin ? t0 : tmin;\n            tmax = t1 < tmax ? t1 : tmax;\n            if (tmax <= tmin) {\n                return false;\n            }\n        }\n        return true;\n    }\n    static surroundingBox(box0, box1) {\n        const small = new vec3_1.default(Math.min(box0.min.x, box1.min.x), Math.min(box0.min.y, box1.min.y), Math.min(box0.min.z, box1.min.z));\n        const big = new vec3_1.default(Math.max(box0.max.x, box1.max.x), Math.max(box0.max.y, box1.max.y), Math.max(box0.max.z, box1.max.z));\n        return new AABB_1(small, big);\n    }\n};\nAABB = AABB_1 = __decorate([\n    serializing_1.serializable\n], AABB);\nexports.default = AABB;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/aabb.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/dielectric.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/dielectric.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet DielectricMaterial = class DielectricMaterial extends material_1.default {\n    constructor(refIdx) {\n        super();\n        this._refIdx = refIdx;\n    }\n    schlick(cosine, refIdx) {\n        let r0 = (1 - refIdx) / (1 + refIdx);\n        r0 = r0 * r0;\n        return r0 + (1 - r0) * Math.pow(1 - cosine, 5);\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        attenuation.set(1.0, 1.0, 1.0);\n        const etai_over_etat = rec.front_face ? 1 / this._refIdx : this._refIdx;\n        const unit_direction = vec3_1.default.unit_vector(r_in.direction);\n        const cos_theta = Math.min(vec3_1.default.dot(unit_direction.negate(), rec.normal), 1);\n        const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);\n        if (etai_over_etat * sin_theta > 1) {\n            const reflected = vec3_1.default.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const reflect_prob = this.schlick(cos_theta, etai_over_etat);\n        if (util_1.randomNumber() < reflect_prob) {\n            const reflected = vec3_1.default.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const refracted = vec3_1.default.refract(unit_direction, rec.normal, etai_over_etat);\n        new ray_1.default(rec.p, refracted, r_in.time).copyTo(scattered);\n        return true;\n    }\n};\nDielectricMaterial = __decorate([\n    serializing_1.serializable\n], DielectricMaterial);\nexports.default = DielectricMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/dielectric.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittable.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/hittable.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Hittable = exports.HitRecord = void 0;\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nclass HitRecord {\n    constructor() {\n        this.p = new vec3_1.default();\n        this.normal = new vec3_1.default();\n        this.t = 0;\n        this.u = 0;\n        this.v = 0;\n        this.front_face = true;\n    }\n    set_face_normal(r, outward_normal) {\n        this.front_face = vec3_1.default.dot(r.direction, outward_normal) < 0;\n        this.normal = this.front_face ? outward_normal : outward_normal.negate();\n    }\n    copyTo(dest) {\n        dest.p = this.p;\n        dest.normal = this.normal;\n        dest.t = this.t;\n        dest.u = this.u;\n        dest.v = this.v;\n        dest.front_face = this.front_face;\n        dest.mat = this.mat;\n    }\n}\nexports.HitRecord = HitRecord;\nclass Hittable {\n}\nexports.Hittable = Hittable;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/hittable.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittablelist.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/hittablelist.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.HittableList = void 0;\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet HittableList = class HittableList extends hittable_1.Hittable {\n    constructor(object) {\n        super();\n        this._objects = [];\n        if (object) {\n            this.add(object);\n        }\n    }\n    get objects() {\n        return this._objects;\n    }\n    clear() {\n        this._objects.length = 0;\n    }\n    add(object) {\n        this._objects.push(object);\n    }\n    hit(r, t_min, t_max, rec) {\n        const temp_rec = new hittable_1.HitRecord();\n        let hit_anything = false;\n        let closest_so_far = t_max;\n        for (const object of this._objects) {\n            if (object.hit(r, t_min, closest_so_far, temp_rec)) {\n                hit_anything = true;\n                closest_so_far = temp_rec.t;\n                temp_rec.copyTo(rec);\n            }\n        }\n        return hit_anything;\n    }\n    boundingBox(outputBox) {\n        if (this._objects.length === 0) {\n            return false;\n        }\n        const tempBox = new aabb_1.default();\n        let firstBox = true;\n        for (const object of this._objects) {\n            if (!object.boundingBox(tempBox)) {\n                return false;\n            }\n            if (firstBox) {\n                tempBox.copyTo(outputBox);\n            }\n            else {\n                aabb_1.default.surroundingBox(outputBox, tempBox).copyTo(outputBox);\n            }\n            firstBox = false;\n        }\n        return true;\n    }\n};\nHittableList = __decorate([\n    serializing_1.serializable\n], HittableList);\nexports.HittableList = HittableList;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/hittablelist.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/lambertian.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/lambertian.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet LambertianMaterial = class LambertianMaterial extends material_1.default {\n    constructor(color) {\n        super();\n        if (color) {\n            this.albedo = new texture_1.SolidColor(color);\n        }\n    }\n    set texture(texture) {\n        this.albedo = texture;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const scatter_direction = vec3_1.default.addVec3(rec.normal, vec3_1.default.randomUnitVector());\n        new ray_1.default(rec.p, scatter_direction, r_in.time).copyTo(scattered);\n        const col = this.albedo.value(rec.u, rec.v, rec.p);\n        col.copyTo(attenuation);\n        return true;\n    }\n};\nLambertianMaterial = __decorate([\n    serializing_1.serializable\n], LambertianMaterial);\nexports.default = LambertianMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/lambertian.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/material.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/material.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass Material {\n}\nexports.default = Material;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/material.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/metal.ts":
/*!************************************!*\
  !*** ./src/raytracer-cpu/metal.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet MetalMaterial = class MetalMaterial extends material_1.default {\n    constructor(color, roughness) {\n        super();\n        this.albedo = color;\n        this.roughness = roughness;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const reflect = vec3_1.default.reflect(vec3_1.default.unit_vector(r_in.direction), rec.normal);\n        new ray_1.default(rec.p, vec3_1.default.addVec3(reflect, vec3_1.default.multScalarVec3(vec3_1.default.randomInUnitSphere(), this.roughness)), r_in.time).copyTo(scattered);\n        this.albedo.copyTo(attenuation);\n        return vec3_1.default.dot(scattered.direction, rec.normal) > 0;\n    }\n};\nMetalMaterial = __decorate([\n    serializing_1.serializable\n], MetalMaterial);\nexports.default = MetalMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/metal.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/ray.ts":
/*!**********************************!*\
  !*** ./src/raytracer-cpu/ray.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.rayColor = void 0;\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nclass Ray {\n    constructor(origin, direction, time = 0.0) {\n        if (origin) {\n            this._orig = origin;\n        }\n        if (direction) {\n            this._dir = direction;\n        }\n        this._time = time;\n    }\n    copyTo(dest) {\n        dest._orig = this._orig;\n        dest._dir = this._dir;\n        dest._time = this._time;\n    }\n    get origin() {\n        return this._orig;\n    }\n    set origin(origin) {\n        this._orig = origin;\n    }\n    get direction() {\n        return this._dir;\n    }\n    set direction(direction) {\n        this._dir = direction;\n    }\n    get time() {\n        return this._time;\n    }\n    at(t) {\n        return vec3_1.default.addVec3(this._orig, vec3_1.default.multScalarVec3(this._dir, t));\n    }\n}\nexports.default = Ray;\nfunction rayColor(r, world, depth) {\n    const rec = new hittable_1.HitRecord();\n    // If we've exceeded the ray bounce limit, no more light is gathered.\n    if (depth <= 0) {\n        return new vec3_1.default(0, 0, 0);\n    }\n    if (world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {\n        const scattered = new Ray();\n        const attenuation = new vec3_1.default();\n        if (rec.mat.scatter(r, rec, attenuation, scattered)) {\n            return vec3_1.default.multVec3(attenuation, rayColor(scattered, world, depth - 1));\n        }\n        return new vec3_1.default(0, 0, 0);\n    }\n    const unit_direction = vec3_1.default.unit_vector(r.direction);\n    const t = 0.5 * (unit_direction.y + 1);\n    const color1 = vec3_1.default.multScalarVec3(new vec3_1.default(1, 1, 1), 1 - t);\n    const color2 = vec3_1.default.multScalarVec3(new vec3_1.default(0.5, 0.7, 1.0), t);\n    return vec3_1.default.addVec3(color1, color2);\n}\nexports.rayColor = rayColor;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/ray.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/scenes.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/scenes.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.randomScene = exports.twoSpheres = void 0;\nconst dielectric_1 = __importDefault(__webpack_require__(/*! ./dielectric */ \"./src/raytracer-cpu/dielectric.ts\"));\nconst hittablelist_1 = __webpack_require__(/*! ./hittablelist */ \"./src/raytracer-cpu/hittablelist.ts\");\nconst lambertian_1 = __importDefault(__webpack_require__(/*! ./lambertian */ \"./src/raytracer-cpu/lambertian.ts\"));\nconst metal_1 = __importDefault(__webpack_require__(/*! ./metal */ \"./src/raytracer-cpu/metal.ts\"));\nconst sphere_1 = __importDefault(__webpack_require__(/*! ./sphere */ \"./src/raytracer-cpu/sphere.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nfunction twoSpheres() {\n    const objects = new hittablelist_1.HittableList();\n    const checkerTexture = new texture_1.CheckerTexture(new vec3_1.default(0.2, 0.3, 0.1), new vec3_1.default(0.9, 0.9, 0.9));\n    const sphereMaterial = new lambertian_1.default();\n    sphereMaterial.texture = checkerTexture;\n    objects.add(new sphere_1.default(new vec3_1.default(0, -10, 0), 10, sphereMaterial));\n    objects.add(new sphere_1.default(new vec3_1.default(0, 10, 0), 10, sphereMaterial));\n    return objects;\n}\nexports.twoSpheres = twoSpheres;\nfunction randomScene() {\n    const world = new hittablelist_1.HittableList();\n    //const groundMaterial = new LambertianMaterial(new Vec3(0.5, 0.5, 0.5));\n    const checkerTexture = new texture_1.CheckerTexture(new vec3_1.default(0.2, 0.3, 0.1), new vec3_1.default(0.9, 0.9, 0.9));\n    const groundMaterial = new lambertian_1.default();\n    groundMaterial.texture = checkerTexture;\n    world.add(new sphere_1.default(new vec3_1.default(0, -1000, 0), 1000, groundMaterial));\n    // let i = 1;\n    for (let a = -11; a < 11; a++) {\n        for (let b = -11; b < 11; b++) {\n            //console.log(`${i++}`);\n            const chooseMat = util_1.randomNumber();\n            const center = new vec3_1.default(a + 0.9 * util_1.randomNumber(), 0.2, b + 0.9 * util_1.randomNumber());\n            if (vec3_1.default.subVec3(center, new vec3_1.default(4, 0.2, 0)).length() > 0.9) {\n                let sphereMaterial;\n                if (chooseMat < 0.8) {\n                    // diffuse aka lambertian\n                    const albedo = vec3_1.default.multVec3(vec3_1.default.random(), vec3_1.default.random());\n                    sphereMaterial = new lambertian_1.default(albedo);\n                    //const center2 = Vec3.addVec3(center, new Vec3(0, randomNumberRange(0, 0.5), 0));\n                    //world.add(new MovingSphere(center, center2, 0.0, 1.0, 0.2, sphereMaterial));\n                    world.add(new sphere_1.default(center, 0.2, sphereMaterial));\n                }\n                else if (chooseMat < 0.95) {\n                    // metal\n                    const albedo = vec3_1.default.randomRange(0.5, 1);\n                    const roughness = util_1.randomNumberRange(0, 0.5);\n                    sphereMaterial = new metal_1.default(albedo, roughness);\n                    world.add(new sphere_1.default(center, 0.2, sphereMaterial));\n                }\n                else {\n                    // glass\n                    sphereMaterial = new dielectric_1.default(1.5);\n                    world.add(new sphere_1.default(center, 0.2, sphereMaterial));\n                }\n            }\n        }\n    }\n    const material1 = new dielectric_1.default(1.5);\n    const material2 = new lambertian_1.default(new vec3_1.default(0.4, 0.2, 0.1));\n    const material3 = new metal_1.default(new vec3_1.default(0.7, 0.6, 0.5), 0.0);\n    world.add(new sphere_1.default(new vec3_1.default(1, 1, 0), 1, material1));\n    world.add(new sphere_1.default(new vec3_1.default(-4, 1, 0), 1, material2));\n    world.add(new sphere_1.default(new vec3_1.default(4, 1, 0), 1, material3));\n    return world;\n    //return new HittableList(BVHNode.createFromHitableList(world));\n}\nexports.randomScene = randomScene;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/scenes.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/sphere.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/sphere.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nfunction getSphereUV(p) {\n    const phi = Math.atan2(p.z, p.x);\n    const theta = Math.asin(p.y);\n    const u = 1 - (phi + Math.PI) / (2 * Math.PI);\n    const v = (theta + Math.PI / 2) / Math.PI;\n    return { u, v };\n}\nlet Sphere = class Sphere extends hittable_1.Hittable {\n    constructor(center, radius, mat) {\n        super();\n        this.center = center;\n        this.radius = radius;\n        this.mat = mat;\n    }\n    hit(r, t_min, t_max, rec) {\n        const oc = vec3_1.default.subVec3(r.origin, this.center);\n        const a = r.direction.lengthSquared();\n        const half_b = vec3_1.default.dot(oc, r.direction);\n        const c = oc.lengthSquared() - this.radius * this.radius;\n        const discriminat = half_b * half_b - a * c;\n        if (discriminat > 0) {\n            const root = Math.sqrt(discriminat);\n            let temp = (-half_b - root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius);\n                rec.set_face_normal(r, outward_normal);\n                const uv = getSphereUV(vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this.mat;\n                return true;\n            }\n            temp = (-half_b + root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius);\n                rec.set_face_normal(r, outward_normal);\n                const uv = getSphereUV(vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this.mat;\n                return true;\n            }\n        }\n        return false;\n    }\n    boundingBox(outputBox) {\n        const newOutputBox = new aabb_1.default(vec3_1.default.subVec3(this.center, new vec3_1.default(this.radius, this.radius, this.radius)), vec3_1.default.addVec3(this.center, new vec3_1.default(this.radius, this.radius, this.radius)));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nSphere = __decorate([\n    serializing_1.serializable\n], Sphere);\nexports.default = Sphere;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/sphere.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/texture.ts":
/*!**************************************!*\
  !*** ./src/raytracer-cpu/texture.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.CheckerTexture = exports.SolidColor = exports.Texture = void 0;\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nclass Texture {\n}\nexports.Texture = Texture;\nlet SolidColor = class SolidColor extends Texture {\n    constructor(color) {\n        super();\n        this._color = color;\n    }\n    value(_u, _v, _p) {\n        return this._color;\n    }\n};\nSolidColor = __decorate([\n    serializing_1.serializable\n], SolidColor);\nexports.SolidColor = SolidColor;\nlet CheckerTexture = class CheckerTexture extends Texture {\n    constructor(odd, even) {\n        super();\n        this._odd = new SolidColor(odd);\n        this._even = new SolidColor(even);\n    }\n    value(u, v, p) {\n        const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);\n        if (sines < 0) {\n            return this._odd.value(u, v, p);\n        }\n        else {\n            return this._even.value(u, v, p);\n        }\n    }\n};\nCheckerTexture = __decorate([\n    serializing_1.serializable\n], CheckerTexture);\nexports.CheckerTexture = CheckerTexture;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/texture.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/workerinterfaces.ts":
/*!***********************************************!*\
  !*** ./src/raytracer-cpu/workerinterfaces.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.ComputeCommands = exports.ControllerCommands = void 0;\nvar ControllerCommands;\n(function (ControllerCommands) {\n    ControllerCommands[ControllerCommands[\"START\"] = 0] = \"START\";\n    ControllerCommands[ControllerCommands[\"STOP\"] = 1] = \"STOP\";\n    ControllerCommands[ControllerCommands[\"END\"] = 2] = \"END\";\n})(ControllerCommands = exports.ControllerCommands || (exports.ControllerCommands = {}));\nvar ComputeCommands;\n(function (ComputeCommands) {\n    ComputeCommands[ComputeCommands[\"START\"] = 0] = \"START\";\n    ComputeCommands[ComputeCommands[\"END\"] = 1] = \"END\";\n})(ComputeCommands = exports.ComputeCommands || (exports.ComputeCommands = {}));\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/workerinterfaces.ts?");

/***/ }),

/***/ "./src/serializing/decorators.ts":
/*!***************************************!*\
  !*** ./src/serializing/decorators.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.serializable = void 0;\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction serializable(type) {\n    metadata_1.addClassName(type);\n}\nexports.serializable = serializable;\n\n\n//# sourceURL=webpack:///./src/serializing/decorators.ts?");

/***/ }),

/***/ "./src/serializing/deserialize.ts":
/*!****************************************!*\
  !*** ./src/serializing/deserialize.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.deserialize = void 0;\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\nfunction _deserialize(type, data) {\n    const instance = Object.create(type.prototype);\n    for (const k in data) {\n        const v = data[k];\n        if (Array.isArray(v)) {\n            instance[k] = v.map((val) => {\n                const newtype = metadata_1.getClassConstructor(val[interfaces_1.CLASSNAME_KEY]);\n                return _deserialize(newtype, val);\n            });\n        }\n        else if (typeof v === 'object') {\n            const newtype = metadata_1.getClassConstructor(v[interfaces_1.CLASSNAME_KEY]);\n            instance[k] = _deserialize(newtype, v);\n        }\n        else {\n            instance[k] = v;\n        }\n    }\n    return instance;\n}\nfunction deserialize(type, data) {\n    return _deserialize(type, data);\n}\nexports.deserialize = deserialize;\n\n\n//# sourceURL=webpack:///./src/serializing/deserialize.ts?");

/***/ }),

/***/ "./src/serializing/index.ts":
/*!**********************************!*\
  !*** ./src/serializing/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__exportStar(__webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./serialize */ \"./src/serializing/serialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./deserialize */ \"./src/serializing/deserialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./decorators */ \"./src/serializing/decorators.ts\"), exports);\n\n\n//# sourceURL=webpack:///./src/serializing/index.ts?");

/***/ }),

/***/ "./src/serializing/interfaces.ts":
/*!***************************************!*\
  !*** ./src/serializing/interfaces.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.CLASSNAME_KEY = void 0;\nexports.CLASSNAME_KEY = '__CLASSNAME__';\n\n\n//# sourceURL=webpack:///./src/serializing/interfaces.ts?");

/***/ }),

/***/ "./src/serializing/metadata.ts":
/*!*************************************!*\
  !*** ./src/serializing/metadata.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* eslint-disable @typescript-eslint/no-explicit-any */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getClassConstructor = exports.addClassName = void 0;\nconst _metaMap = new Map();\nfunction addClassName(type) {\n    //console.log(`add constructor of ${type.name} to map`);\n    _metaMap.set(type.name, type);\n}\nexports.addClassName = addClassName;\nfunction getClassConstructor(name) {\n    if (_metaMap.has(name)) {\n        return _metaMap.get(name);\n    }\n    console.error(`${name} not serializable, use the @serializable decorator`);\n    return null;\n}\nexports.getClassConstructor = getClassConstructor;\n\n\n//# sourceURL=webpack:///./src/serializing/metadata.ts?");

/***/ }),

/***/ "./src/serializing/serialize.ts":
/*!**************************************!*\
  !*** ./src/serializing/serialize.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.serialize = void 0;\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nfunction _serialize(type, instance) {\n    const target = {};\n    const props = Object.getOwnPropertyNames(instance);\n    for (const k of props) {\n        const v = instance[k];\n        if (Array.isArray(v)) {\n            target[k] = v.map((val) => {\n                return _serialize(val.constructor, val);\n            });\n        }\n        else if (typeof v === 'object') {\n            target[k] = _serialize(v.constructor, v);\n        }\n        else {\n            target[k] = v;\n        }\n    }\n    target[interfaces_1.CLASSNAME_KEY] = instance.constructor.name;\n    return target;\n}\nfunction serialize(type, instance) {\n    return _serialize(type, instance);\n}\nexports.serialize = serialize;\n\n\n//# sourceURL=webpack:///./src/serializing/serialize.ts?");

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.sortArrayRange = exports.randomInt = exports.clamp = exports.randomNumberRange = exports.randomNumber = exports.degreeToRadians = void 0;\nfunction degreeToRadians(degrees) {\n    return (degrees * Math.PI) / 180;\n}\nexports.degreeToRadians = degreeToRadians;\nfunction randomNumber() {\n    return Math.random();\n}\nexports.randomNumber = randomNumber;\nfunction randomNumberRange(min, max) {\n    return min + (max - min) * randomNumber();\n}\nexports.randomNumberRange = randomNumberRange;\nfunction clamp(x, min, max) {\n    if (x < min) {\n        return min;\n    }\n    if (x > max) {\n        return max;\n    }\n    return x;\n}\nexports.clamp = clamp;\nfunction randomInt(min, max) {\n    // Returns a random integer in [min,max].\n    return Math.floor(randomNumberRange(min, max + 1));\n}\nexports.randomInt = randomInt;\nfunction sortArrayRange(array, start, end, compareFn) {\n    array = [].concat(...array.slice(0, start), ...array.slice(start, start + end).sort(compareFn), ...array.slice(start + end, array.length));\n}\nexports.sortArrayRange = sortArrayRange;\n\n\n//# sourceURL=webpack:///./src/util.ts?");

/***/ }),

/***/ "./src/vec3.ts":
/*!*********************!*\
  !*** ./src/vec3.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar Vec3_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.writeColor = void 0;\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ./serializing */ \"./src/serializing/index.ts\");\nlet Vec3 = Vec3_1 = class Vec3 {\n    constructor(x, y, z) {\n        this.x = 0;\n        this.y = 0;\n        this.z = 0;\n        this.x = x !== null && x !== void 0 ? x : 0;\n        this.y = y !== null && y !== void 0 ? y : 0;\n        this.z = z !== null && z !== void 0 ? z : 0;\n    }\n    get array() {\n        return [this.x, this.y, this.z];\n    }\n    set(x, y, z) {\n        this.x = x;\n        this.y = y;\n        this.z = z;\n    }\n    copyTo(dest) {\n        dest.x = this.x;\n        dest.y = this.y;\n        dest.z = this.z;\n    }\n    get r() {\n        return this.x;\n    }\n    set r(r) {\n        this.x = r;\n    }\n    get g() {\n        return this.y;\n    }\n    set g(g) {\n        this.y = g;\n    }\n    get b() {\n        return this.z;\n    }\n    set b(b) {\n        this.z = b;\n    }\n    length() {\n        return Math.sqrt(this.lengthSquared());\n    }\n    lengthSquared() {\n        return this.x * this.x + this.y * this.y + this.z * this.z;\n    }\n    negate() {\n        return new Vec3_1(-this.x, -this.y, -this.z);\n    }\n    add(v) {\n        this.x += v.x;\n        this.y += v.y;\n        this.z += v.z;\n        return this;\n    }\n    multiplyScalar(t) {\n        this.x *= t;\n        this.y *= t;\n        this.z *= t;\n        return this;\n    }\n    divideScalar(t) {\n        this.x /= t;\n        this.y /= t;\n        this.z /= t;\n        return this;\n    }\n    toString() {\n        return `${this.x}, ${this.y}, ${this.z}`;\n    }\n    static addVec3(u, v) {\n        return new Vec3_1(u.x + v.x, u.y + v.y, u.z + v.z);\n    }\n    static subVec3(u, v) {\n        return new Vec3_1(u.x - v.x, u.y - v.y, u.z - v.z);\n    }\n    static multVec3(u, v) {\n        return new Vec3_1(u.x * v.x, u.y * v.y, u.z * v.z);\n    }\n    static multScalarVec3(v, t) {\n        return new Vec3_1(t * v.x, t * v.y, t * v.z);\n    }\n    static divScalarVec(v, t) {\n        return new Vec3_1(v.x / t, v.y / t, v.z / t);\n    }\n    static dot(u, v) {\n        return u.x * v.x + u.y * v.y + u.z * v.z;\n    }\n    static cross(u, v) {\n        // prettier-ignore\n        return new Vec3_1(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);\n    }\n    static unit_vector(v) {\n        return Vec3_1.divScalarVec(v, v.length());\n    }\n    static random() {\n        return new Vec3_1(util_1.randomNumber(), util_1.randomNumber(), util_1.randomNumber());\n    }\n    static randomRange(min, max) {\n        return new Vec3_1(util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max));\n    }\n    static randomInUnitSphere() {\n        // eslint-disable-next-line no-constant-condition\n        while (true) {\n            const p = Vec3_1.randomRange(-1, 1);\n            if (p.lengthSquared() >= 1) {\n                continue;\n            }\n            return p;\n        }\n    }\n    static randomUnitVector() {\n        const a = util_1.randomNumberRange(0, 2 * Math.PI);\n        const z = util_1.randomNumberRange(-1, 1);\n        const r = Math.sqrt(1 - z * z);\n        return new Vec3_1(r * Math.cos(a), r * Math.sin(a), z);\n    }\n    static randomInHemisphere(normal) {\n        const in_unit_sphere = Vec3_1.randomInUnitSphere();\n        if (Vec3_1.dot(in_unit_sphere, normal) > 0.0) {\n            // In the same hemisphere as the normal\n            return in_unit_sphere;\n        }\n        else {\n            return in_unit_sphere.negate();\n        }\n    }\n    static reflect(v, n) {\n        return Vec3_1.subVec3(v, Vec3_1.multScalarVec3(n, 2 * Vec3_1.dot(v, n)));\n    }\n    static refract(uv, n, etai_over_etat) {\n        const cos_theta = Vec3_1.dot(uv.negate(), n);\n        const uvTheta = Vec3_1.addVec3(uv, Vec3_1.multScalarVec3(n, cos_theta));\n        const r_out_parallel = Vec3_1.multScalarVec3(uvTheta, etai_over_etat);\n        const r_out_perp = Vec3_1.multScalarVec3(n, -Math.sqrt(1 - r_out_parallel.lengthSquared()));\n        return Vec3_1.addVec3(r_out_parallel, r_out_perp);\n    }\n    static randomInUnitdisk() {\n        // eslint-disable-next-line no-constant-condition\n        while (true) {\n            const p = new Vec3_1(util_1.randomNumberRange(-1, 1), util_1.randomNumberRange(-1, 1), 0);\n            if (p.lengthSquared() >= 1) {\n                continue;\n            }\n            return p;\n        }\n    }\n};\nVec3 = Vec3_1 = __decorate([\n    serializing_1.serializable\n], Vec3);\nexports.default = Vec3;\nfunction writeColor(array, offset, color, samples_per_pixel) {\n    let r = color.r;\n    let g = color.g;\n    let b = color.b;\n    // Divide the color total by the number of samples and gamma-correct for gamma=2.0.\n    const scale = 1.0 / samples_per_pixel;\n    r = Math.sqrt(scale * r);\n    g = Math.sqrt(scale * g);\n    b = Math.sqrt(scale * b);\n    // Write the translated [0,255] value of each color component.\n    array[offset++] = r * 255;\n    array[offset++] = g * 255;\n    array[offset++] = b * 255;\n    array[offset++] = 255;\n}\nexports.writeColor = writeColor;\n\n\n//# sourceURL=webpack:///./src/vec3.ts?");

/***/ })

/******/ });