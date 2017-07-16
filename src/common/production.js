/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';
import bridge from './bridge';

export default {
  ajax: function(url, data, success, error, cancelLoading) {
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://116.62.244.93:8089/' + url.replace(/^\//, '');
    }
    if (!cancelLoading) {
      bridge.showLoading();
    }
    console.log('ajax: ' + url + ', ' + JSON.stringify(data));
    $.ajax({
      url: url,
      data: data,
      dataType: 'json',
      cache: false,
      crossDomain: true,
      timeout: 10000,
      type: 'get',
      // ajax 跨域设置必须加上
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      },
      success: function(data) {
        if(!cancelLoading) {
          // ios下面进入页面的时候loading一直不消失，加一个延时处理
          setTimeout(function() {
            bridge.hideLoading();
          }, 20);
        }
        console.log(data);
        console.log(JSON.stringify(data));
        if(data.success) {
          success(data.data);
        }
        else {
          error(data);
        }
      },
      error: function(data) {
        if(!cancelLoading) {
          // ios下面进入页面的时候loading一直不消失，加一个延时处理
          setTimeout(function() {
            bridge.hideLoading();
          }, 20);
        }
        console.log('ajax error: ' + data);
        error(data || {});
      }
    });
  },
};
