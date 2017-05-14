/**
 * Created by army on 2017/3/19.
 */

let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}
let isString = isType('String');

let CONFIRM_HASH = {};

let jsBridge = {
  ready: function(cb) {
    cb = cb || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      cb();
    }
    else {
      document.addEventListener('ZhuanQuanJSBridgeReady', cb);
    }
  },
  on: function(name, cb) {
    cb = cb || function() {};
    document.addEventListener(name, cb);
  },
  setTitle: function(s) {
    ZhuanQuanJSBridge.call('setTitle', s || '');
  },
  pushWindow: function(s) {
    s = s.trim();
    if(s) {
      if(/^\w+:\/\//i.test(s)) {}
      else if(/^\//.test(s)) {
        s = location.protocol + location.host + s;
      }
      else {
        let i = location.href.lastIndexOf('/');
        s = location.href.slice(0, i) + '/' + s;
      }
      ZhuanQuanJSBridge.call('pushWindow', s);
    }
  },
  popWindow: function(data) {
    ZhuanQuanJSBridge.call('popWindow', JSON.stringify(data));
  },
  toast: function(s) {
    ZhuanQuanJSBridge.call('toast', s);
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
    ZhuanQuanJSBridge.call('showLoading', s);
  },
  hideLoading: function() {
    ZhuanQuanJSBridge.call('hideLoading');
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
    ZhuanQuanJSBridge.call('alert', s);
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
    let uid = Math.random() + '' + Date.now();
    CONFIRM_HASH[uid] = callback || function() {};
    s.uid = uid;
    ZhuanQuanJSBridge.call('confirm', s);
  },
  confirmCb: function(uid, res) {
    let callback = CONFIRM_HASH[uid] || function() {};
    callback(res);
  },
  hideBackButton: function() {
    ZhuanQuanJSBridge.call('hideBackButton');
  },
  showBackButton: function() {
    ZhuanQuanJSBridge.call('showBackButton');
  },
  back: function() {
    // 复用back event，模拟没有调用preventDefault()方法
    ZhuanQuanJSBridge.call('back', { prevent: false });
  }
};

window.jsBridge = jsBridge;
export default jsBridge;
