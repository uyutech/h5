/**
 * Created by army8735 on 2017/12/11.
 */

'use strict';

import './my_address.html';
import './index.less';

import MyAddress from './MyAddress.jsx';

jsBridge.ready(function() {
  let myAddress = migi.preExist(
    <MyAddress/>,
    '#page'
  );
  myAddress.init();
});
