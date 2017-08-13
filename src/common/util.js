/**
 * Created by army on 2017/5/20.
 */

import env from 'ENV';
import sort from './sort';

let util = {
  isIPhone: function(){
    return navigator.appVersion.match(/iphone/gi);
  },
  getJSON: function(url, data, success, error) {
    if (typeof data === 'function') {
      error = success;
      success = data;
      data = {};
    }
    error = error || function() {};
    env.ajax(url, data, success, error, 'get');
    // jsBridge.userInfo(function(item) {
    //   data.uid = item.userId;
    //   env.ajax(url, data, success, error);
    // });
  },
  postJSON: function(url, data, success, error) {
    if (typeof data === 'function') {
      error = success;
      success = data;
      data = {};
    }
    error = error || function() {};
    env.ajax(url, data, success, error, 'post');
  },
  sort
};

export default util;
