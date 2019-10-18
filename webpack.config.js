const webpack = require('webpack');
const path = require('path');

module.exports = ({ mode }) => ({
  entry: path.resolve('./src/index.ts'),
  mode,
  output: {
    filename: './index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs'
  },
  resolve: {

    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {test: /\.ts(x?)$/, loader: "ts-loader"}
    ]
  }
});