/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

let net = {
  getJSON: function(url, data, success, error, type, timeout) {
    if(typeof data === 'function') {
      timeout = error;
      error = success;
      success = data;
      data = {};
    }
    if(typeof success !== 'function') {
      success = function() {};
      timeout = error;
      error = success;
    }
    if(typeof error !== 'function') {
      timeout = error;
      error = function() {};
    }
    return $.AJAX(url, data, success, error, 'GET', timeout);
  },
  postJSON: function(url, data, success, error, type, timeout) {
    if(typeof data === 'function') {
      timeout = error;
      error = success;
      success = data;
      data = {};
    }
    if(typeof success !== 'function') {
      success = function() {};
      timeout = error;
      error = success;
    }
    if(typeof error !== 'function') {
      timeout = error;
      error = function() {};
    }
    return $.AJAX(url, data, success, error, 'POST', timeout);
  },
  stats: function(url) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = window.ROOT_DOMAIN + '/' + url.replace(/^\//, '');
    }
    let img = new Image();
    img.style.position = 'absolute';
    img.style.display = 'none';
    img.src = url;
    img.onload = function() {
      document.body.removeChild(img);
    };
    img.onerror = function() {
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
  },
  statsAction: function(actionId, param) {
    jsBridge.getPreference('UUID', function(res) {
      res = res || '';
      let url = '/h5/stats/action?actionId=' + encodeURIComponent(actionId)
        + '&uuid=' + encodeURIComponent(res)
        + (param ? '&param=' + encodeURIComponent(JSON.stringify(param)) : '')
        + '&_=' + Date.now() + Math.random();
      net.stats(url);
    });
  },
};

export default net;
