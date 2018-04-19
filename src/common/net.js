/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

let net = {
  getJSON: function(url, data, success, error, type, timeout) {
    if(typeof data === 'function') {
      timeout = error;
      error = success;
      success = data;
      data = {};
    }
    if(typeof success !== 'function') {
      success = function() {};
      timeout = error;
      error = success;
    }
    if(typeof error !== 'function') {
      timeout = error;
      error = function() {};
    }
    return $.AJAX(url, data, success, error, 'GET', timeout);
  },
  postJSON: function(url, data, success, error, type, timeout) {
    if(typeof data === 'function') {
      timeout = error;
      error = success;
      success = data;
      data = {};
    }
    if(typeof success !== 'function') {
      success = function() {};
      timeout = error;
      error = success;
    }
    if(typeof error !== 'function') {
      timeout = error;
      error = function() {};
    }
    return $.AJAX(url, data, success, error, 'POST', timeout);
  },
};

export default net;
