/**
 * Created by army on 2017/5/20.
 */

import $ from 'anima-yocto-ajax';
import bridge from './bridge';

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
    // 兼容无host
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://106.14.223.219:8089/' + url.replace(/^\//, '');
      // url = 'http://local.alipay.net:3000/' + url.replace(/^\//, '');
    }
    if (!cancelLoading) {
      bridge.showLoading();
    }
    
    $.ajax({
      url: url,
      data: data,
      dataType: 'json',
      cache: false,
      crossDomain: true,
      timeout: 10000,
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
      }
    });
  }
};

export default util;
