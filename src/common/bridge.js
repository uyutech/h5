/**
 * Created by army on 2017/3/19.
 */

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
  }
};

export default bridge;
