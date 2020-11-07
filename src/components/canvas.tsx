import React from 'react';
import { useRecoilState } from 'recoil';
import { RaytracerCPU, RayTracerCPUOptions } from '../raytracer-cpu/raytracercpu';
import { RaytracerGPU, RayTracerGPUOptions } from '../raytracer-gpu/raytracergpu';
import { RaytracerProperties, RaytracerRunningState } from './atoms';

const Canvas = (): React.ReactElement => {
  const canvasRef = React.useRef<HTMLCanvasElement>(undefined);
  const [raytracerState] = useRecoilState(RaytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = useRecoilState(RaytracerRunningState);

  const rayTracerCPURef = React.useRef<RaytracerCPU>(undefined);
  const rayTracerGPURef = React.useRef<RaytracerGPU>(undefined);

  const onRayTracerDone = (stats: string): void => {
    setRaytracerRunningState({ ...raytracerRunningState, isRunning: false, stats });
  };

  React.useEffect(() => {
    const options: RayTracerCPUOptions | RayTracerGPUOptions = {
      canvas: canvasRef.current,
      imageWidth: raytracerState.imageWidth,
      imageHeight: raytracerState.imageHeight,
      samplesPerPixel: raytracerState.samplesPerPixel,
      maxBounces: raytracerState.maxBounces,
      scene: raytracerState.scene,
      download: raytracerState.download,
      addStatsToImage: raytracerState.addStatsToImage,
    };

    rayTracerCPURef.current = new RaytracerCPU({ ...options, numOfWorkers: raytracerState.numOfWorkers });

    if (RaytracerGPU.supportsWebGPU()) {
      rayTracerGPURef.current = new RaytracerGPU(options);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    rayTracerCPURef.current.imageWidth = raytracerState.imageWidth;
    rayTracerCPURef.current.imageHeight = raytracerState.imageHeight;
    rayTracerCPURef.current.samplesPerPixel = raytracerState.samplesPerPixel;
    rayTracerCPURef.current.maxBounces = raytracerState.maxBounces;
    rayTracerCPURef.current.scene = raytracerState.scene;
    rayTracerCPURef.current.numOfWorkers = raytracerState.numOfWorkers;
    rayTracerCPURef.current.download = raytracerState.download;
    rayTracerCPURef.current.addStatsToImage = raytracerState.addStatsToImage;

    if (rayTracerGPURef.current) {
      rayTracerGPURef.current.imageWidth = raytracerState.imageWidth;
      rayTracerGPURef.current.imageHeight = raytracerState.imageHeight;
      rayTracerGPURef.current.samplesPerPixel = raytracerState.samplesPerPixel;
      rayTracerGPURef.current.maxBounces = raytracerState.maxBounces;
      rayTracerGPURef.current.scene = raytracerState.scene;
      rayTracerGPURef.current.download = raytracerState.download;
      rayTracerGPURef.current.addStatsToImage = raytracerState.addStatsToImage;
    }
  }, [raytracerState]);

  React.useEffect(() => {
    let raytracer: RaytracerCPU | RaytracerGPU = rayTracerCPURef.current;
    if (raytracerState.webGPUenabled) {
      raytracer = rayTracerGPURef.current;
    }

    if (raytracerRunningState.isRunning && !raytracer.isRunning) {
      raytracer.start(onRayTracerDone);
    } else if (!raytracerRunningState.isRunning && raytracer.isRunning) {
      raytracer.stop();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raytracerRunningState.isRunning]);

  return (
    <div className="render-container">
      <span className="stats">{`Render stats: ${raytracerRunningState.stats}`}</span>
      <div className="canvas-container">
        <canvas
          className="canvas"
          ref={canvasRef}
          width={raytracerState.imageWidth}
          height={raytracerState.imageHeight}></canvas>
      </div>
    </div>
  );
};

export default Canvas;
