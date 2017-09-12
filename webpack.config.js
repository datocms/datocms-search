const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJSPlugin());
}

module.exports = {
  entry: {
    base: './src/base.js',
    widget: './src/widget.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['inferno']
          }
        }
      }
    ],
  },
  output: {
    filename: 'datocms-search.[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: "DatoCmsSearch",
    libraryTarget: "umd",
  },
  plugins: plugins
};

