/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

import './shield.html';
import './index.less';

import Shield from './Shield.jsx';

jsBridge.ready(function() {
  let shield = migi.preExist(<Shield/>, '#page');
  shield.init();
});
