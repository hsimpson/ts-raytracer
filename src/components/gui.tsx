import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { RaytracerGPU } from '../raytracer-gpu/raytracergpu';
import { RaytracerProperties, RaytracerRunningState } from './atoms';
import CheckBox from './checkbox';
import NumberInput from './input';
import { DropDownItem, DropDown } from './dropdown';

const Gui = (): React.ReactElement => {
  const [raytracerState, setRaytracerState] = useRecoilState(RaytracerProperties);
  const resetRaytracerState = useResetRecoilState(RaytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = useRecoilState(RaytracerRunningState);

  React.useEffect(() => {
    if (RaytracerGPU.supportsWebGPU()) {
      setRaytracerState({ ...raytracerState, webGPUavailable: true, webGPUenabled: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResetClicked = (): void => {
    resetRaytracerState();
  };

  const onStartRenderClicked = (): void => {
    setRaytracerRunningState({ ...raytracerRunningState, isRunning: true, stats: '' });
  };

  const sceneConfig: DropDownItem[] = [
    { text: 'Random Spheres', value: 0, disabled: false },
    { text: '2 Checkboard spheres', value: 1, disabled: false },
    { text: '2 Noise spheres', value: 2, disabled: false },
    { text: 'Earth sphere', value: 3, disabled: false },
    { text: 'Area light', value: 4, disabled: false },
    { text: 'Cornell Box', value: 5, disabled: false },
    // { text: 'Cornell Box Smoke', value: 6, disabled: raytracerState.webGPUenabled },
    // { text: 'Final Scene', value: 7, disabled: raytracerState.webGPUenabled },
    { text: 'GLTF Scene', value: 8, disabled: false },
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
        items={sceneConfig}
        default={raytracerState.scene}
        onValueChange={(scene) => setRaytracerState({ ...raytracerState, scene })}></DropDown>

      <CheckBox
        label="Download"
        checked={raytracerState.download}
        disabled={false}
        onValueChange={(download) => setRaytracerState({ ...raytracerState, download })}></CheckBox>

      <CheckBox
        label="Add stats to download"
        checked={raytracerState.addStatsToImage}
        disabled={!raytracerState.download}
        onValueChange={(addStatsToImage) => setRaytracerState({ ...raytracerState, addStatsToImage })}></CheckBox>

      <button className="resetButton" onClick={onResetClicked}>
        Reset to default
      </button>
      <button className="renderButton" onClick={onStartRenderClicked}>
        {raytracerRunningState.isRunning ? 'Stop rendering!' : 'Start rendering!'}
      </button>
    </div>
  );
};

export default Gui;
