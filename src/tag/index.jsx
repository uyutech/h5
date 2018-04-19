/**
 * Created by army8735 on 2017/12/24.
 */

'use strict';

import './tag.html';
import './index.less';

import qs from 'anima-querystring';


import util from '../common/util';
import Tag from './Tag.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let tag = search.tag;

jsBridge.ready(function() {
  let t = migi.preExist(
    <Tag/>,
    '#page'
  );
  t.init(tag);
});
