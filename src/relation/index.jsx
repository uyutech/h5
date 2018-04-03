/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './relation.html';
import './index.less';

import Relation from './Relation.jsx';

jsBridge.ready(function() {
  let relation = migi.preExist(
    <Relation/>,
    '#page'
  );
  relation.init();
});
