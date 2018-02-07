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
      this.call('popWindow', JSON.stringify(data));
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
    if(this.isInApp) {
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
        s.cancelable = s.cancelable || true;
      }
      this.call('showLoading', s);
    }
  },
  hideLoading: function() {
    if(this.isInApp) {
      this.call('hideLoading');
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
        title: '确认吗？',
        message: s || '',
      };
    }
    else {
      s = s || {};
      s.title = s.title || '确认吗？';
      s.message = s.message || '';
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
  prompt: function(s, cb) {
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
    if(this.isInApp) {
      this.call('prompt', s, cb);
    }
    else {
      let res = window.prompt(s.message, s.value);
      cb({
        success: true,
        value: res,
      });
    }
  },
  hideBackButton: function() {
    if(this.isInApp) {
      this.call('hideBackButton');
    }
  },
  showBackButton: function() {
    if(this.isInApp) {
      this.call('showBackButton');
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
  login: function(url, data, cb) {
    if(this.isInApp) {
      this.call('login', {
        url,
        data,
      }, cb);
    }
  },
  loginOut: function(cb) {
    if(this.isInApp) {
      this.call('loginOut', cb);
    }
  },
  getPreference: function(key, cb) {
    this.getCache(key, cb);
  },
  setPreference: function(key, value, cb) {
    this.setCache(key, value, cb);
  },
  delPreference: function(key, cb) {
    this.delCache(key, cb);
  },
  setCache: function(key, value, cb) {
    cb = cb || function() {};
    let native = this.isInApp;
    if(Array.isArray(key)) {
      let temp = [];
      for(let i = 0, len = key.length; i < len; i++) {
        let item = Array.isArray(value) ? value[i] : value;
        if(item === undefined) {
          temp[i] = null;
        }
        else if(isString(item) && native) {
          temp[i] = JSON.stringify(item);
        }
        else {
          temp[i] = item;
        }
      }
      temp.splice(key.length);
      if(native) {
        this.call('setCache', { key, value: temp, isArray: true }, cb);
      }
      else {
        key.forEach(function(item, i) {
          if(temp[i] === null) {
            delete localStorage[item];
          }
          else {
            localStorage[item] = JSON.stringify(temp[i]);
          }
        });
        cb();
      }
    }
    else {
      if(value === undefined) {
        value = null;
      }
      if(this.isInApp) {
        if(isString(value)) {
          value = JSON.stringify(value);
        }
        this.call('setCache', { key, value }, cb);
      }
      else {
        if(value === null) {
          delete localStorage[key];
        }
        else {
          localStorage[key] = JSON.stringify(value);
        }
        cb && cb();
      }
    }
  },
  getCache: function(key, cb) {
    if(Array.isArray(key)) {
      if(this.isInApp) {
        this.call('getCache', { key, isArray: true }, cb);
      }
      else {
        let res = [];
        key.forEach(function(item) {
          res.push(JSON.parse(localStorage[item] || 'null'));
        });
        cb && cb.apply(null, res);
      }
    }
    else {
      if(this.isInApp) {
        this.call('getCache', { key }, cb);
      }
      else {
        let s = localStorage[key];
        cb && cb(JSON.parse(s || 'null'));
      }
    }
  },
  delCache: function(key, cb) {
    if(Array.isArray(key)) {
      let value = [];
      for(let i = 0, len = key.length; i < len; i++) {
        value.push(null);
      }
      if(this.isInApp) {
        this.call('setCache', { key, value, isArray: true }, callback);
      }
      else {
        key.forEach(function(item) {
          delete localStorage[item];
        });
        cb && cb();
      }
    }
    else {
      if(this.isInApp) {
        this.call('setCache', { key, value: null }, cb);
      }
      else {
        delete localStorage[key];
        cb && cb();
      }
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
    if(this.isInApp) {
      this.call('moveTaskToBack');
    }
  },
  openUri: function(uri) {
    if(this.isInApp) {
      this.call('openUri', uri);
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
    if(this.isInApp) {
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
      this.call('notify', {
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
    if(this.isInApp) {
      if(isString(data)) {
        data = {
          url: data,
        };
      }
      if(!data.name) {
        data.name = data.url;
      }
      this.call('download', data);
      this.toast('开始下载，请关注通知栏进度');
    }
  },
  networkInfo: function(cb) {
    if(this.isInApp) {
      this.call('networkInfo', cb);
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
