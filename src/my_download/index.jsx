/**
 * Created by army8735 on 2018/5/6.
 */

'use strict';

import './my_download.html';
import './index.less';

import MyDownload from './MyDownload.jsx';

jsBridge.ready(function() {
  let myDownload = migi.preExist(
    <MyDownload/>,
    '#page'
  );
});
