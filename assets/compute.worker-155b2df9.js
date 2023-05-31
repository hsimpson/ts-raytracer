var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  var _a, _b;
  "use strict";
  var EPSILON$1 = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i = arguments.length;
      while (i--) {
        y += arguments[i] * arguments[i];
      }
      return Math.sqrt(y);
    };
  function create$4() {
    var out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  function create$3() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function multiply$2(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function create$2() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply$1(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function normalize$2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a[0] * len2;
    out[1] = a[1] * len2;
    out[2] = a[2] * len2;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  var sub = subtract;
  var len = length;
  (function() {
    var vec = create$2();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  })();
  function create$1() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len2 = x * x + y * y + z * z + w * w;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = x * len2;
    out[1] = y * len2;
    out[2] = z * len2;
    out[3] = w * len2;
    return out;
  }
  (function() {
    var vec = create$1();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 4;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }
      return a;
    };
  })();
  function create() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function multiply(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function slerp(out, a, b, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    var omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON$1) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function fromMat3(out, m) {
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      var i = 0;
      if (m[4] > m[0])
        i = 1;
      if (m[8] > m[i * 3 + i])
        i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  function fromEuler(out, x, y, z) {
    var halfToRad = 0.5 * Math.PI / 180;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  var normalize = normalize$1;
  (function() {
    var tmpvec3 = create$2();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function(out, a, b) {
      var dot$1 = dot(a, b);
      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 1e-6)
          cross(tmpvec3, yUnitVec3, a);
        normalize$2(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize(out, out);
      }
    };
  })();
  (function() {
    var temp1 = create();
    var temp2 = create();
    return function(out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  })();
  (function() {
    var matr = create$4();
    return function(out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize(out, fromMat3(out, matr));
    };
  })();
  class HitRecord {
    constructor() {
      __publicField(this, "p", create$2());
      __publicField(this, "normal", create$2());
      __publicField(this, "t", 0);
      __publicField(this, "u", 0);
      __publicField(this, "v", 0);
      __publicField(this, "frontFace", true);
      __publicField(this, "mat");
    }
    setFaceNormal(r, outward_normal) {
      this.frontFace = dot(r.direction, outward_normal) < 0;
      this.normal = this.frontFace ? outward_normal : negate(create$2(), outward_normal);
    }
    copyTo(dest) {
      dest.p = copy(create$2(), this.p);
      dest.normal = copy(create$2(), this.normal);
      dest.t = this.t;
      dest.u = this.u;
      dest.v = this.v;
      dest.frontFace = this.frontFace;
      dest.mat = this.mat;
    }
  }
  class Ray {
    constructor(origin, direction, time = 0) {
      __publicField(this, "_orig");
      __publicField(this, "_dir");
      __publicField(this, "_time");
      if (origin) {
        this._orig = origin;
      }
      if (direction) {
        this._dir = direction;
      }
      this._time = time;
    }
    copyTo(dest) {
      dest._orig = copy(create$2(), this._orig);
      dest._dir = copy(create$2(), this._dir);
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
      return add(create$2(), this._orig, scale(create$2(), this._dir, t));
    }
  }
  function rayColor(ray, background2, world2, depth) {
    const rec = new HitRecord();
    if (depth <= 0) {
      return [0, 0, 0];
    }
    if (!world2.hit(ray, 1e-3, Number.POSITIVE_INFINITY, rec)) {
      return background2;
    }
    const scattered = new Ray();
    const attenuation = [0, 0, 0];
    const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);
    if (!rec.mat.scatter(ray, rec, attenuation, scattered)) {
      return emitted;
    }
    return add(
      create$2(),
      emitted,
      multiply$1(create$2(), attenuation, rayColor(scattered, background2, world2, depth - 1))
    );
  }
  const CLASSNAME_KEY = "__CLASSNAME__";
  const _metaMap = /* @__PURE__ */ new Map();
  function addClassName(type) {
    _metaMap.set(type.name, type);
  }
  function getClassConstructor(name) {
    if (_metaMap.has(name)) {
      return _metaMap.get(name);
    }
    console.error(`${name} not serializable, use the @serializable decorator`);
    return null;
  }
  function _deserialize(type, data) {
    const instance = Object.create(type.prototype);
    for (const k in data) {
      const v = data[k];
      if (Array.isArray(v)) {
        instance[k] = v.map((val) => {
          const className = val[CLASSNAME_KEY];
          if (className) {
            const newtype = getClassConstructor(val[CLASSNAME_KEY]);
            return _deserialize(newtype, val);
          }
          return val;
        });
      } else if (typeof v === "object") {
        const newtype = getClassConstructor(v[CLASSNAME_KEY]);
        instance[k] = _deserialize(newtype, v);
      } else {
        instance[k] = v;
      }
    }
    return instance;
  }
  function deserialize(type, data) {
    return _deserialize(type, data);
  }
  function serializable(type) {
    addClassName(type);
  }
  const GAMMA = 1 / 2.2;
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
  function getSphereUV(p) {
    const phi = Math.atan2(p[2], p[0]);
    const theta = Math.asin(p[1]);
    const u = 1 - (phi + Math.PI) / (2 * Math.PI);
    const v = (theta + Math.PI / 2) / Math.PI;
    return { u, v };
  }
  function writeColor(array, offset, color, spp) {
    let [r, g, b] = color;
    const scale2 = 1 / spp;
    r = Math.pow(scale2 * r, GAMMA);
    g = Math.pow(scale2 * g, GAMMA);
    b = Math.pow(scale2 * b, GAMMA);
    array[offset++] = r * 255;
    array[offset++] = g * 255;
    array[offset++] = b * 255;
    array[offset++] = 255;
  }
  function lengthSquared(v) {
    return v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
  }
  function reflect(v, n) {
    return subtract(create$2(), v, scale(create$2(), n, 2 * dot(v, n)));
  }
  function refract(uv, n, etai_over_etat) {
    const cos_theta = dot(negate(create$2(), uv), n);
    const uvTheta = add(create$2(), uv, scale(create$2(), n, cos_theta));
    const r_out_parallel = scale(create$2(), uvTheta, etai_over_etat);
    const r_out_perp = scale(create$2(), n, -Math.sqrt(1 - lengthSquared(r_out_parallel)));
    return add(create$2(), r_out_parallel, r_out_perp);
  }
  function randomInUnitSphere() {
    while (true) {
      const p = randomRange(-1, 1);
      if (lengthSquared(p) >= 1) {
        continue;
      }
      return p;
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
      const p = [randomNumberRange(-1, 1), randomNumberRange(-1, 1), 0];
      if (lengthSquared(p) >= 1) {
        continue;
      }
      return p;
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
      __publicField(this, "lookFrom");
      __publicField(this, "lowerLeftCorner", create$2());
      __publicField(this, "horizontal", create$2());
      __publicField(this, "vertical", create$2());
      __publicField(this, "u", create$2());
      __publicField(this, "v", create$2());
      __publicField(this, "w", create$2());
      __publicField(this, "lenseRadius");
      __publicField(this, "time0");
      __publicField(this, "time1");
    }
    init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, t0 = 0, t1 = 0) {
      const theta = degreeToRadians(fovY);
      const h = Math.tan(theta / 2);
      const viewport_height = 2 * h;
      const viewport_width = aspectRatio * viewport_height;
      normalize$2(this.w, subtract(create$2(), lookFrom, lookAt));
      normalize$2(this.u, cross(create$2(), vUp, this.w));
      cross(this.v, this.w, this.u);
      this.lookFrom = lookFrom;
      scale(this.horizontal, this.u, focusDist * viewport_width);
      scale(this.vertical, this.v, focusDist * viewport_height);
      const half_horizontal = scale(create$2(), this.horizontal, 0.5);
      const half_vertical = scale(create$2(), this.vertical, 0.5);
      const focusW = scale(create$2(), this.w, focusDist);
      subtract(
        this.lowerLeftCorner,
        subtract(create$2(), subtract(create$2(), this.lookFrom, half_horizontal), half_vertical),
        focusW
      );
      this.lenseRadius = aperture / 2;
      this.time0 = t0;
      this.time1 = t1;
    }
    getRay(s, t) {
      const rd = scale(create$2(), randomInUnitdisk(), this.lenseRadius);
      const vecU = scale(create$2(), this.u, rd[0]);
      const vecV = scale(create$2(), this.v, rd[1]);
      const offset = add(create$2(), vecU, vecV);
      const sHor = scale(create$2(), this.horizontal, s);
      const tVer = scale(create$2(), this.vertical, t);
      return new Ray(
        add(create$2(), this.lookFrom, offset),
        sub(
          create$2(),
          sub(create$2(), add(create$2(), add(create$2(), this.lowerLeftCorner, sHor), tVer), this.lookFrom),
          offset
        ),
        randomNumberRange(this.time0, this.time1)
      );
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
      array.push([0, 0, 0, 0]);
      return new Float32Array(array);
    }
  };
  Camera = __decorateClass$m([
    serializable
  ], Camera);
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
    // private _size: vec3;
    // private _center: vec3;
    constructor(min, max) {
      __publicField(this, "_min");
      __publicField(this, "_max");
      this._min = min ?? [0, 0, 0];
      this._max = max ?? [0, 0, 0];
    }
    copyTo(dest) {
      dest._min = copy(create$2(), this._min);
      dest._max = copy(create$2(), this._max);
    }
    // public logBox(): string {
    //   return `center: ${this._center.toString()} | size: ${this._size.toString()}`;
    // }
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
    // public hit(ray: Ray, tMin: number, tMax: number): boolean {
    //   for (let a = 0; a < 3; a++) {
    //     const invD = 1.0 / ray.direction[a];
    //     let t0 = (this._min[a] - ray.origin[a]) * invD;
    //     let t1 = (this._max[a] - ray.origin[a]) * invD;
    //     if (invD < 0.0) {
    //       const tmp = t0;
    //       t0 = t1;
    //       t1 = tmp;
    //     }
    //     tMin = t0 > tMin ? t0 : tMin;
    //     tMax = t1 < tMax ? t1 : tMax;
    //     if (tMax <= tMin) {
    //       return false;
    //     }
    //   }
    //   return true;
    // }
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
      __publicField(this, "_objectToWorldMatrix", create$3());
      __publicField(this, "_worldToObjectMatrix", create$3());
      __publicField(this, "_rotationMatrix", create$3());
      __publicField(this, "_inverseRotationMatrix", create$3());
      __publicField(this, "_normalMatrix", create$3());
      __publicField(this, "_position", create$2());
      __publicField(this, "_rotation", create());
      __publicField(this, "_isTransformed", false);
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
      return new Ray(
        [movedOrigin[0], movedOrigin[1], movedOrigin[2]],
        [movedDirection[0], movedDirection[1], movedDirection[2]],
        // ray.direction,
        ray.time
      );
    }
    transformRecord(ray, rec) {
      if (!this._isTransformed) {
        return;
      }
      const movedP = fromValues(rec.p[0], rec.p[1], rec.p[2]);
      transformMat4(movedP, movedP, this._objectToWorldMatrix);
      const movedN = fromValues(rec.normal[0], rec.normal[1], rec.normal[2]);
      transformMat4(movedN, movedN, this._normalMatrix);
      normalize$2(movedN, movedN);
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
      let tempQuat = create();
      tempQuat = fromEuler(tempQuat, angleX, angelY, angleZ);
      this.rotateQuat(tempQuat);
    }
    // public transformVec3(v: vec3): vec3 {
    //   if(!this._isTransformed) {
    //     return v;
    //   }
    //   return vec3.transformMat4(vec3.create(), v, this._objectToWorldMatrix);
    // }
    _updateMatrix() {
      this._isTransformed = true;
      const translationMatrix = create$3();
      translate(translationMatrix, translationMatrix, this._position);
      fromQuat(this._rotationMatrix, this._rotation);
      multiply$2(this._objectToWorldMatrix, translationMatrix, this._rotationMatrix);
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
      __publicField(this, "material");
      __publicField(this, "name", "");
      __publicField(this, "transform", new Transform());
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
      __publicField(this, "x0");
      __publicField(this, "x1");
      __publicField(this, "y0");
      __publicField(this, "y1");
      __publicField(this, "k");
      __publicField(this, "bbox");
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
      __publicField(this, "x0");
      __publicField(this, "x1");
      __publicField(this, "z0");
      __publicField(this, "z1");
      __publicField(this, "k");
      __publicField(this, "bbox");
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
      __publicField(this, "y0");
      __publicField(this, "y1");
      __publicField(this, "z0");
      __publicField(this, "z1");
      __publicField(this, "k");
      __publicField(this, "bbox");
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
      __publicField(this, "_objects", []);
      if (object) {
        this.add(object);
      }
    }
    get objects() {
      return this._objects;
    }
    // public clear(): void {
    //   this._objects.length = 0;
    // }
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
      __publicField(this, "_boxMin");
      __publicField(this, "_boxMax");
      __publicField(this, "_sides", new HittableList());
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
      const transformedMin = transformMat4(create$2(), this._boxMin, this.transform.objectToWorld);
      const transformedMax = transformMat4(create$2(), this._boxMax, this.transform.objectToWorld);
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
      __publicField(this, "bbox", new AABB());
      __publicField(this, "left");
      __publicField(this, "right");
      __publicField(this, "id", _id);
      __publicField(this, "level");
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
    static createFromObjects(objects, start2, end, time0, time1) {
      const node = new BVHNode();
      node.init(objects, start2, end, time0, time1);
      return node;
    }
    init(objects, start2, end, time0, time1) {
      const axis = randomInt(0, 2);
      const comparator = axis === 0 ? boxXCompare : axis === 1 ? boxYCompare : boxZCompare;
      const objectSpan = end - start2;
      if (objectSpan === 1) {
        this.left = this.right = objects[start2];
      } else if (objectSpan === 2) {
        if (comparator(objects[start2], objects[start2 + 1]) === -1) {
          this.left = objects[start2];
          this.right = objects[start2 + 1];
        } else {
          this.left = objects[start2 + 1];
          this.right = objects[start2];
        }
      } else {
        const mid = start2 + Math.floor(objectSpan / 2);
        const nextLevel = ++_level;
        this.left = BVHNode.createFromObjects(objects, start2, mid, time0, time1);
        this.right = BVHNode.createFromObjects(objects, mid, end, time0, time1);
        this.left.level = nextLevel;
        this.right.level = nextLevel;
      }
      const boxLeft = this.left.boundingBox(time0, time1);
      const boxRight = this.right.boundingBox(time0, time1);
      this.bbox = AABB.surroundingBox(boxLeft, boxRight);
    }
    // public hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    //   //console.time(`BVH-hit #${this.id}`);
    //   if (!this.box.hit(r, tMin, tMax)) {
    //     return false;
    //     //console.timeEnd(`BVH-hit #${this.id}`);
    //   }
    //   const hitLeft = this.left.hit(r, tMin, tMax, rec);
    //   const hitRight = this.right.hit(r, tMin, hitLeft ? rec.t : tMax, rec);
    //   //console.timeEnd(`BVH-hit #${this.id}`);
    //   return hitLeft || hitRight;
    // }
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
      return create$2();
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
      __publicField(this, "_indexOfRefraction");
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
      const unit_direction = normalize$2(create$2(), ray.direction);
      const cos_theta = Math.min(dot(negate(create$2(), unit_direction), rec.normal), 1);
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
      __publicField(this, "_color");
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
      __publicField(this, "_odd");
      __publicField(this, "_even");
      __publicField(this, "_scale");
      this._odd = new SolidColor(odd);
      this._even = new SolidColor(even);
      this._scale = scale2 || 5;
    }
    modulo(x) {
      return x - Math.floor(x);
    }
    value(u, v, p) {
      const x = this.modulo(u * this._scale) < 0.5;
      const y = this.modulo(v * this._scale) < 0.5;
      if (x ? !y : y) {
        return this._even.value(u, v, p);
      } else {
        return this._odd.value(u, v, p);
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
  let ImageTexture = (_a = class extends Texture {
    constructor() {
      super();
      __publicField(this, "_width", 0);
      __publicField(this, "_height", 0);
      __publicField(this, "_bytesPerScanLine", 0);
      __publicField(this, "_data");
      __publicField(this, "_url", "");
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
  }, __publicField(_a, "BytesPerPixel", 4), _a);
  ImageTexture = __decorateClass$c([
    serializable
  ], ImageTexture);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var alea$1 = { exports: {} };
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function() {
      Alea.importState = function(i) {
        var random = new Alea();
        random.importState(i);
        return random;
      };
      return Alea;
      function Alea() {
        return function(args) {
          var s0 = 0;
          var s1 = 0;
          var s2 = 0;
          var c = 1;
          if (args.length == 0) {
            args = [+/* @__PURE__ */ new Date()];
          }
          var mash = Mash();
          s0 = mash(" ");
          s1 = mash(" ");
          s2 = mash(" ");
          for (var i = 0; i < args.length; i++) {
            s0 -= mash(args[i]);
            if (s0 < 0) {
              s0 += 1;
            }
            s1 -= mash(args[i]);
            if (s1 < 0) {
              s1 += 1;
            }
            s2 -= mash(args[i]);
            if (s2 < 0) {
              s2 += 1;
            }
          }
          mash = null;
          var random = function() {
            var t = 2091639 * s0 + c * 23283064365386963e-26;
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
          };
          random.next = random;
          random.uint32 = function() {
            return random() * 4294967296;
          };
          random.fract53 = function() {
            return random() + (random() * 2097152 | 0) * 11102230246251565e-32;
          };
          random.version = "Alea 0.9";
          random.args = args;
          random.exportState = function() {
            return [s0, s1, s2, c];
          };
          random.importState = function(i2) {
            s0 = +i2[0] || 0;
            s1 = +i2[1] || 0;
            s2 = +i2[2] || 0;
            c = +i2[3] || 0;
          };
          return random;
        }(Array.prototype.slice.call(arguments));
      }
      function Mash() {
        var n = 4022871197;
        var mash = function(data) {
          data = data.toString();
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        };
        mash.version = "Mash 0.9";
        return mash;
      }
    });
  })(alea$1);
  var aleaExports = alea$1.exports;
  var alea = /* @__PURE__ */ getDefaultExportFromCjs(aleaExports);
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  const fastFloor = (x) => Math.floor(x) | 0;
  const grad3 = /* @__PURE__ */ new Float64Array([
    1,
    1,
    0,
    -1,
    1,
    0,
    1,
    -1,
    0,
    -1,
    -1,
    0,
    1,
    0,
    1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    -1,
    0,
    -1,
    0,
    1,
    1,
    0,
    -1,
    1,
    0,
    1,
    -1,
    0,
    -1,
    -1
  ]);
  function createNoise3D(random = Math.random) {
    const perm = buildPermutationTable(random);
    const permGrad3x = new Float64Array(perm).map((v) => grad3[v % 12 * 3]);
    const permGrad3y = new Float64Array(perm).map((v) => grad3[v % 12 * 3 + 1]);
    const permGrad3z = new Float64Array(perm).map((v) => grad3[v % 12 * 3 + 2]);
    return function noise3D2(x, y, z) {
      let n0, n1, n2, n3;
      const s = (x + y + z) * F3;
      const i = fastFloor(x + s);
      const j = fastFloor(y + s);
      const k = fastFloor(z + s);
      const t = (i + j + k) * G3;
      const X0 = i - t;
      const Y0 = j - t;
      const Z0 = k - t;
      const x0 = x - X0;
      const y0 = y - Y0;
      const z0 = z - Z0;
      let i1, j1, k1;
      let i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        }
      } else {
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        }
      }
      const x1 = x0 - i1 + G3;
      const y1 = y0 - j1 + G3;
      const z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2 * G3;
      const y2 = y0 - j2 + 2 * G3;
      const z2 = z0 - k2 + 2 * G3;
      const x3 = x0 - 1 + 3 * G3;
      const y3 = y0 - 1 + 3 * G3;
      const z3 = z0 - 1 + 3 * G3;
      const ii = i & 255;
      const jj = j & 255;
      const kk = k & 255;
      let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0)
        n0 = 0;
      else {
        const gi0 = ii + perm[jj + perm[kk]];
        t0 *= t0;
        n0 = t0 * t0 * (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);
      }
      let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0)
        n1 = 0;
      else {
        const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];
        t1 *= t1;
        n1 = t1 * t1 * (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);
      }
      let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0)
        n2 = 0;
      else {
        const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];
        t2 *= t2;
        n2 = t2 * t2 * (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);
      }
      let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0)
        n3 = 0;
      else {
        const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];
        t3 *= t3;
        n3 = t3 * t3 * (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);
      }
      return 32 * (n0 + n1 + n2 + n3);
    };
  }
  function buildPermutationTable(random) {
    const tableSize = 512;
    const p = new Uint8Array(tableSize);
    for (let i = 0; i < tableSize / 2; i++) {
      p[i] = i;
    }
    for (let i = 0; i < tableSize / 2 - 1; i++) {
      const r = i + ~~(random() * (256 - i));
      const aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    for (let i = 256; i < tableSize; i++) {
      p[i] = p[i - 256];
    }
    return p;
  }
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
  let Perlin = (_b = class {
    constructor() {
      __publicField(this, "_ranVecs");
      __publicField(this, "_permX");
      __publicField(this, "_permY");
      __publicField(this, "_permZ");
      this._ranVecs = new Array(Perlin._pointCount);
      for (let i = 0; i < Perlin._pointCount; i++) {
        this._ranVecs[i] = normalize$2(create$2(), randomRange(-1, 1));
      }
      this._permX = Perlin.perlinGeneratePerm();
      this._permY = Perlin.perlinGeneratePerm();
      this._permZ = Perlin.perlinGeneratePerm();
    }
    noise(p) {
      let u = p[0] - Math.floor(p[0]);
      let v = p[1] - Math.floor(p[1]);
      let w = p[2] - Math.floor(p[2]);
      u = u * u * (3 - 2 * u);
      v = v * v * (3 - 2 * v);
      w = w * w * (3 - 2 * w);
      const i = Math.floor(p[0]);
      const j = Math.floor(p[1]);
      const k = Math.floor(p[2]);
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
    turb(p, depth = 7) {
      let accum = 0;
      const temp_p = p;
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
  }, __publicField(_b, "_pointCount", 256), _b);
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
  const prng = alea("just a random seed string");
  const noise3D = createNoise3D(prng);
  let NoiseTexture = class extends Texture {
    // private _simplexNoise: SimplexNoise;
    constructor(scale2) {
      super();
      __publicField(this, "_noise", new Perlin());
      __publicField(this, "_scale");
      this._scale = scale2;
    }
    get scale() {
      return this._scale;
    }
    turb(p, depth = 7) {
      let accum = 0;
      const tempP = p;
      let weight = 1;
      for (let i = 0; i < depth; i++) {
        accum += weight * noise3D(p[0], p[1], p[2]);
        weight *= 0.5;
        scale(tempP, tempP, 2);
      }
      return Math.abs(accum);
    }
    value(u, v, p) {
      return scale(
        create$2(),
        scale(create$2(), fromValues(1, 1, 1), 0.5),
        1 + Math.sin(this._scale * p[2] + 10 * this.turb(p))
      );
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
      __publicField(this, "_emit");
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
    emitted(u, v, p) {
      return this._emit.value(u, v, p);
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
      __publicField(this, "_albedo");
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
      __publicField(this, "_albedo");
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
      const scatter_direction = add(create$2(), rec.normal, randomUnitVector());
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
      __publicField(this, "_baseColor");
      __publicField(this, "_roughness");
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
      const refl = reflect(normalize$2(create$2(), r_in.direction), rec.normal);
      new Ray(
        rec.p,
        add(create$2(), refl, scale(create$2(), randomInUnitSphere(), this._roughness)),
        r_in.time
      ).copyTo(scattered);
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
      __publicField(this, "corrected", false);
    }
    scatter(ray, rec, attenuation, scattered) {
      const scatter_direction = add(create$2(), rec.normal, randomUnitVector());
      new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);
      const col = rec.normal;
      if (this.corrected) {
        add(col, col, fromValues(1, 1, 1));
        scale(col, col, 0.5);
        normalize$2(col, col);
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
      const scatter_direction = add(create$2(), rec.normal, randomUnitVector());
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
      __publicField(this, "_boundary");
      __publicField(this, "_phaseFunction");
      __publicField(this, "_negInvDensity");
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
      __publicField(this, "_center0");
      __publicField(this, "_center1");
      __publicField(this, "_time0");
      __publicField(this, "_time1");
      __publicField(this, "_radius");
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
      const oc = subtract(create$2(), transformedRay.origin, this.center(transformedRay.time));
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
          const outward_normal = create$2();
          const pMinusCenter = subtract(create$2(), rec.p, this.center(transformedRay.time));
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
          const outward_normal = create$2();
          const pMinusCenter = subtract(create$2(), rec.p, this.center(transformedRay.time));
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
      const centerDiff = subtract(create$2(), this._center1, this._center0);
      const centerDiffT = scale(create$2(), centerDiff, timeDiff);
      return add(create$2(), this._center0, centerDiffT);
    }
    boundingBox(t0, t1) {
      const transformedCenterT0 = transformMat4(create$2(), this.center(t0), this.transform.objectToWorld);
      const transformedCenterT1 = transformMat4(create$2(), this.center(t1), this.transform.objectToWorld);
      const r = fromValues(this._radius, this._radius, this._radius);
      const box0 = new AABB(
        sub(create$2(), transformedCenterT0, r),
        add(create$2(), transformedCenterT0, r)
      );
      const box1 = new AABB(
        sub(create$2(), transformedCenterT1, r),
        add(create$2(), transformedCenterT1, r)
      );
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
      __publicField(this, "_center");
      __publicField(this, "_radius");
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
      const oc = subtract(create$2(), transformedRay.origin, this._center);
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
          const outward_normal = create$2();
          const pMinusCenter = subtract(create$2(), rec.p, this._center);
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
          const outward_normal = create$2();
          const pMinusCenter = subtract(create$2(), rec.p, this._center);
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
      const transformedCenter = transformMat4(create$2(), this._center, this.transform.objectToWorld);
      const r = fromValues(this._radius, this._radius, this._radius);
      return new AABB(sub(create$2(), transformedCenter, r), add(create$2(), transformedCenter, r));
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
      __publicField(this, "v0");
      __publicField(this, "n0");
      __publicField(this, "uv0");
      __publicField(this, "v1");
      __publicField(this, "n1");
      __publicField(this, "uv1");
      __publicField(this, "v2");
      __publicField(this, "n2");
      __publicField(this, "uv2");
      __publicField(this, "surfaceNormal");
      __publicField(this, "transform", new Transform());
      __publicField(this, "material");
      __publicField(this, "doubleSided", false);
      this.v0 = v0;
      this.v1 = v1;
      this.v2 = v2;
      this.n0 = n0;
      this.n1 = n1;
      this.n2 = n2;
      if (n0 === void 0 || n1 === void 0 || n2 === void 0) {
        const edge1 = create$2();
        const edge2 = create$2();
        const faceNormal = create$2();
        subtract(edge1, this.v1, this.v0);
        subtract(edge2, this.v2, this.v0);
        cross(faceNormal, edge1, edge2);
        normalize$2(faceNormal, faceNormal);
        this.n0 = faceNormal;
        this.n1 = faceNormal;
        this.n2 = faceNormal;
      }
      this.surfaceNormal = create$2();
      normalize$2(this.surfaceNormal, avgVector3([this.n0, this.n1, this.n2]));
      this.uv0 = uv0 ?? [0, 0];
      this.uv1 = uv1 ?? [0, 0];
      this.uv2 = uv2 ?? [0, 0];
    }
    applyTransform() {
      transformMat4(this.v0, this.v0, this.transform.objectToWorld);
      transformMat4(this.v1, this.v1, this.transform.objectToWorld);
      transformMat4(this.v2, this.v2, this.transform.objectToWorld);
      transformMat4(this.n0, this.n0, this.transform.normalMatrix);
      transformMat4(this.n1, this.n1, this.transform.normalMatrix);
      transformMat4(this.n2, this.n2, this.transform.normalMatrix);
      normalize$2(this.n0, this.n0);
      normalize$2(this.n1, this.n1);
      normalize$2(this.n2, this.n2);
    }
    /* from https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf */
    hit(ray, tMin, tMax, rec) {
      const transformedRay = this.transform.transformRay(ray);
      const edge1 = subtract(create$2(), this.v1, this.v0);
      const edge2 = subtract(create$2(), this.v2, this.v0);
      const pvec = cross(create$2(), transformedRay.direction, edge2);
      const det = dot(edge1, pvec);
      let t, u, v;
      if (!this.doubleSided) {
        if (det < EPSILON) {
          return false;
        }
        const tvec = subtract(create$2(), transformedRay.origin, this.v0);
        u = dot(tvec, pvec);
        if (u < 0 || u > det) {
          return false;
        }
        const qvec = cross(create$2(), tvec, edge1);
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
        const tvec = subtract(create$2(), transformedRay.origin, this.v0);
        u = dot(tvec, pvec) * invDet;
        if (u < 0 || u > 1) {
          return false;
        }
        const qvec = cross(create$2(), tvec, edge1);
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
      const n0 = scale(create$2(), this.n0, w);
      const n1 = scale(create$2(), this.n1, u);
      const n2 = scale(create$2(), this.n2, v);
      const outwardNormal = normalize$2(create$2(), add(create$2(), add(create$2(), n0, n1), n2));
      rec.normal = outwardNormal;
      rec.frontFace = true;
      return true;
    }
    boundingBox(_t0, _t1) {
      let v0;
      let v1;
      let v2;
      if (this.transform.isTransformed) {
        v0 = transformMat4(create$2(), this.v0, this.transform.objectToWorld);
        v1 = transformMat4(create$2(), this.v1, this.transform.objectToWorld);
        v2 = transformMat4(create$2(), this.v2, this.transform.objectToWorld);
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
  var ComputeCommands = /* @__PURE__ */ ((ComputeCommands2) => {
    ComputeCommands2[ComputeCommands2["INIT"] = 0] = "INIT";
    ComputeCommands2[ComputeCommands2["READY"] = 1] = "READY";
    ComputeCommands2[ComputeCommands2["START"] = 2] = "START";
    ComputeCommands2[ComputeCommands2["END"] = 3] = "END";
    return ComputeCommands2;
  })(ComputeCommands || {});
  const controllerCtx = self;
  let workerId;
  let camera;
  let world;
  let background;
  let imageWidth;
  let imageHeight;
  let samplesPerPixel;
  let maxBounces;
  function init(msg) {
    workerId = msg.data.workerId;
    camera = deserialize(Camera, msg.data.camera);
    world = deserialize(HittableList, msg.data.world);
    background = msg.data.background;
    imageWidth = msg.data.imageWidth;
    imageHeight = msg.data.imageHeight;
    samplesPerPixel = msg.data.samplesPerPixel;
    maxBounces = msg.data.maxBounces;
    const computeReadyMessage = {
      cmd: ComputeCommands.READY,
      data: {
        workerId
      }
    };
    controllerCtx.postMessage(computeReadyMessage);
  }
  function start(msg) {
    const x = msg.data.x;
    const y = msg.data.y;
    const width = msg.data.width;
    const height = msg.data.height;
    const dataArray = new Uint8ClampedArray(width * height * 4);
    let offset = 0;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const pixelColor = create$2();
        for (let s = 0; s < samplesPerPixel; s++) {
          const u = (i + x + randomNumber()) / (imageWidth - 1);
          const v = (j + y + randomNumber()) / (imageHeight - 1);
          const r = camera.getRay(u, v);
          add(pixelColor, pixelColor, rayColor(r, background, world, maxBounces));
        }
        writeColor(dataArray, offset, pixelColor, samplesPerPixel);
        offset += 4;
      }
    }
    const computeEndMessage = {
      cmd: ComputeCommands.END,
      data: {
        workerId,
        pixelArray: dataArray,
        x,
        y,
        width,
        height
      }
    };
    controllerCtx.postMessage(computeEndMessage);
  }
  controllerCtx.addEventListener("message", (event) => {
    const msg = event.data;
    switch (msg.cmd) {
      case ComputeCommands.INIT:
        init(msg);
        break;
      case ComputeCommands.START:
        start(msg);
        break;
    }
  });
})();
