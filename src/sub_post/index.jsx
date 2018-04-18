/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './sub_post.html';
import './index.less';

import qs from 'anima-querystring';

import SubPost from './SubPost.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleId = search.circleId;
let tag = search.tag;
let worksId = search.worksId;
let workId = search.workId;
let cover = search.cover;
let kind = search.kind;

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
    kind,
  });
});
