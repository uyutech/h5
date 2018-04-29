/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import uuidv4 from 'uuid/v4';
import MLogin from '../component/mlogin/MLogin.jsx';
import Message from '../component/message/Message.jsx';

let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

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
  if(location.pathname !== '/my_message.html') {
    setTimeout(function() {
      migi.render(
        <Message/>,
        document.body
      );
    }, 1000);
  }
  jsBridge.getPreference('UUID', function(res) {
    let first = !res;
    if(first) {
      res = uuidv4().replace(/-/g, '');
      jsBridge.setPreference('UUID', res);
      setTimeout(function() {
        migi.eventBus.emit('FIRST');
      }, 1000);
    }
    let img = new Image();
    img.style.position = 'absolute';
    img.style.display = 'none';
    img.src = window.ROOT_DOMAIN + '/h5/stats/visit?platform='
      + (jsBridge.android ? 3 : 4)
      + '&url=' + encodeURIComponent(location.pathname.replace(/^\//, ''))
      + '&search=' + encodeURIComponent(location.search.replace(/^\?/, ''))
      + '&uuid=' + res
      + '&appversion=' + jsBridge.appVersion
      + '&first=' + first
      + '&_=' + Date.now() + Math.random();
    img.onload = function() {
      document.removeChild(img);
    };
    document.body.appendChild(img);
  });
});
