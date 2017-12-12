/**
 * Created by army8735 on 2017/12/11.
 */

'use strict';

import './private.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import Private from './Private.jsx';

jsBridge.ready(function() {
  let pri = migi.preExist(
    <Private/>,
    '#page'
  );
});
