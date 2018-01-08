const webpack = require("webpack");

module.exports = {
  entry: {
    index: './src/index/pre.jsx',
    works: './src/works/pre.jsx',
    author: './src/author/pre.jsx',
    circle: './src/circle/pre.jsx',
    subpost: './src/subpost/pre.jsx',
    post: './src/post/pre.jsx',
    subcomment: './src/subcomment/pre.jsx',
    user: './src/user/pre.jsx',
    relation: './src/relation/pre.jsx',
    message: './src/message/pre.jsx',
    mypost: './src/mypost/pre.jsx',
    myfavor: './src/myfavor/pre.jsx',
    allworks: './src/allworks/pre.jsx',
    allalbums: './src/allalbums/pre.jsx',
    allauthors: './src/allauthors/pre.jsx',
    allcircles: './src/allcircles/pre.jsx',
    private: './src/private/pre.jsx',
    mall: './src/mall/pre.jsx',
    mall_new: './src/mall_new/pre.jsx',
    mall_wait: './src/mall_wait/pre.jsx',
    tag: './src/tag/pre.jsx',
    more_tag: './src/more_tag/pre.jsx',
    passport: './src/passport/pre.jsx',
    phone: './src/phone/pre.jsx',
  },
  output: {
    path: __dirname + '/www',
    filename: '[name].pre.js',
    libraryTarget: 'commonjs'
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
    ]
  },
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
