import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 1280,
    imageHeight: 720,
    samplesPerPixel: 10,
    maxBounces: 50,
    numOfWorkers: navigator.hardwareConcurrency,
    webGPUavailable: false,
    webGPUenabled: false,
    download: false,
    addStatsToImage: false,
    scene: 0,
  },
});

export const RaytracerRunningState = atom({
  key: 'raytracerState',
  default: {
    isRunning: false,
    stats: '',
  },
});
