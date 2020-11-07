import React from 'react';
import Gui from './gui';
import Canvas from './canvas';

const App = (): React.ReactElement => {
  return (
    <React.Fragment>
      <Gui></Gui>
      <Canvas></Canvas>
    </React.Fragment>
  );
};

export default App;
