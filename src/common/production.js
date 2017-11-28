/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';

export default {
  ajax: function(url, data, success, error, type, timeout) {
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://circling.com.cn/' + url.replace(/^\//, '');
    }
    console.log('ajax: ' + url + ', ' + JSON.stringify(data));
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
        cache: false,
        crossDomain: true,
        timeout: timeout || 30000,
        type: type || 'get',
        beforeSend: function (xhr) {
          xhr.withCredentials = true;
        },
        success: function (data, state, xhr) {
          console.log('ajax success: ' + url + ', ' + JSON.stringify(data));
          if(!data.success && data.code === 1000) {
            if(jsBridge.isInApp) {
              jsBridge.pushWindow('login.html', {
                transparentTitle: true,
              });
            }
            else {
              location.replace('login.html?goto=' + encodeURIComponent(location.href));
            }
            return;
          }
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
