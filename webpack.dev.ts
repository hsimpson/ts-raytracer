import { commonConfig } from './webpack.common';
import { merge } from 'webpack-merge';

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  watchOptions: {
    poll: 1000,
  },
  devServer: {
    contentBase: './dist',
    open: true,
  },
});

export default devConfig;
