import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 400,
    imageHeight: 300,
    samplesPerPixel: 1,
    maxBounces: 50,
    numOfWorkers: navigator.hardwareConcurrency,
    webGPUavailable: false,
    webGPUenabled: false,
    download: false,
  },
});

export const RaytracerRunningState = atom({
  key: 'raytracerState',
  default: {
    isRunning: false,
    stats: '',
  },
});
