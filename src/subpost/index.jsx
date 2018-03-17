/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './subpost.html';
import './index.less';

import qs from 'anima-querystring';

import SubPost from './SubPost.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleID = search.circleID;
let tag = search.tag;
let worksId = search.worksId;
let workId = search.workId;
let cover = search.cover;
let workType = search.workType;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subPost = migi.preExist(
    <SubPost circleID={ circleID }
             placeholder="在转圈圈画个圈吧"
             worksId={ worksId }
             workId={ workId }
             cover={ cover }
             workType={ workType }/>,
    '#page'
  );
  subPost.init(circleID, tag);
});
