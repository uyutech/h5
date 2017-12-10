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
import ImageView from '../post/ImageView.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.moveTaskToBack();
  });
  jsBridge.on('refresh', function(e) {
    e.preventDefault();
    if(circling) {
      circling.refresh();
    }
    if(follow) {
      follow.refresh();
    }
    net.postJSON('/h5/my/message', function(res) {
      if(res.success) {
        topNav.setNum(res.data);
      }
    });
  });
  jsBridge.on('resume', function(e) {
    let data = e.data;console.log(data);
    if(data && data.message) {
      net.postJSON('/h5/my/message', function(res) {
        if(res.success) {
          topNav.setNum(res.data);
        }
      });
    }
  });

  let topNav = migi.preExist(<TopNav/>, '#page');

  if(util.isLogin()) {
    net.postJSON('/h5/my/message', function(res) {
      if(res.success) {
        topNav.setNum(res.data);
      }
    });
  }

  let botNav = migi.preExist(<BotNav/>, '#page');
  migi.preExist(<ImageView ref="imageView"/>, '#page');

  let userInfo;
  let bonusPoint;
  jsBridge.getPreference('userInfo', function(res) {
    if(!res) {
      return;
    }
    userInfo = res;
    if(userInfo) {
      migi.eventBus.emit('LOGIN', userInfo);
    }
  });
  jsBridge.getPreference('bonusPoint', function(res) {
    if(!res) {
      return;
    }
    bonusPoint = res;
  });

  let find = migi.preExist(<Find/>, '#page');
  let my;
  let circling;
  let follow;
  let last = find;

  botNav.on('change', function(i) {
    last.hide();
    if(i === 0) {
      if(!find) {
        find = migi.render(<Find/>, '#page');
      }
      last = find;
    }
    else if(i === 1) {
      if(!circling) {
        circling = migi.render(<Circling/>, '#page');
      }
      last = circling;
    }
    else if(i === 2) {
      if(!follow) {
        follow = migi.render(<Follow/>, '#page');
      }
      last = follow;
    }
    else if(i === 3) {
      if(!my) {
        my = migi.render(<My userInfo={ userInfo } bonusPoint={ bonusPoint }/>, '#page');
      }
      last = my;
    }
    last.show();
  });
});
