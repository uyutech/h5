/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

import './allalbums.html';
import './index.less';


import util from '../common/util';
import AllAlbums from './AllAlbums.jsx';

jsBridge.ready(function() {
  let allAlbums = migi.preExist(
    <AllAlbums/>,
    '#page'
  );
});
