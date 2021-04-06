import React from 'react';
import Gui from './gui';
import Canvas from './canvas';

const App = (): React.ReactElement => {
  return (
    <>
      <Gui />
      <Canvas />
    </>
  );
};

export default App;
