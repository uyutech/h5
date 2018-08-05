/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './sub_post.html';
import './index.less';

import qs from 'anima-querystring';

import SubPost from './SubPost.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleId = parseInt(search.circleId) || null;
let tag = search.tag;
let worksId = parseInt(search.worksId);
let workId = parseInt(search.workId);
let cover = search.cover;
let content = search.content;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subPost = migi.preExist(
    <SubPost/>,
    '#page'
  );
  subPost.init({
    circleId,
    tag,
    worksId,
    workId,
    cover,
    content,
  });
});
