/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './my_favor.html';
import './index.less';

import MyFavor from './MyFavor.jsx';

jsBridge.ready(function() {
  let myFavor = migi.preExist(
    <MyFavor/>,
    '#page'
  );
  myFavor.init();
});
