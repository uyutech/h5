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
let ua = navigator.userAgent;

let jsBridge = {
  isInApp: /app\/ZhuanQuan/.test(ua),
  ready: function(cb) {
    cb = cb || function() {};
    if(this.isInApp) {
      if (window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        cb();
      }
      else {
        document.addEventListener('ZhuanQuanJSBridgeReady', cb);
      }
    }
    else {
      cb();
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
  setSubTitle: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setSubTitle', s || '');
    }
  },
  pushWindow: function(url, params) {
    if(this.isInApp) {
      if (window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        url = url.trim();
        if (url) {
          if (/^\w+:\/\//i.test(url)) {
          }
          else if (/^\//.test(url)) {
            url = location.protocol + location.host + url;
          }
          else {
            let i = location.href.lastIndexOf('/');
            url = location.href.slice(0, i) + '/' + url;
          }
          params = params || {};
          ZhuanQuanJSBridge.call('pushWindow', {
            url,
            params,
          });
        }
      }
    }
    else {
      location.href = url;
    }
  },
  popWindow: function(data) {
    if(this.isInApp) {
      if (window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        ZhuanQuanJSBridge.call('popWindow', JSON.stringify(data));
      }
    }
    else {
      history.go(-1);
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
    if(this.isInApp) {
      // 复用back event，模拟没有调用preventDefault()方法
      if (window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        ZhuanQuanJSBridge.call('back', {prevent: false});
      }
    }
    else {
      history.go(-1);
    }
  },
  userInfo: function(callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('userInfo', callback);
    }
    else {
      callback();
    }
  },
  swipeRefresh: function(state) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('swipeRefresh', state);
    }
  },
  loginWeibo: function(callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('loginWeibo', callback);
    }
  },
  getPreference: function(key, callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('getPreference', key, callback);
    }
  },
  setPreference: function(key, value, callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setPreference', { key, value }, callback);
    }
  },
  showOptionMenu: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('showOptionMenu');
    }
  },
  hideOptionMenu: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('hideOptionMenu');
    }
  },
  setOptionMenu: function(data) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setOptionMenu', data);
    }
  }
};

window.jsBridge = jsBridge;
export default jsBridge;
