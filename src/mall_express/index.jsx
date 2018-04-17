/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall_express.html';
import './index.less';

import MallExpress from './MallExpress.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('等待收货');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mallExpress = migi.preExist(
    <MallExpress/>,
    '#page'
  );
  mallExpress.init();
});
