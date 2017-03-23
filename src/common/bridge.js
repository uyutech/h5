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
  }
};

export default bridge;
