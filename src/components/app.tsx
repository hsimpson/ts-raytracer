import React from 'react';
import Canvas from './canvas';
import Gui from './gui';

const App = (): React.ReactElement => {
  return (
    <>
      <Gui />
      <Canvas />
    </>
  );
};

export default App;
