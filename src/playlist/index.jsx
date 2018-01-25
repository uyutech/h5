/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import './playlist.html';
import './index.less';

import Playlist from './Playlist.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  // 空绑service，回到前台重绑以接收media事件
  jsBridge.media();
  jsBridge.on('resume', function(e) {
    jsBridge.media();
  });
  let playlist = migi.preExist(<Playlist/>, '#page');
});
