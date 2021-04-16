import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    // UHD
    // imageWidth: 3840,
    // imageHeight: 2160,

    // WQHD
    // imageWidth: 2560,
    // imageHeight: 1440,

    // Full HD
    // imageWidth: 1920,
    // imageHeight: 1080,

    // HD
    // imageWidth: 1280,
    // imageHeight: 720,

    imageWidth: 1024,
    imageHeight: 576,

    // imageWidth: 640,
    // imageHeight: 360,

    // imageWidth: 256,
    // imageHeight: 144,

    // imageWidth: 128,
    // imageHeight: 72,

    samplesPerPixel: 20,
    maxBounces: 12,
    numOfWorkers: navigator.hardwareConcurrency,
    // numOfWorkers: 1,
    webGPUavailable: false,
    webGPUenabled: false,
    download: false,
    addStatsToImage: false,
    scene: 0,
    // scene: 4,
    // scene: 8,
    tileSize: 32,
  },
});

export const RaytracerRunningState = atom({
  key: 'raytracerState',
  default: {
    isRunning: false,
    stats: '',
  },
});
