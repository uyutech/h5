/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

import './all_circles.html';
import './index.less';

import AllCircles from './AllCircles.jsx';

jsBridge.ready(function() {
  let allCircles = migi.preExist(
    <AllCircles/>,
    '#page'
  );
});
