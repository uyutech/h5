/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';
import bridge from './bridge';

export default {
  ajax: function(url, data, success, error, type) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://192.168.100.156/' + url.replace(/^\//, '');
      // url = 'http://circling.cc/' + url.replace(/^\//, '');
      // url = 'http://120.26.95.178:8088/' + url.replace(/^\//, '');
    }
    // if (!cancelLoading) {
    //   bridge.showLoading();
    // }
    console.log('ajax: ' + url + ', ' + JSON.stringify(data));
    return $.ajax({
      url: url,
      data: data,
      dataType: 'json',
      cache: false,
      crossDomain: true,
      timeout: 6000,
      type: type || 'get',
      // ajax 跨域设置必须加上
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      },
      success: function(data, state, xhr) {
        // if(!cancelLoading) {
        //   // ios下面进入页面的时候loading一直不消失，加一个延时处理
        //   setTimeout(function() {
        //     bridge.hideLoading();
        //   }, 20);
        // }
        console.log('ajax success: ' + url + ', ' + JSON.stringify(data));
        success(data, state, xhr);
      },
      error: function(data) {
        // if(!cancelLoading) {
          // ios下面进入页面的时候loading一直不消失，加一个延时处理
          // setTimeout(function() {
          //   bridge.hideLoading();
          // }, 20);
        // }
        console.error('ajax error: ' + url + ', ' + data);
        if(!error.__hasExec) {
          error.__hasExec = true;
          error(data || {});
        }
      }
    });
  },
};
