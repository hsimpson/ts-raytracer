import { commonConfig } from './webpack.common';
import { merge } from 'webpack-merge';
import webpack from 'webpack';

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  // devtool: 'inline-source-map',
  watch: true,
  devServer: {
    contentBase: './dist',
    open: false,
    port: 8080,
  },
} as webpack.Configuration);

export default devConfig;
