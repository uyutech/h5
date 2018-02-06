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
let isFunction = isType('Function');
let ua = navigator.userAgent;
let appVersion = '';
if(/ app\/ZhuanQuan\/([\d.]+)/.test(ua)) {
  appVersion = / app\/ZhuanQuan\/([\d.]+)/.exec(ua)[1];
}
let ios = /iP(hone|od|ad)/.test(ua);

let jsBridge = {
  isInApp: / app\/ZhuanQuan/.test(ua),
  appVersion: appVersion,
  android: !ios,
  ios,
  call: function(key, value, cb) {
    if(isFunction(value)) {
      cb = value;
      value = null;
    }
    let clientId = new Date().getTime() + '' + Math.random();
    if(cb && window.ZhuanQuanJsBridge) {
      ZhuanQuanJsBridge.record(clientId, cb);
    }
    ZhuanQuanJsBridgeNative.call(clientId, key, JSON.stringify(value));
  },
  ready: function(cb) {
    cb = cb || function() {};
    if(this.isInApp) {
      if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        jsBridge.android = ZhuanQuanJSBridge.android;
        jsBridge.ios = ZhuanQuanJSBridge.ios;
        cb();
      }
      else {
        document.addEventListener('ZhuanQuanJSBridgeReady', function() {
          jsBridge.android = ZhuanQuanJSBridge.android;
          jsBridge.ios = ZhuanQuanJSBridge.ios;
          cb();
        });
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
  off: function(name, cb) {
    if(cb) {
      document.removeEventListener(name, cb);
    }
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
  setTitleBgColor: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setTitleBgColor', s || '');
    }
  },
  pushWindow: function(url, params) {
    url = url.trim();
    if(this.isInApp) {
      if(url) {
        if (/^\w+:\/\//i.test(url)) {
        }
        else if (/^\//.test(url)) {
          url = location.origin + url;
        }
        else {
          let i = location.href.lastIndexOf('/');
          url = location.href.slice(0, i) + '/' + url;
        }
        params = params || {};
        this.call('pushWindow', {
          url,
          params,
        });
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
    if(this.isInApp) {
      this.call('toast', s);
    }
    else {
      console.log(s);
    }
  },
  showLoading: function(s) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
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
    }
  },
  hideLoading: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('hideLoading');
    }
  },
  alert: function(s) {
    if(isString(s)) {
      s = {
        title: '',
        message: s || '',
      };
    }
    else {
      s = s || {};
      s.title = s.title || '';
      s.message = s.message || '';
    }
    if(this.isInApp) {
      this.call('alert', s);
    }
    else {
      alert(s.message);
    }
  },
  confirm: function(s, cb) {
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
    if(this.isInApp) {
      this.call('confirm', s, cb);
    }
    else {
      if(window.confirm(s.message)) {
        cb(true);
      }
    }
  },
  prompt: function(s, callback) {
    if(isString(s)) {
      s = {
        message: '请输入',
        value: s,
      };
    }
    else {
      s = s || {};
      s.message = s.message || '请输入';
      s.value = s.value || '';
    }
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('prompt', s, callback);
    }
    else {
      let res = window.prompt(s.message, s.value);
      callback({
        success: true,
        value: res,
      });
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
      this.call('back');
    }
    else {
      history.go(-1);
    }
  },
  refreshState: function(state) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('refreshState', state);
    }
  },
  refresh: function() {
    // 复用refresh event，模拟没有调用preventDefault()方法
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('refresh', { prevent: false });
    }
    else {
      location.reload(true);
    }
  },
  loginWeibo: function(cb) {
    if(this.isInApp) {
      this.call('loginWeibo', cb);
    }
    // if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
    //   ZhuanQuanJSBridge.call('loginWeibo', function(res) {
    //     callback(res);
    //   });
    // }
  },
  weiboLogin: function(data, callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('weiboLogin', data, function(res) {
        callback(res);
      });
    }
  },
  login: function(url, data, callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('login', {
        url,
        data,
      }, function(res) {
        callback(res);
      });
    }
  },
  loginOut: function(callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('loginOut', callback);
    }
  },
  getPreference: function(key, callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('getPreference', key, callback);
    }
    else {
      let s = localStorage[key];
      callback(JSON.parse(s || 'null'));
    }
  },
  setPreference: function(key, value, callback) {
    callback = callback || function() {};
    if(value === undefined) {
      value = null;
    }
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if(isString(value)) {
        value = JSON.stringify(value);
      }
      ZhuanQuanJSBridge.call('setPreference', { key, value }, callback);
    }
    else {
      if(value === null) {
        delete localStorage[key];
      }
      else {
        localStorage[key] = JSON.stringify(value);
      }
      callback();
    }
  },
  delPreference: function(key, callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setPreference', { key, value: null }, callback);
    }
    else {
      delete localStorage[key];
      callback();
    }
  },
  setCache: function(key, value, callback) {
    callback = callback || function() {};
    let native = window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call;
    if(Array.isArray(key) && Array.isArray(value)) {
      for(let i = 0, len = key.length; i < len; i++) {
        let item = value[i];
        if(item === undefined) {
          value[i] = null;
        }
        else if(isString(item) && native) {
          value[i] = JSON.stringify(item);
        }
      }
      value.splice(key.length);
      if(native) {
        ZhuanQuanJSBridge.call('setCache', { key, value, isArray: true }, callback);
      }
      else {
        key.forEach(function(item, i) {
          if(value[i] === null) {
            delete localStorage[item];
          }
          else {
            localStorage[item] = JSON.stringify(value[i]);
          }
        });
        callback();
      }
    }
    else {
      if(value === undefined) {
        value = null;
      }
      if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        if(isString(value)) {
          value = JSON.stringify(value);
        }
        ZhuanQuanJSBridge.call('setCache', { key, value }, callback);
      }
      else {
        if(value === null) {
          delete localStorage[key];
        }
        else {
          localStorage[key] = JSON.stringify(value);
        }
        callback();
      }
    }
  },
  getCache: function(key, callback) {
    callback = callback || function() {};
    if(Array.isArray(key)) {
      if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        ZhuanQuanJSBridge.call('getCache', { key, isArray: true }, callback);
      }
      else {
        let res = [];
        key.forEach(function(item) {
          res.push(JSON.parse(localStorage[item] || 'null'));
        });
        callback.apply(null, res);
      }
    }
    else {
      if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        ZhuanQuanJSBridge.call('getCache', { key }, callback);
      }
      else {
        let s = localStorage[key];
        callback(JSON.parse(s || 'null'));
      }
    }
  },
  delCache: function(key, callback) {
    callback = callback || function() {};
    if(Array.isArray(key)) {
      let value = [];
      for(let i = 0, len = key.length; i < len; i++) {
        value.push(null);
      }
      if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
        ZhuanQuanJSBridge.call('setCache', { key, value, isArray: true }, callback);
      }
      else {
        key.forEach(function(item) {
          delete localStorage[item];
        });
        callback();
      }
    }
    else {
      delete localStorage[item];
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
      if(isString(data)) {
        data = {
          text: data,
        };
      }
      ZhuanQuanJSBridge.call('setOptionMenu', data);
    }
  },
  moveTaskToBack: function() {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('moveTaskToBack');
    }
  },
  openUri: function(uri) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('openUri', uri);
    }
    else {
      window.open(uri);
    }
  },
  setCookie: function(key, value, callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('setCookie', { key, value }, callback);
    }
    else {
      callback();
    }
  },
  notify: function(data, params) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if(isString(data)) {
        data = {
          title: data,
        };
      }
      if(data.url) {
        if (/^\w+:\/\//i.test(data.url)) {
        }
        else if (/^\//.test(data.url)) {
          data.url = location.origin + data.url;
        }
        else {
          let i = location.href.lastIndexOf('/');
          data.url = location.href.slice(0, i) + '/' + data.url;
        }
      }
      ZhuanQuanJSBridge.call('notify', {
        data,
        params,
      });
    }
  },
  album: function(data, callback) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if(isFunction(data)) {
        callback = data;
        data = {
          num: 1
        };
      }
      callback = callback || function() {};
      ZhuanQuanJSBridge.call('album', data, function(res) {
        callback(res);
      });
    }
  },
  download: function(data) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if(isString(data)) {
        data = {
          url: data,
        };
      }
      if(!data.name) {
        data.name = data.url;
      }
      ZhuanQuanJSBridge.call('download', data);
      jsBridge.toast('开始下载，请关注通知栏进度');
    }
  },
  networkInfo: function(callback) {
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('networkInfo', function(res) {
        callback(res);
      });
    }
  },
  media: function(data, callback) {
    data = data || {};
    callback = callback || function() {};
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      ZhuanQuanJSBridge.call('media', data, function(res) {
        callback(res);
      });
    }
  },
  setBack: function(data) {
    if(window.ZhuanQuanJSBridge && window.ZhuanQuanJSBridge.call) {
      if(isString(data)) {
        data = {
          img: data,
        };
      }
      ZhuanQuanJSBridge.call('setBack', data);
    }
  },
};

window.jsBridge = jsBridge;
export default jsBridge;
