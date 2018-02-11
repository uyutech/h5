/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import BotNav from '../component/botnav/BotNav.jsx';
import TopNav from '../component/topnav/TopNav.jsx';
import Find from '../find/Find.jsx';
import Circling from '../circling/Circling.jsx';
import Follow from '../follow/Follow.jsx';
import My from '../my/My.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

jsBridge.ready(function() {
  jsBridge.on('refresh', function(e) {
    e.preventDefault();
    if(find) {
      find.refresh();
    }
    if(circling) {
      circling.refresh();
    }
    if(follow) {
      follow.refresh();
    }
    if(my) {
      my.refresh();
    }
    net.postJSON('/h5/my/message', function(res) {
      if(res.success) {
        // topNav.setNum(res.data);
      }
    });
  });
  jsBridge.getPreference('loginInfo', function(loginInfo) {
    jsBridge.on('resume', function() {
      // ios暂不清楚为何需要延迟，否则不触发
      setTimeout(function() {
        jsBridge.getPreference('loginInfo', function(loginInfo2) {
          if(loginInfo && !loginInfo2) {
            loginInfo = null;
            migi.eventBus.emit('LOGIN_OUT');
            $.cookie('isLogin', null);
            $.cookie('uid', null);
          }
          else if(!loginInfo && loginInfo2) {
            loginInfo = loginInfo2;
            let userInfo = loginInfo.userInfo;
            migi.eventBus.emit('LOGIN', loginInfo);
            if(userInfo) {
              migi.eventBus.emit('USER_INFO', userInfo);
            }
          }
        });
      }, 1);
    });
    migi.eventBus.on('LOGIN_OUT', function() {
      loginInfo = null;
    });
    migi.eventBus.on('LOGIN', function(data) {
      loginInfo = data;
    });
  });
  jsBridge.on('resume', function(e) {
    let data = e.data;
    if(data && data.message) {
      net.postJSON('/h5/my/message', function(res) {
        if(res.success) {
          // topNav.setNum(res.data);
        }
      });
    }
  });

  let topNav = migi.preExist(<TopNav/>, '#page');

  if(util.isLogin()) {
    net.postJSON('/h5/my/message', function(res) {
      if(res.success) {
        // topNav.setNum(res.data);
      }
    });
  }

  let botNav = migi.preExist(<BotNav/>, '#page');

  let loginInfo;
  jsBridge.delPreference('userInfo');
  jsBridge.delPreference('bonusPoint');
  jsBridge.getPreference('loginInfo', function(res) {
    if(!res) {
      return;
    }
    loginInfo = res;
    migi.eventBus.emit('LOGIN', loginInfo);
    migi.eventBus.emit('USER_INFO', loginInfo.userInfo);
  });

  let find = migi.preExist(<Find/>, '#page');
  let my;
  let circling;
  let follow;
  let last = find;

  botNav.on('change', function(i) {
    last.hide();
    if(i === 0) {
      topNav.hide();
      if(!find) {
        find = migi.render(<Find/>, '#page');
      }
      last = find;
    }
    else if(i === 1) {
      topNav.show();
      if(!circling) {
        circling = migi.render(<Circling/>, '#page');
      }
      last = circling;
    }
    else if(i === 2) {
      topNav.show();
      if(!follow) {
        follow = migi.render(<Follow/>, '#page');
      }
      last = follow;
    }
    else if(i === 3) {
      topNav.show();
      if(!my) {
        my = migi.render(<My loginInfo={ loginInfo }/>, '#page');
      }
      last = my;
    }
    last.show();
  });
  migi.render(<BotFn/>, '#page');

  let old = false;
  if(jsBridge.appVersion) {
    let version = jsBridge.appVersion.split('.');
    let major = parseInt(version[0]) || 0;
    let minor = parseInt(version[1]) || 0;
    let patch = parseInt(version[2]) || 0;
    if(minor < 5 || patch < 2) {
      old = true;
    }
  }
  if(old && jsBridge.android) {
    let notice = migi.render(
      <a class="notice" href="#" onClick={ function(e) {
        e.preventDefault();
        jsBridge.openUri('https://circling.net.cn/android/circling-0.5.3.apk');
      } }>您的app版本过低，考虑到功能和体验，请点击下载更新</a>
    );
    notice.prependTo('#page');
    setTimeout(function() {
      $(notice.element).addClass('show');
    }, 2000);
  }
});
