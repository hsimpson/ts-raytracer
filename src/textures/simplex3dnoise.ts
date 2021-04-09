import { vec2, vec3, vec4 } from 'gl-matrix';
import { addScalar3, addScalar4, mod3, mod4, step3, step4, subScalar3, abs4 } from '../util';

function permute(x: vec4): vec4 {
  return mod4(vec4.add(vec4.create(), vec4.scale(vec4.create(), x, 34.0), [1.0, 1.0, 1.0, 1.0]), 289.0);
}

function taylorInvSqrt(r: vec4): vec4 {
  return vec4.scale(vec4.create(), r, 1.79284291400159 - 0.85373472095314);
}

export function snoise(v: vec3): number {
  const C = vec2.fromValues(1.0 / 6.0, 1.0 / 3.0);
  const D = vec4.fromValues(0.0, 0.5, 1.0, 2.0);

  // First corner
  let i = vec3.floor(vec3.create(), addScalar3(v, vec3.dot(v, vec3.fromValues(C[1], C[1], C[1]))));
  const x0 = vec3.subtract(vec3.create(), v, addScalar3(i, vec3.dot(i, vec3.fromValues(C[0], C[0], C[0]))));

  // Other corners
  const g = step3(vec3.fromValues(x0[1], x0[2], x0[0]), vec3.fromValues(x0[0], x0[1], x0[2]));
  const l = vec3.fromValues(1.0 - g[0], 1.0 - g[1], 1.0 - g[2]);
  const i1 = vec3.min(vec3.create(), g, vec3.fromValues(l[2], l[0], l[1]));
  const i2 = vec3.max(vec3.create(), g, vec3.fromValues(l[2], l[0], l[1]));

  //  x0 = x0 - 0. + 0.0 * C
  const x1 = vec3.add(
    vec3.create(),
    vec3.subtract(vec3.create(), x0, i1),
    vec3.scale(vec3.create(), vec3.fromValues(C[0], C[0], C[0]), 1.0)
  );

  const x2 = vec3.add(
    vec3.create(),
    vec3.subtract(vec3.create(), x0, i2),
    vec3.scale(vec3.create(), vec3.fromValues(C[0], C[0], C[0]), 2.0)
  );

  const x3 = vec3.add(
    vec3.create(),
    subScalar3(x0, 1.0),
    vec3.scale(vec3.create(), vec3.fromValues(C[0], C[0], C[0]), 3.0)
  );

  // Permutations
  i = mod3(i, 289.0);

  const p = permute(
    permute(
      permute(
        vec4.add(
          vec4.create(),
          vec4.add(
            vec4.create(),
            addScalar4(vec4.fromValues(0.0, i1[2], i2[2], 1.0), i[2]),
            addScalar4(vec4.fromValues(0.0, i1[1], i2[1], 1.0), i[1])
          ),
          addScalar4(vec4.fromValues(0.0, i1[0], i2[0], 1.0), i[0])
        )
      )
    )
  );

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  const n_ = 1.0 / 7.0;
  const ns = vec3.sub(
    vec3.create(),
    vec3.scale(vec3.create(), vec3.fromValues(D[3], D[1], D[2]), n_),
    vec3.fromValues(D[0], D[2], D[0])
  );

  const j = vec4.sub(
    vec4.create(),
    p,
    vec4.scale(vec4.create(), vec4.floor(vec4.create(), vec4.scale(vec4.create(), p, ns[2] * ns[2])), 49.0)
  );

  const x_ = vec4.floor(vec4.create(), vec4.scale(vec4.create(), j, ns[2]));
  const y_ = vec4.floor(vec4.create(), vec4.sub(vec4.create(), j, vec4.scale(vec4.create(), x_, 7.0)));

  const x = vec4.add(vec4.create(), vec4.scale(vec4.create(), x_, ns[0]), vec4.fromValues(ns[1], ns[1], ns[1], ns[1]));
  const y = vec4.add(vec4.create(), vec4.scale(vec4.create(), y_, ns[0]), vec4.fromValues(ns[1], ns[1], ns[1], ns[1]));
  const h = vec4.sub(vec4.create(), vec4.fromValues(1.0, 1.0, 1.0, 1.0), vec4.sub(vec4.create(), abs4(x), abs4(y)));

  const b0 = vec4.fromValues(x[0], x[1], y[0], y[1]);
  const b1 = vec4.fromValues(x[2], x[3], y[2], y[3]);

  const s0 = addScalar4(vec4.scale(vec4.create(), vec4.floor(vec4.create(), b0), 2.0), 1.0);
  const s1 = addScalar4(vec4.scale(vec4.create(), vec4.floor(vec4.create(), b1), 2.0), 1.0);
  const sh = vec4.scale(vec4.create(), step4(h, vec4.create()), -1.0);

  const a0 = vec4.add(
    vec4.create(),
    vec4.fromValues(b0[0], b0[2], b0[1], b0[3]),
    vec4.multiply(
      vec4.create(),
      vec4.fromValues(s0[0], s0[2], s0[1], s0[3]),
      vec4.fromValues(sh[0], sh[0], sh[1], sh[1])
    )
  );
  const a1 = vec4.add(
    vec4.create(),
    vec4.fromValues(b1[0], b1[2], b1[1], b1[3]),
    vec4.multiply(
      vec4.create(),
      vec4.fromValues(s1[0], s1[2], s1[1], s1[3]),
      vec4.fromValues(sh[2], sh[2], sh[3], sh[3])
    )
  );

  const p0 = vec3.fromValues(a0[0], a0[1], h[0]);
  const p1 = vec3.fromValues(a0[2], a0[3], h[1]);
  const p2 = vec3.fromValues(a1[0], a1[1], h[2]);
  const p3 = vec3.fromValues(a1[2], a1[3], h[3]);

  //Normalise gradients
  const norm = taylorInvSqrt(vec4.fromValues(vec3.dot(p0, p0), vec3.dot(p1, p1), vec3.dot(p2, p2), vec3.dot(p3, p3)));

  vec3.scale(p0, p0, norm[0]);
  vec3.scale(p1, p1, norm[1]);
  vec3.scale(p2, p2, norm[2]);
  vec3.scale(p3, p3, norm[3]);

  // Mix final noise value
  const m = vec4.max(
    vec4.create(),
    vec4.subtract(
      vec4.create(),
      vec4.fromValues(0.6, 0.6, 0.6, 0.6),
      vec4.fromValues(vec3.dot(x0, x0), vec3.dot(x1, x1), vec3.dot(x2, x2), vec3.dot(x3, x3))
    ),
    vec4.create()
  );
  vec4.multiply(m, m, m);

  return (
    42.0 *
    vec4.dot(
      vec4.multiply(vec4.create(), m, m),
      vec4.fromValues(vec3.dot(p0, x0), vec3.dot(p1, x1), vec3.dot(p2, x2), vec3.dot(p3, x3))
    )
  );
}
