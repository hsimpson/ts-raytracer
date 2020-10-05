import { commonConfig } from './webpack.common';
import { merge } from 'webpack-merge';

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  devServer: {
    contentBase: './dist',
    open: false,
  },
});

export default devConfig;
