import React from 'react';
import Gui from './gui';
import Canvas from './canvas';
import { StartRendering } from './atoms';
import { useRecoilState } from 'recoil';

const App = (): React.ReactElement => {
  const [startRendering, setStartRendering] = useRecoilState(StartRendering);

  return (
    <React.Fragment>
      <Gui></Gui>
      <Canvas></Canvas>
      <button className="renderButton" onClick={() => setStartRendering(!startRendering)}>
        {startRendering ? 'Stop rendering!' : 'Start rendering!'}
      </button>
    </React.Fragment>
  );
};

export default App;
