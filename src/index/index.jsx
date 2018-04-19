/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import BotNav from '../component/botnav/BotNav.jsx';
import TopNav from '../component/topnav/TopNav.jsx';
import Find from '../find/Find.jsx';
import Circling from '../circling/Circling.jsx';
import Follow from '../follow/Follow.jsx';
import My from '../my/My.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import First from './First.jsx';

jsBridge.ready(function() {
  jsBridge.on('refresh', function(e) {
    e.preventDefault();
    if(last) {
      last.refresh();
    }
    migi.eventBus.emit('REFRESH_MESSAGE');
  });
  jsBridge.on('networkChange', function(e) {
    if(e.data && e.data.available) {
      if(find) {
        find.refresh();
      }
    }
  });

  let topNav = migi.preExist(<TopNav/>, '#page');
  let botNav = migi.preExist(<BotNav/>, '#page');

  let find = migi.preExist(
    <Find visible={ true }/>,
    '#page'
  );
  let my;
  let circling;
  let follow;
  let last = find;

  botNav.on('change', function(i) {
    last.visible = false;
    if(i === 0) {
      topNav.hide();
      if(!find) {
        find = migi.render(
          <Find/>,
          '#page'
        );
      }
      last = find;
    }
    else if(i === 1) {
      topNav.show();
      if(!circling) {
        circling = migi.render(
          <Circling/>,
          '#page'
        );
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
      topNav.hide();
      if(!my) {
        my = migi.render(<My/>, '#page');
      }
      last = my;
    }
    last.visible = true;
    migi.eventBus.emit('REFRESH_MESSAGE');
  });
  migi.render(<BotFn/>, '#page');

  let old = false;
  if(jsBridge.appVersion) {
    let version = jsBridge.appVersion.split('.');
    let major = parseInt(version[0]) || 0;
    let minor = parseInt(version[1]) || 0;
    let patch = parseInt(version[2]) || 0;
    if(jsBridge.android) {
      if(minor < 6) {
        old = true;
      }
    }
    else {
      if(minor < 5) {
        old = true;
      }
      else if(minor === 5 && patch < 4) {
        old = true;
      }
    }
  }
  if(old) {
    let notice = migi.render(
      <a class="notice" href="#" onClick={ function(e) {
        e.preventDefault();
        let url = jsBridge.android
          ? 'https://circling.$net.cn/android/circling-0.6.5.apk'
          : 'https://itunes.apple.com/cn/app/id1331367220';
        jsBridge.openUri(url);
      } }>您的app版本过低，考虑到功能和体验，请点击下载更新</a>
    );
    notice.prependTo('#page');
    setTimeout(function() {
      $(notice.element).addClass('show');
    }, 1000);
  }
  migi.eventBus.on('FIRST', function() {
    migi.render(
      <First/>,
      document.body
    );
  });
});
