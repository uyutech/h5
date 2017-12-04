/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';

window.ROOT_DOMAIN = 'http://circling.cc';

export default {
  ajax: function(url, data, success, error, type, timeout) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://h5.circling.cc/' + url.replace(/^\//, '');
    }
    Object.keys(data).forEach(function(k) {
      if(data[k] === undefined || data[k] === null) {
        delete data[k];
      }
    });
    if(url.indexOf('?') === -1) {
      url += '?_=' + Date.now();
    }
    else {
      url += '&_=' + Date.now();
    }
    function load() {
      return $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        crossDomain: true,
        timeout: timeout || 30000,
        type: type || 'get',
        // ajax 跨域设置必须加上
        beforeSend: function (xhr) {
          xhr.withCredentials = true;
        },
        success: function (data, state, xhr) {
          success(data, state, xhr);
        },
        error: function (data) {
          console.error('ajax error: ' + url + ', ' + JSON.stringify(data));
          if(!error.__hasExec) {
            error.__hasExec = true;
            error(data || {});
          }
        }
      });
    }
    return load();
  },
};
