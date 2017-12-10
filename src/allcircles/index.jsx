/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

import './allcircles.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import AllCircles from './AllCircles.jsx';

jsBridge.ready(function() {
  let allCircles = migi.preExist(
    <AllCircles/>,
    '#page'
  );
});
