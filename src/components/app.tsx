import React from 'react';
import Gui from './gui';
import Canvas from './canvas';

const App = (): React.ReactElement => {
  return (
    <React.Fragment>
      <div className="">
        <Gui />
        <Canvas />
      </div>
    </React.Fragment>
  );
};

export default App;
