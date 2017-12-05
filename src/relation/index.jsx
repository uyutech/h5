/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './relation.html';
import './index.less';

import net from "../common/net";
import util from "../common/util";
import Relation from './Relation.jsx';

jsBridge.ready(function() {
  let relation = migi.preExist(
    <Relation/>,
    '#page'
  );
  net.postJSON('/h5/my/relation', function(res) {
    if(res.success) {
      relation.setData(res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
