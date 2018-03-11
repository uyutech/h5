/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

import './config.html';
import './index.less';

import Config from './Config.jsx';

jsBridge.ready(function() {
  let config = migi.preExist(<Config/>, '#page');
});
