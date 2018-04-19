/**
 * Created by army8735 on 2017/12/29.
 */

'use strict';

import './passport.html';
import './index.less';


import util from '../common/util';
import Passport from './Passport.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);

  let passport = migi.preExist(
    <Passport/>,
    '#page'
  );
});
