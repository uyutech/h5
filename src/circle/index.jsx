/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './circle.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Circle from './Circle.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleID = search.circleID;

jsBridge.ready(function() {
  let circle = migi.preExist(
    <Circle/>,
    '#page'
  );
  net.postJSON('/h5/circle/index', { circleID }, function(res) {
    if(res.success) {
      circle.setData(circleID, res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});