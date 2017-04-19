const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('[name].css');

module.exports = {
  entry: {
    common: './src/common/index.js',
    index: './src/main/index.jsx',
    guide: './src/guide/index.jsx',
    step1: './src/guide/step1.jpg',
  },
  output: {
    path: __dirname + '/www',
    filename: '[name].js'
  },
  devServer: {
    contentBase: './www'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          },
          {
            loader: 'migi-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          }
        ]
      },
      {
        test: /\.less$/,
        use: extractLESS.extract([ 'css-loader', 'autoprefixer-loader', 'less-loader' ])
      },
      {
        test: /\.(html?)|(\.jpg)|(\.jpeg)|(\.gif)|(\.png)$/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    extractLESS
  ]
};
