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
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setTitle', s || '');
    }
  },
  pushWindow: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
    s = s.trim();
    if(s) {
      if (/^\w+:\/\//i.test(s)) {
      }
      else if (/^\//.test(s)) {
        s = location.protocol + location.host + s;
      }
      else {
        let i = location.href.lastIndexOf('/');
        s = location.href.slice(0, i) + '/' + s;
      }
      ZhuanQuanJSBridge.call('pushWindow', s);
    }
    }
  },
  popWindow: function(data) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('popWindow', JSON.stringify(data));
    }
  },
  toast: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('toast', s);
    }
  },
  showLoading: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if (isString(s)) {
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
        if (s.cancelable === undefined) {
          s.cancelable = true;
        }
      }
      ZhuanQuanJSBridge.call('showLoading', s);
    }
  },
  hideLoading: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('hideLoading');
    }
  },
  alert: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if (isString(s)) {
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
    }
  },
  confirm: function(s, callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if (isString(s)) {
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
      ZhuanQuanJSBridge.call('confirm', s, callback);
    }
  },
  hideBackButton: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('hideBackButton');
    }
  },
  showBackButton: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('showBackButton');
    }
  },
  back: function() {
    // 复用back event，模拟没有调用preventDefault()方法
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('back', { prevent: false });
    }
  },
  userInfo: function(callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('userInfo', callback);
    }
  },
};

window.jsBridge = jsBridge;
export default jsBridge;
