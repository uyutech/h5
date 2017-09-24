/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';

export default {
  ajax: function(url, data, success, error, type) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://circling.cc/' + url.replace(/^\//, '');
    }
    console.log('ajax: ' + url + ', ' + JSON.stringify(data));
    function load() {
      return $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        cache: false,
        crossDomain: true,
        timeout: 6000,
        type: type || 'get',
        // ajax 跨域设置必须加上
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
            // jsBridge.ready(function() {
            //   if(!init) {
            //     init = true;
            //     jsBridge.on('resume', function() {
            //       //
            //     });
            //   }
            //   jsBridge.pushWindow('login.html', {
            //     transparentTitle: true,
            //   });
            // });
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
