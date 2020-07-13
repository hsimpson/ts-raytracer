// https://indico.cern.ch/event/93877/contributions/2118070/attachments/1104200/1575343/acat3_revised_final.pdf

uint _seed;

void initSeed(uint seed) {
  _seed = seed;
}

uint tauStep(uint z, int s1, int s2, int s3, uint M) {
  uint b   = (((z << s1) ^ z) >> s2);
  return z = (((z & M) << s3) ^ b);
}

float rand() {
  uint z1, z2, z3, z4, r;
  z1    = tauStep(_seed, 13, 19, 12, 429496729U);
  z2    = tauStep(_seed, 2, 25, 4, 4294967288U);
  z3    = tauStep(_seed, 3, 11, 17, 429496280U);
  z4    = (1664525 * _seed + 1013904223U);
  _seed = (z1 ^ z2 ^ z3 ^ z4);
  return _seed * 2.3283064365387e-10;
}
