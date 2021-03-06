const webpack = require("webpack");

module.exports = {
  entry: {
    head: './src/common/head.png',
    blank: './src/common/blank.png',
  },
  output: {
    path: __dirname + '/www',
    filename: '[name]._'
  },
  devServer: {
    contentBase: './www'
  },
  module: {
    rules: [
      {
        test: /(\.jpg)|(\.jpeg)|(\.gif)|(\.png)|(\.ico)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
    ]
  },
};
