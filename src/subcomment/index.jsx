/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './subcomment.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';

import SubComment from './SubComment.jsx';

jsBridge.ready(function() {
  let subComment = migi.preExist(
    <SubComment placeholder="评论"/>,
    '#page'
  );
  // net.postJSON('/h5/subcomment/index', function(res) {
  //   if(res.success) {
  //     // subPost.to = res.data.hotCircleList.data;
  //     // subPost.activityLabel = res.data.activityLabel;
  //     // subPost.tagList = res.data.activityLabel['0'] || [];
  //   }
  //   else {
  //     jsBridge.toast(res.message || util.ERROR_MESSAGE);
  //   }
  // }, function(res) {
  //   jsBridge.toast(res.message || util.ERROR_MESSAGE);
  // });
});
