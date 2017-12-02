const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('[name].css');
const webpack = require("webpack");

module.exports = {
  entry: {
    common: './src/common/index.js',
    // redirect: './src/redirect/index.jsx',
    // login: './src/login/index.jsx',
    index: './src/index/index.jsx',
    // guide: './src/guide/index.jsx',
    // step1: './src/guide/step1.jpg',
    // step2: './src/guide/step2.jpg',
    // works: './src/works/index.jsx',
    // author: './src/author/index.jsx',
    // search: './src/search/index.jsx'
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
        use: extractLESS.extract([{
          loader: 'css-loader', options: { minimize: true }
        }, 'autoprefixer-loader', 'less-loader'])
      },
      {
        test: /(\.jpg)|(\.jpeg)|(\.gif)|(\.png)|(\.ico)$/,
        use: 'url-loader?limit=10240&name=[path][name].[ext]'
      },
      // {
      //   test: /(\.jpg)|(\.jpeg)|(\.gif)|(\.png)$/,
      //   use: 'file-loader?name=[path][name].[ext]'
      // },
      {
        test: /\.(html?)|(\.mp4)$/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    extractLESS
  ],
  resolve: {
    alias: {
      ENV: process.env.NODE_ENV === 'mock'
        ? './mock.js'
        : (process.env.NODE_ENV === 'production'
          ? './production.js'
          : './dev.js'),
    },
  },
};
