/**
 * Created by army8735 on 2018/5/22.
 */

'use strict';

import './my_comment.html';
import './index.less';

import MyComment from './MyComment.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow({
      myMessage: true,
    });
  });
  let myComment = migi.preExist(
    <MyComment/>,
    '#page'
  );
  myComment.init();
});

