const webpack = require("webpack");

module.exports = {
  entry: {
    index: './src/index/pre.jsx',
    works: './src/works/pre.jsx',
    author: './src/author/pre.jsx',
    circle: './src/circle/pre.jsx',
    sub_post: './src/sub_post/pre.jsx',
    post: './src/post/pre.jsx',
    sub_comment: './src/sub_comment/pre.jsx',
    user: './src/user/pre.jsx',
    my_relation: './src/my_relation/pre.jsx',
    my_message: './src/my_message/pre.jsx',
    my_comment: './src/my_comment/pre.jsx',
    my_post: './src/my_post/pre.jsx',
    my_favor: './src/my_favor/pre.jsx',
    my_address: './src/my_address/pre.jsx',
    my_download: './src/my_download/pre.jsx',
    my_dialog: './src/my_dialog/pre.jsx',
    // allworks: './src/allworks/pre.jsx',
    // allalbums: './src/allalbums/pre.jsx',
    // allauthors: './src/allauthors/pre.jsx',
    all_circles: './src/all_circles/pre.jsx',
    mall: './src/mall/pre.jsx',
    mall_prize: './src/mall_prize/pre.jsx',
    mall_express: './src/mall_express/pre.jsx',
    tag: './src/tag/pre.jsx',
    // more_tag: './src/more_tag/pre.jsx',
    passport: './src/passport/pre.jsx',
    phone: './src/phone/pre.jsx',
    record: './src/record/pre.jsx',
    search: './src/search/pre.jsx',
    music_album: './src/music_album/pre.jsx',
    image_album: './src/image_album/pre.jsx',
    config: './src/config/pre.jsx',
    send_letter: './src/send_letter/pre.jsx',
    // shield: './src/shield/pre.jsx',
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
