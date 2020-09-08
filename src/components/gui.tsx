import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import RaytracerGPU from '../raytracer-gpu/raytracergpu';
import { RaytracerProperties } from './atoms';
import CheckBox from './checkbox';
import NumberInput from './input';
import { DropDownItem, DropDown } from './dropdown';

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

  const sceneConfig: DropDownItem[] = [
    { text: 'Random Spheres', value: 1 },
    { text: '2 Checkboard spheres', value: 2 },
    { text: '2 Perlin noise spheres', value: 3 },
    { text: 'Earth sphere', value: 4 },
    { text: 'Area light', value: 5 },
    { text: 'Cornell Box', value: 6 },
  ];

  return (
    <div className="gui">
      <NumberInput
        label="Image width:"
        size={5}
        min={1}
        value={raytracerState.imageWidth}
        onValueChange={(imageWidth) => setRaytracerState({ ...raytracerState, imageWidth })}></NumberInput>
      <NumberInput
        label="Image height:"
        size={5}
        min={1}
        value={raytracerState.imageHeight}
        onValueChange={(imageHeight) => setRaytracerState({ ...raytracerState, imageHeight })}></NumberInput>
      <NumberInput
        label="Samples per pixel:"
        size={5}
        min={1}
        value={raytracerState.samplesPerPixel}
        onValueChange={(samplesPerPixel) => setRaytracerState({ ...raytracerState, samplesPerPixel })}></NumberInput>
      <NumberInput
        label="Max bounces:"
        size={5}
        min={1}
        value={raytracerState.maxBounces}
        onValueChange={(maxBounces) => setRaytracerState({ ...raytracerState, maxBounces })}></NumberInput>
      {raytracerState.webGPUenabled === false ? (
        <NumberInput
          label="Num of CPU workers:"
          size={5}
          min={1}
          max={navigator.hardwareConcurrency}
          value={raytracerState.numOfWorkers}
          onValueChange={(numOfWorkers) => setRaytracerState({ ...raytracerState, numOfWorkers })}></NumberInput>
      ) : (
        ''
      )}
      <CheckBox
        label="WebGPU-compute"
        checked={raytracerState.webGPUenabled}
        disabled={!raytracerState.webGPUavailable}
        onValueChange={(webGPUenabled) => setRaytracerState({ ...raytracerState, webGPUenabled })}></CheckBox>
      <DropDown
        label="Scene:"
        disabled={raytracerState.webGPUenabled}
        items={sceneConfig}
        onValueChange={(scene) => setRaytracerState({ ...raytracerState, scene })}></DropDown>
      <button className="resetButton" onClick={onReset}>
        Reset to default
      </button>
    </div>
  );
};

export default Gui;
