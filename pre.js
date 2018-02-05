/**
 * Created by army8735 on 2017/12/2.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const glob = require('glob');
const migi = require('migi');

const config = require('./webpack.pre');

let flag = '<div id="page">';

Object.keys(config.entry).forEach(function(item) {
  migi.resetUid();
  let js = require('./www/' + item + '.pre.js');
  let html = './www/' + item + '.html';
  let s = fs.readFileSync(html, { encoding: 'utf-8' });
  let i = s.indexOf(flag);
  if(i > -1) {
    s = s.slice(0, i + flag.length) + (js.default || '') + s.slice(i + flag.length);
  }
  fs.writeFileSync(html, s, { encoding: 'utf-8' });
});

glob('./www/*.pre.js', function(err, files) {
  files.forEach(function(item) {
    fs.unlinkSync(item);
  });
});
glob('./www/*._', function(err, files) {
  files.forEach(function(item) {
    fs.unlinkSync(item);
  });
});
