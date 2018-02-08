/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './message.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Message from './Message.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow({
      message: true,
    });
  });
  let message = migi.preExist(
    <Message/>,
    '#page'
  );
});
