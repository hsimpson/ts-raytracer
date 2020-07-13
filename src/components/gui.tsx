import React from 'react';
import NumberInput from './input';
import CheckBox from './checkbox';
import { RaytracerProperties } from './atoms';
import { useRecoilState, useResetRecoilState } from 'recoil';
import RaytracerGPU from '../raytracer-gpu/raytracergpu';

const Gui = (): React.ReactElement => {
  const [raytracerState, setRaytracerState] = useRecoilState(RaytracerProperties);
  const resetRaytracerState = useResetRecoilState(RaytracerProperties);

  React.useEffect(() => {
    if (RaytracerGPU.supportsWebGPU()) {
      setRaytracerState({ ...raytracerState, webGPUavailable: true, webGPUenabled: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReset = (): void => {
    resetRaytracerState();
  };

  return (
    <div className="gui">
      <NumberInput
        label="Image width:"
        size={5}
        value={raytracerState.imageWidth}
        onValueChange={(imageWidth) => setRaytracerState({ ...raytracerState, imageWidth })}></NumberInput>
      <NumberInput
        label="Image height:"
        size={5}
        value={raytracerState.imageHeight}
        onValueChange={(imageHeight) => setRaytracerState({ ...raytracerState, imageHeight })}></NumberInput>
      <NumberInput
        label="Samples per pixel:"
        size={5}
        value={raytracerState.samplesPerPixel}
        onValueChange={(samplesPerPixel) => setRaytracerState({ ...raytracerState, samplesPerPixel })}></NumberInput>
      <NumberInput
        label="Max bounces:"
        size={5}
        value={raytracerState.maxBounces}
        onValueChange={(maxBounces) => setRaytracerState({ ...raytracerState, maxBounces })}></NumberInput>
      <NumberInput
        label="Num of workers:"
        size={5}
        min={1}
        max={navigator.hardwareConcurrency}
        value={raytracerState.numOfWorkers}
        onValueChange={(numOfWorkers) => setRaytracerState({ ...raytracerState, numOfWorkers })}></NumberInput>
      <CheckBox
        label="WebGPU-compute"
        checked={raytracerState.webGPUenabled}
        disabled={!raytracerState.webGPUavailable}
        onValueChange={(webGPUenabled) => setRaytracerState({ ...raytracerState, webGPUenabled })}></CheckBox>
      <button className="resetButton" onClick={onReset}>
        Reset to default
      </button>
    </div>
  );
};

export default Gui;
