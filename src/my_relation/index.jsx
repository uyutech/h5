/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './my_relation.html';
import './index.less';

import qs from 'anima-querystring';

import MyRelation from './MyRelation.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let tag = parseInt(search.tag) || 0;

jsBridge.ready(function() {
  let relation = migi.preExist(
    <MyRelation/>,
    '#page'
  );
  relation.init(tag);
});
