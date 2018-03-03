/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import MLogin from '../component/mlogin/MLogin.jsx';
import Share from '../component/share/Share.jsx';
import Message from '../component/message/Message.jsx';

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

jsBridge.ready(function() {
  if(location.pathname === '/message.html') {
    return;
  }
  setTimeout(function() {
    let message = migi.render(
      <Message/>,
      document.body
    );
    let top = migi.render(
      <div class="g-top" onClick={ function() { document.body.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      }) } }/>,
      document.body
    );
    window.onscroll = function() {
      let y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(y > screen.availHeight) {
        top.element.classList.add('show');
      }
      else {
        top.element.classList.remove('show');
      }
    };
  }, 100);
});
