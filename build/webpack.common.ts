import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SpirVCompilerPlugin from './spirvcompilerplugin';
import WatchExternalFilesPlugin from 'webpack-watch-files-plugin';

const commonConfig: webpack.Configuration = {
  entry: './src/index.tsx',

  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new SpirVCompilerPlugin({
      compilerOptions: '-o',
      inputFiles: [
        './src/raytracer-gpu/shaders/raytracer.comp',
        './src/raytracer-gpu/shaders/renderer.vert',
        './src/raytracer-gpu/shaders/renderer.frag',
      ],
    }),
    new WatchExternalFilesPlugin({
      files: [
        './src/raytracer-gpu/shaders/**/*.comp',
        './src/raytracer-gpu/shaders/*.vert',
        './src/raytracer-gpu/shaders/*.frag',
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/textures/*.*',
          to: 'assets/textures',
          flatten: true,
        },
      ],
    }),
  ],
};

export { commonConfig };
