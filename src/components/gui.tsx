import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import React from 'react';
import { raytracerProperties, raytracerRunningProperties } from './atoms';
import CheckBox from './checkbox';
import { DropDown, DropDownItem } from './dropdown';
import NumberInput from './input';

const Gui = (): React.ReactElement => {
  const [raytracerState, setRaytracerState] = useAtom(raytracerProperties);
  const resetRaytracerState = useResetAtom(raytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = useAtom(raytracerRunningProperties);

  const onResetClicked = (): void => {
    resetRaytracerState();
  };

  const onStartRenderClicked = (): void => {
    setRaytracerRunningState({ ...raytracerRunningState, isRunning: true, stats: '' });
  };

  const sceneConfig: DropDownItem[] = [
    { text: 'Random Spheres', value: 0, disabled: false },
    { text: '2 Checkerboard spheres', value: 1, disabled: false },
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
        onValueChange={(imageWidth) => {
          setRaytracerState({ ...raytracerState, imageWidth });
        }}
      />
      <NumberInput
        label="Image height:"
        size={5}
        min={1}
        value={raytracerState.imageHeight}
        onValueChange={(imageHeight) => {
          setRaytracerState({ ...raytracerState, imageHeight });
        }}
      />
      <NumberInput
        label="Samples per pixel:"
        size={5}
        min={1}
        value={raytracerState.samplesPerPixel}
        onValueChange={(samplesPerPixel) => {
          setRaytracerState({ ...raytracerState, samplesPerPixel });
        }}
      />
      <NumberInput
        label="Max bounces:"
        size={5}
        min={1}
        value={raytracerState.maxBounces}
        onValueChange={(maxBounces) => {
          setRaytracerState({ ...raytracerState, maxBounces });
        }}
      />
      <NumberInput
        label="Tile size (px):"
        size={5}
        min={8}
        max={512}
        value={raytracerState.tileSize}
        onValueChange={(tileSize) => {
          setRaytracerState({ ...raytracerState, tileSize });
        }}
      />
      <DropDown
        label="Scene:"
        items={sceneConfig}
        default={raytracerState.scene}
        onValueChange={(scene) => {
          setRaytracerState({ ...raytracerState, scene });
        }}
      />

      <CheckBox
        label="Download"
        checked={raytracerState.download}
        disabled={false}
        onValueChange={(download) => {
          setRaytracerState({ ...raytracerState, download });
        }}
      />

      <CheckBox
        label="Add stats to download"
        checked={raytracerState.addStatsToImage}
        disabled={!raytracerState.download}
        onValueChange={(addStatsToImage) => {
          setRaytracerState({ ...raytracerState, addStatsToImage });
        }}
      />

      <button type="button" className="resetButton" onClick={onResetClicked}>
        Reset to default
      </button>
      <button type="button" className="renderButton" onClick={onStartRenderClicked}>
        {raytracerRunningState.isRunning ? 'Stop rendering!' : 'Start rendering!'}
      </button>
    </div>
  );
};

export default Gui;
