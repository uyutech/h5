/**
 * Created by army8735 on 2017/12/24.
 */

'use strict';

import './tag.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Tag from './Tag.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let tag = search.tag;

jsBridge.ready(function() {
  let t = migi.preExist(
    <Tag/>,
    '#page'
  );
  net.postJSON('/h5/tag/list', { tag, skip: 0, take: 10 }, function(res) {
    if(res.success) {
      t.setData(tag, res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
