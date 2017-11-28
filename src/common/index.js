/**
 * Created by army on 2017/3/19.
 * For my goddess.
 */

import 'migi-es6-shim';
import 'migi';
import $ from 'anima-yocto-ajax';
import './global.jsx';
import './bridge.js';

import './index.less';

if(/iP(hone|od|ad)/.test(navigator.userAgent)) {
  var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
    version = parseInt(v[1], 10);
  if(version >= 8){
    document.documentElement.classList.add('hairlines');
  }
}

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || function(callback) {
      window.setTimeout(callback, 16.7);
    };
}();

window.$ = $;
