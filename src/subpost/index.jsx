/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './subpost.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';

import SubPost from './SubPost.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleID = search.circleID;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subPost = migi.preExist(
    <SubPost circleID={ circleID } placeholder="在转圈圈画个圈吧"/>,
    '#page'
  );
  net.postJSON('/h5/subpost/index', function(res) {
    if(res.success) {
      subPost.to = res.data.hotCircleList.data;
      let activityLabel = res.data.activityLabel;
      subPost.activityLabel = activityLabel;
      let tagList = activityLabel['0'] || [];
      if(circleID && activityLabel && activityLabel[circleID]) {
        tagList = tagList.concat(activityLabel[circleID]);
      }
      subPost.tagList = tagList;
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
