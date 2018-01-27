/**
 * Created by army8735 on 2018/1/27.
 */

'use strict';

import './search.html';
import './index.less';

import Search from './Search.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);

  let search = migi.preExist(<Search/>, '#page');
});
