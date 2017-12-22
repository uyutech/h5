/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import Mall from './Mall.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('圈商城');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mall = migi.preExist(
    <Mall/>,
    '#page'
  );
  net.postJSON('/h5/mall', function(res) {
    if(res.success) {
      mall.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
