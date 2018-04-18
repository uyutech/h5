/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './sub_comment.html';
import './index.less';

import qs from 'anima-querystring';

import subComment from './subComment.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;
let type = search.type;
let pid = search.pid;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subComment = migi.preExist(
    <subComment/>,
    '#page'
  );
  subComment.init({ id, type, pid });
});
