import { Provider } from 'jotai';
import React from 'react';
import Canvas from './canvas';
import Gui from './gui';

const App = (): React.ReactElement => {
  return (
    <Provider>
      <Gui />
      <Canvas />
    </Provider>
  );
};

export default App;
