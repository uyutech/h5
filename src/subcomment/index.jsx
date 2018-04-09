/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './subcomment.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import SubComment from './SubComment.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;
let type = search.type;
let pid = search.pid;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let subComment = migi.preExist(
    <SubComment/>,
    '#page'
  );
  subComment.init({ id, type, pid });
});
