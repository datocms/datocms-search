const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJSPlugin());
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'datocms-search.js',
    path: path.resolve(__dirname, 'dist'),
    library: "DatoCmsSearch",
    libraryTarget: "umd",
  },
  plugins: plugins
};
