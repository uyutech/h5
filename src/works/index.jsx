/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './works.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Works from './Works.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let worksId = parseInt(search.worksId);
let workId = parseInt(search.workId) || undefined;

jsBridge.ready(function() {
  let works = migi.preExist(
    <Works worksId={ worksId } workId={ workId }/>,
    '#page'
  );
  // net.postJSON('/h5/works/index', { worksID, workID }, function(res) {
  //   if(res.success) {
  //     works.setData(worksID, workID, res.data);
  //   }
  //   else {
  //     jsBridge.toast(res.message || util.ERROR_MESSAGE);
  //   }
  // }, function(res) {
  //   jsBridge.toast(res.message || util.ERROR_MESSAGE);
  // });
});
