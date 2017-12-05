/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './mypost.html';
import './index.less'

import net from '../common/net';
import util from '../common/util';
import MyPost from './MyPost.jsx';

jsBridge.ready(function() {
  let myPost = migi.preExist(
    <MyPost/>,
    '#page'
  );
  net.postJSON('/h5/my/postList', function(res) {
    if(res.success) {
      myPost.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
