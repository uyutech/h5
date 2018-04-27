/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import './mall_prize.html';
import './index.less';

import MallPrize from './MallPrize.jsx';

jsBridge.ready(function() {
  jsBridge.setTitle('新福利');
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow();
  });
  let mallPrize = migi.preExist(
    <MallPrize/>,
    '#page'
  );
  mallPrize.init();
});
