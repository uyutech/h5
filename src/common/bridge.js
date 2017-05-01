/**
 * Created by army on 2017/3/19.
 */

var toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}
var isString = isType('String');

let bridge = {
  ready: function(cb) {
    cb = cb || function() {};
    if(window.JSBridge && window.JSBridge.call) {
      cb();
    }
    else {
      document.addEventListener('JSBridgeReady', cb);
    }
  },
  setTitle: function(s) {
    JSBridge.call('setTitle', s || '');
  },
  pushWindow: function(s) {
    s = s.trim();
    if(s) {
      if(/^\w+:\/\//i.test(s)) {}
      else if(/^\//.test(s)) {
        s = location.protocol + location.host + s;
      }
      else {
        var i = location.href.lastIndexOf('/');
        s = location.href.slice(0, i) + '/' + s;
      }
      JSBridge.call('pushWindow', s);
    }
  },
  popWindow: function(data) {
    JSBridge.call('popWindow', JSON.stringify(data));
  },
  toast: function(s) {
    JSBridge.call('toast', s);
  },
  showLoading: function(s) {
    if(isString(s)) {
      s = {
        title: '',
        message: s,
        cancelable: true
      };
    }
    else {
      s = s || {};
      s.title = s.title || '';
      s.message = s.message || '加载中...';
      if(s.cancelable === undefined) {
        s.cancelable = true;
      }
    }
    JSBridge.call('showLoading', s);
  },
  hideLoading: function() {
    JSBridge.call('hideLoading');
  }
};

export default bridge;
