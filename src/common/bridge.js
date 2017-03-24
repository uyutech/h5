let bridge = {
  ready: function(cb) {
    cb = cb || function() {};
    console.log(window.JSBridge);
    if(window.JSBridge && window.JSBridge.call) {
      cb();
    }
    else {
      document.addEventListener('JSBridgeReady', cb);
    }
  },
  setTitle: function(s) {
    JSBridge.call('setTitle', s || '');
  }
};

export default bridge;
