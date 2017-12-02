/**
 * Created by army on 2017/3/19.
 * For my goddess.
 */

import 'migi-es6-shim';
import 'migi';
import './bridge.js';
import $ from 'anima-yocto-ajax';
import env from 'ENV';
import './global.jsx';

import './index.less';

if(/iP(hone|od|ad)/.test(navigator.userAgent)) {
  let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
    version = parseInt(v[1], 10);
  document.documentElement.classList.add('ios');
  if(version >= 8){
    document.documentElement.classList.add('hairlines');
  }
}
else {
  document.documentElement.classList.add('android');
}

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || function(callback) {
      window.setTimeout(callback, 16.7);
    };
}();

$.ajax2 = env.ajax;
window.$ = $;
