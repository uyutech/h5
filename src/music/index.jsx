/**
 * Created by army8735 on 2018/2/3.
 */

'use strict';

import './music.html';
import './index.less';

import qs from 'anima-querystring';

import Music from './Music.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let albumId = parseInt(search.albumId);
let workId = parseInt(search.workId) || undefined;

jsBridge.ready(function() {
  let music = migi.preExist(
    <Music/>,
    '#page'
  );
  music.init(albumId, workId);
});
