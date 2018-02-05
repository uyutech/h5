/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import './image.html';
import './index.less';

import qs from 'anima-querystring';

import Image from './Image.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let worksId = parseInt(search.worksId);

jsBridge.ready(function() {
  let image = migi.preExist(
    <Image/>,
    '#page'
  );
  image.init(worksId);
});
