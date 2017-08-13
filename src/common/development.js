/**
 * Created by army on 2017/6/2.
 */

import $ from 'anima-yocto-ajax';
import bridge from './bridge';

export default {
  ajax: function(url, data, success, error, cancelLoading) {
    if (!cancelLoading) {
      bridge.showLoading();
    }
    setTimeout(function() {
      bridge.hideLoading();
      url = url.replace(/\.json$/, '.js');
      let res = require('../../mock/' + url);
      console.log(res);
      success(res);
    }, 20);
  },
};
