/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall_new.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import MallNew from './MallNew.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('新福利');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mallNew = migi.preExist(
    <MallNew/>,
    '#page'
  );
  net.postJSON('/h5/mall/new', function(res) {
    if(res.success) {
      mallNew.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
