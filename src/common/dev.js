/**
 * Created by army8735 on 2017/9/15.
 */

import migi from 'migi';
import $ from 'anima-yocto-ajax';
import pa from '../../package.json';

// 开发环境在线浏览的时候，因不存在preRender的过程，所以将preExist替换为render，此时就降级为没有预渲染直接即时渲染
if(location.hostname === 'army8735.circling.cc') {
  migi.preExist = migi.render;
}

window.ROOT_DOMAIN = 'http://dev.circling.cc2';

export default {
  ajax: function(url, data, success, error, type, timeout) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://dev.circling.cc2/' + url.replace(/^\//, '');
    }
    data && Object.keys(data).forEach(function(k) {
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
    url += '&version=' + pa.version;
    url += '&app=' + jsBridge.appVersion;
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
          if(data && data.statusText === 'abort') {
            return;
          }
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
