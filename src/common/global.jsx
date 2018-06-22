/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import uuidv4 from 'uuid/v4';
import MLogin from '../component/mlogin/MLogin.jsx';
// import Message from '../component/message/Message.jsx';

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

jsBridge.ready(function() {
  // if(['/my_comment.html', '/my_message.html'].indexOf(location.pathname) === -1) {
  //   setTimeout(function() {
  //     migi.render(
  //       <Message/>,
  //       document.body
  //     );
  //   }, 200);
  // }
  jsBridge.getPreference('UUID', function(res) {
    let first = !res;
    if(first) {
      res = uuidv4().replace(/-/g, '');
      jsBridge.setPreference('UUID', res);
      setTimeout(function() {
        migi.eventBus.emit('FIRST');
      }, 1000);
    }
    $net.stats('/h5/stats/visit?platform='
      + (jsBridge.android ? 3 : 4)
      + '&url=' + encodeURIComponent(location.pathname.replace(/^\//, ''))
      + '&search=' + encodeURIComponent(location.search.replace(/^\?/, ''))
      + '&uuid=' + encodeURIComponent(res)
      + '&appversion=' + encodeURIComponent(jsBridge.appVersion)
      + '&first=' + encodeURIComponent(first)
      + '&_=' + Date.now() + Math.random());
  });
  setTimeout(function() {
    let top = migi.render(
      <div class="g-top" onClick={ function() { document.body.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      }) } }/>,
      document.body
    );
    window.onscroll = function() {
      let y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(y > document.documentElement.clientHeight) {
        top.element.classList.add('show');
      }
      else {
        top.element.classList.remove('show');
      }
    };
  }, 200);
});
