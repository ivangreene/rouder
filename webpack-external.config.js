const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'rouder.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Rouder'
  },
  externals: {
    'path-to-regexp': {
      commonjs: 'path-to-regexp',
      commonjs2: 'path-to-regexp',
      root: 'pathToRegexp'
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
