/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './works.html';
import './index.less';

import qs from 'anima-querystring';

import Works from './Works.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let worksId = parseInt(search.worksId);
let workId = parseInt(search.workId) || undefined;

jsBridge.ready(function() {1
  let works = migi.preExist(
    <Works/>,
    '#page'
  );
  works.init(worksId, workId);
});
