/**
 * Created by army on 2017/5/20.
 */

import $ from 'anima-yocto-ajax';
import bridge from './bridge';
import env from 'ENV';

let util = {
  isIPhone: function(){
    return navigator.appVersion.match(/iphone/gi);
  },
  getJSON: function(url, data, success, error, cancelLoading) {
    if (typeof data === 'function') {
      cancelLoading = error;
      error = success;
      success = data;
      data = {};
    }
    jsBridge.userInfo(function(item) {
      data.uid = item.userId;
      error = error || function(){};
      env.ajax(url, data, success, error, cancelLoading);
    });
  }
};

export default util;
