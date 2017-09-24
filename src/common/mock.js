/**
 * Created by army on 2017/6/2.
 */

export default {
  ajax: function(url, data, success, error) {
    setTimeout(function() {
      url = url.replace(/\.json$/, '.js');
      let res = require('../../mock/' + url);
      success(res.default || res);
    }, 20);
  },
};
