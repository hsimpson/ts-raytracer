import React from 'react';
import IntegerInput from './input';
import { RaytracerProperties } from './atoms';
import { useRecoilState, useResetRecoilState } from 'recoil';

const Gui = (): React.ReactElement => {
  const [raytracerState, setRaytracerState] = useRecoilState(RaytracerProperties);
  const resetRaytracerState = useResetRecoilState(RaytracerProperties);

  const onReset = (): void => {
    resetRaytracerState();
  };

  return (
    <div className="gui">
      <IntegerInput
        label="Image width:"
        size={5}
        value={raytracerState.imageWidth}
        onValueChange={(imageWidth) => setRaytracerState({ ...raytracerState, imageWidth })}></IntegerInput>
      <IntegerInput
        label="Image height:"
        size={5}
        value={raytracerState.imageHeight}
        onValueChange={(imageHeight) => setRaytracerState({ ...raytracerState, imageHeight })}></IntegerInput>
      <IntegerInput
        label="Samples per pixel:"
        size={5}
        value={raytracerState.samplesPerPixel}
        onValueChange={(samplesPerPixel) => setRaytracerState({ ...raytracerState, samplesPerPixel })}></IntegerInput>
      <IntegerInput
        label="Max bounces:"
        size={5}
        value={raytracerState.maxBounces}
        onValueChange={(maxBounces) => setRaytracerState({ ...raytracerState, maxBounces })}></IntegerInput>
      <button className="resetButton" onClick={onReset}>
        Reset to default
      </button>
    </div>
  );
};

export default Gui;
