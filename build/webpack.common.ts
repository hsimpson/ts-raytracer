import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const commonConfig: webpack.Configuration = {
  entry: './src/index.tsx',

  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
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

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/textures/**/*',
          to: 'assets/textures/[name][ext]',
        },
        {
          from: '**/*',
          context: path.resolve('src', 'assets', 'models'),
          to: 'assets/models/[path][name][ext]',
        },
        {
          from: './src/raytracer-gpu/shaders/**/*.wgsl',
          to: '[name][ext]',
        },
      ],
    }) as any,
  ],
};

export { commonConfig };
