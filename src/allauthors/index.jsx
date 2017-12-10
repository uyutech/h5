/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

import './allauthors.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import AllAuthors from './AllAuthors.jsx';

jsBridge.ready(function() {
  let allauthors = migi.preExist(
    <AllAuthors/>,
    '#page'
  );
});
