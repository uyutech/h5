/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './sub_post.html';
import './index.less';

import qs from 'anima-querystring';

import SubPost from './SubPost.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleId = parseInt(search.circleId);
let tag = search.tag;
let worksId = parseInt(search.worksId);
let workId = parseInt(search.workId);
let cover = search.cover;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subPost = migi.preExist(
    <SubPost placeholder="在转圈圈画个圈吧"/>,
    '#page'
  );
  subPost.init({
    circleId,
    tag,
    worksId,
    workId,
    cover,
  });
});
