/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './mymessage.html';
import './index.less';

import MyMessage from './MyMessage.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow({
      message: true,
    });
  });
  let message = migi.preExist(
    <MyMessage/>,
    '#page'
  );
  message.init();
});
