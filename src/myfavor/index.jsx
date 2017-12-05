/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './myfavor.html';
import './index.less';

import net from "../common/net";
import util from "../common/util";
import MyFavor from './MyFavor.jsx';

jsBridge.ready(function() {
  let myFavor = migi.preExist(
    <MyFavor/>,
    '#page'
  );
  net.postJSON('/h5/my/favor', function(res) {
    if(res.success) {
      myFavor.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
