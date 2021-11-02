import { commonConfig } from './webpack.common';
import { merge } from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  // devtool: 'inline-source-map',
  watch: true,
  devServer: {
    static: {
      // directory: path.join(__dirname, 'public'),
      directory: './dist',
    },
    open: false,
    port: 8081,
  },
} as webpack.Configuration);

export default devConfig;
