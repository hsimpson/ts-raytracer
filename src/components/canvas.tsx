import React from 'react';
import { useRecoilState } from 'recoil';
import RaytracerCPU from '../raytracer-cpu/raytracercpu';
import RaytracerGPU from '../raytracer-gpu/raytracergpu';
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
    rayTracerCPURef.current = new RaytracerCPU(
      canvasRef.current,
      raytracerState.imageWidth,
      raytracerState.imageHeight,
      raytracerState.samplesPerPixel,
      raytracerState.maxBounces,
      raytracerState.scene,
      raytracerState.numOfWorkers
    );

    if (RaytracerGPU.supportsWebGPU()) {
      rayTracerGPURef.current = new RaytracerGPU(
        canvasRef.current,
        raytracerState.imageWidth,
        raytracerState.imageHeight,
        raytracerState.samplesPerPixel,
        raytracerState.maxBounces,
        raytracerState.scene
      );
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

    if (rayTracerGPURef.current) {
      rayTracerGPURef.current.imageWidth = raytracerState.imageWidth;
      rayTracerGPURef.current.imageHeight = raytracerState.imageHeight;
      rayTracerGPURef.current.samplesPerPixel = raytracerState.samplesPerPixel;
      rayTracerGPURef.current.maxBounces = raytracerState.maxBounces;
      rayTracerGPURef.current.scene = raytracerState.scene;
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
