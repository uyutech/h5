/**
 * Created by army8735 on 2018/2/3.
 */

'use strict';

import './music_album.html';
import './index.less';

import qs from 'anima-querystring';

import MusicAlbum from './MusicAlbum.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = parseInt(search.id);
let workId = parseInt(search.workId) || undefined;

jsBridge.ready(function() {
  let music = migi.preExist(
    <MusicAlbum/>,
    '#page'
  );
  music.init(id, workId);
});
