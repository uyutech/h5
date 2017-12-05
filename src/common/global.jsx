/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from './net';
import util from './util';

import MLogin from '../component/mlogin/MLogin.jsx';
import Share from '../component/share/Share.jsx';

let mlogin;
migi.eventBus.on('NEED_LOGIN', function() {
  if(!mlogin) {
    mlogin = migi.render(
      <MLogin/>,
      document.body
    );
  }
  mlogin.show();
});

let share;
migi.eventBus.on('SHARE', function(url) {
  if(url.charAt(0) === '/') {
    url = window.ROOT_DOMAIN + url;
  }
  if(!share) {
    share = migi.render(
      <Share/>,
      document.body
    );
  }
  share.url = url;
  share.show();
});