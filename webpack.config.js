const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('[name].css');
const webpack = require("webpack");

module.exports = {
  entry: {
    common: './src/common/index.js',
    index: './src/index/index.jsx',
    works: './src/works/index.jsx',
    circle: './src/circle/index.jsx',
    author: './src/author/index.jsx',
    subpost: './src/subpost/index.jsx',
    post: './src/post/index.jsx',
    subcomment: './src/subcomment/index.jsx',
    user: './src/user/index.jsx',
    relation: './src/relation/index.jsx',
    message: './src/message/index.jsx',
    mypost: './src/mypost/index.jsx',
    myfavor: './src/myfavor/index.jsx',
    // allworks: './src/allworks/index.jsx',
    // allalbums: './src/allalbums/index.jsx',
    // allauthors: './src/allauthors/index.jsx',
    allcircles: './src/allcircles/index.jsx',
    private: './src/private/index.jsx',
    mall: './src/mall/index.jsx',
    mall_new: './src/mall_new/index.jsx',
    mall_wait: './src/mall_wait/index.jsx',
    tag: './src/tag/index.jsx',
    more_tag: './src/more_tag/index.jsx',
    passport: './src/passport/index.jsx',
    phone: './src/phone/index.jsx',
    guide: './src/guide/index.jsx',
    playlist: './src/playlist/index.jsx',
    search: './src/search/index.jsx',
    music: './src/music/index.jsx',
    image: './src/image/index.jsx',
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
        use: extractLESS.extract(['css-loader', 'autoprefixer-loader', 'less-loader'])
      },
      {
        test: /(\.jpg)|(\.jpeg)|(\.gif)|(\.png)|(\.ico)|(\.webp)$/,
        use: 'url-loader?limit=1&name=[path][name].[ext]'
      },
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
    },
  },
};
