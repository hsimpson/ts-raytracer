import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import './style.css';
import App from './components/app';

ReactDOM.render(
  <RecoilRoot>
    <App></App>
  </RecoilRoot>,
  document.getElementById('root')
);
