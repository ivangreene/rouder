const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'rouder.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Rouder'
  }
};
