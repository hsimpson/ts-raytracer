import { commonConfig } from './webpack.common';
import { merge } from 'webpack-merge';

const prodConfig = merge(commonConfig, {
  // mode: 'production',
  // FIXME: in production serializer no longer working!
  mode: 'development',
});

export default prodConfig;
