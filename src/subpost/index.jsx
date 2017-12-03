/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './subpost.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';

import SubPost from './SubPost.jsx';

jsBridge.ready(function() {
  let subPost = migi.preExist(
    <SubPost placeholder="在转圈圈画个圈吧"/>,
    '#page'
  );
  net.postJSON('/h5/subpost/index', function(res) {
    if(res.success) {
      subPost.to = res.data.hotCircleList.data;
      subPost.activityLabel = res.data.activityLabel;
      subPost.tagList = res.data.activityLabel['0'] || [];
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
