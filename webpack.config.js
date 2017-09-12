const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'rouder.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Rouder'
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
