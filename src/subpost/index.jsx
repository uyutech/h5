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
  net.postJSON('/h5/subpost/index', { circleID }, function(res) {
    if(res.success) {
      let data = res.data;
      let to = data.myCircleList;
      if(to && to.length && circleID !== undefined) {
        let has = false;
        to.forEach(function(item) {
          if(item.CirclingID.toString() === (circleID || '').toString()) {
            has = true;
          }
        });
        if(has) {
          migi.sort(to, function(a, b) {
            if(a.CirclingID.toString() === (circleID || '').toString()) {
              return false;
            }
            else if(b.CirclingID.toString() === (circleID || '').toString()) {
              return true;
            }
          });
        }
        else {
          to.unshift({
            CirclingID: circleID,
            CirclingName: data.circleDetail.TagName,
          });
        }
      }
      subPost.to = to;
      let activityLabel = data.activityLabel || [];
      subPost.activityLabel = activityLabel;
      subPost.tagList = (data.tagList || []).concat(activityLabel);
      if(circleID && data.tagList) {
        subPost.setCache(circleID, data.tagList);
      }
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
