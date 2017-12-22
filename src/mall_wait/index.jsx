/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall_wait.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import MallWait from './MallWait.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('等待收货');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mallWait = migi.preExist(
    <MallWait/>,
    '#page'
  );
  net.postJSON('/h5/mall/wait', function(res) {
    if(res.success) {
      mallWait.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
