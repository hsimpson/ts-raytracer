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
      <div className="renderButtonContainer">
        <button className="renderButton" onClick={() => setStartRendering(!startRendering)}>
          {startRendering ? 'Stop rendering!' : 'Start rendering!'}
        </button>
      </div>
    </React.Fragment>
  );
};

export default App;
