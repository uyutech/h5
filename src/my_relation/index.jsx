/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './my_relation.html';
import './index.less';

import MyRelation from './MyRelation.jsx';

jsBridge.ready(function() {
  let relation = migi.preExist(
    <MyRelation/>,
    '#page'
  );
  relation.init();
});
