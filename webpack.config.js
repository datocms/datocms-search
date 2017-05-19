var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'datocms-search.js',
    path: path.resolve(__dirname, 'dist')
  }
};
