/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall.html';
import './index.less';

import Mall from './Mall.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('圈商城');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mall = migi.preExist(
    <Mall/>,
    '#page'
  );
  mall.init();
});
