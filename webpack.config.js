const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('[name].css');
const webpack = require("webpack");

module.exports = {
  entry: {
    pre: './src/common/pre.js',
    common: './src/common/index.js',
    blank: './src/common/blank.png',
    redirect: './src/redirect/index.jsx',
    login: './src/login/index.jsx',
    index: './src/index/index.jsx',
    guide: './src/guide/index.jsx',
    step1: './src/guide/step1.jpg',
    step2: './src/guide/step2.jpg',
    works: './src/works/index.jsx',
    author: './src/author/index.jsx',
    search: './src/search/index.jsx'
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
        test: /(\.jpg)|(\.jpeg)|(\.gif)|(\.png)$/,
        use: 'url-loader?limit=10240&name=[path][name].[ext]'
      },
      {
        test: /\.(html?)|(\.mp4)$/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    // }),
    extractLESS
  ],
  resolve: {
    alias: {
      ENV: process.env.NODE_ENV == 'development' ? './development.js' : './production.js',
    },
  },
};
