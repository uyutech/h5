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

var CONFIRM_HASH = {};

let jsBridge = {
  ready: function(cb) {
    cb = cb || function() {};
    if(window.JSBridge && window.JSBridge.call) {
      cb();
    }
    else {
      document.addEventListener('JSBridgeReady', cb);
    }
  },
  on: function(name, cb) {
    cb = cb || function() {};
    document.addEventListener(name, cb);
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
        message: s || '加载中...',
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
  },
  alert: function(s) {
    if(isString(s)) {
      s = {
        title: '',
        message: s || '消息'
      };
    }
    else {
      s = s || {};
      s.title = s.title || '';
      s.message = s.message || '消息';
    }
    JSBridge.call('alert', s);
  },
  confirm: function(s, callback) {
    if(isString(s)) {
      s = {
        title: '',
        message: s || '确认吗？'
      };
    }
    else {
      s = s || {};
      s.title = s.title || '';
      s.message = s.message || '确认吗？';
    }
    var uid = Math.random() + '' + Date.now();
    CONFIRM_HASH[uid] = callback || function() {};
    s.uid = uid;
    JSBridge.call('confirm', s);
  },
  confirmCb: function(uid, res) {
    var callback = CONFIRM_HASH[uid] || function() {};
    callback(res);
  },
  hideBackButton: function() {
    JSBridge.call('hideBackButton');
  },
  showBackButton: function() {
    JSBridge.call('showBackButton');
  },
  back: function() {
    // 复用back event，模拟没有调用preventDefault()方法
    JSBridge.call('back', { prevent: false });
  }
};

window.jsBridge = jsBridge;

export default jsBridge;
