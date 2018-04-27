/**
 * Created by army on 2017/3/19.
 * For my goddess.
 */

import 'migi-es6-shim';
import 'migi';
import './bridge';
import BigNumber from 'bignumber.js';
import SparkMd5 from 'spark-md5';
import $ from 'anima-yocto-ajax';
import env from './production';
import net from './net';
import util from './util';
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

if(!window.location.origin) {
  window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

$.cookie = function(key, value, options) {
  var days, time, result, decode

  // A key and value were given. Set cookie.
  if (arguments.length > 1 && String(value) !== "[object Object]") {
    // Enforce object
    options = $.extend({}, options)

    if (value === null || value === undefined) options.expires = -1

    if (typeof options.expires === 'number') {
      days = (options.expires * 24 * 60 * 60 * 1000)
      time = options.expires = new Date()

      time.setTime(time.getTime() + days)
    }

    value = String(value)

    return (document.cookie = [
      encodeURIComponent(key), '=',
      options.raw ? value : encodeURIComponent(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '',
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''))
  }

  // Key and possibly options given, get cookie
  options = value || {}

  decode = options.raw ? function (s) { return s } : decodeURIComponent

  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
};

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || function(callback) {
      window.setTimeout(callback, 16.7);
    };
}();

$.AJAX = env.ajax;
window.BigNumber = BigNumber;
window.SparkMd5 = SparkMd5;
window.$ = $;
window.$net = net;
window.$util = util;
