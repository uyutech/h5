/**
 * Created by army8735 on 2018/8/8.
 */

'use strict';

import './settle.html';
import './index.less';

import Settle from './Settle.jsx';

jsBridge.ready(function() {
  let settle = migi.preExist(
    <Settle/>,
    '#page'
  );
  settle.init();
});

