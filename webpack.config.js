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
    sub_post: './src/sub_post/index.jsx',
    post: './src/post/index.jsx',
    sub_comment: './src/sub_comment/index.jsx',
    user: './src/user/index.jsx',
    my_relation: './src/my_relation/index.jsx',
    my_message: './src/my_message/index.jsx',
    my_post: './src/my_post/index.jsx',
    my_favor: './src/my_favor/index.jsx',
    my_address: './src/my_address/index.jsx',
    // allworks: './src/allworks/index.jsx',
    // allalbums: './src/allalbums/index.jsx',
    // allauthors: './src/allauthors/index.jsx',
    all_circles: './src/all_circles/index.jsx',
    mall: './src/mall/index.jsx',
    mall_prize: './src/mall_prize/index.jsx',
    mall_express: './src/mall_express/index.jsx',
    tag: './src/tag/index.jsx',
    more_tag: './src/more_tag/index.jsx',
    passport: './src/passport/index.jsx',
    phone: './src/phone/index.jsx',
    guide: './src/guide/index.jsx',
    playlist: './src/playlist/index.jsx',
    search: './src/search/index.jsx',
    music_album: './src/music_album/index.jsx',
    image_album: './src/image_album/index.jsx',
    config: './src/config/index.jsx',
    shield: './src/shield/index.jsx',
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
        use: 'url-loader?limit=1&name=[hash].[ext]'
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
