/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import MLogin from '../component/mlogin/MLogin.jsx';
import Message from '../component/message/Message.jsx';
import uuidv4 from 'uuid/v4';

let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

let isString = isType('String');

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
    window.addEventListener('scroll', function() {
      let y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(y > screen.availHeight) {
        top.element.classList.add('show');
      }
      else {
        top.element.classList.remove('show');
      }
    });
  }, 1000);
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
