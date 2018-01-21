/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import './playlist.html';
import './index.less';

import Playlist from './Playlist.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let playlist = migi.preExist(<Playlist/>, '#page');
});
