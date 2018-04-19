/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import './record.html';
import './index.less';

import Record from './Record.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let record = migi.preExist(<Record/>, '#page');
  record.init();
});
