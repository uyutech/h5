/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import BotNav from '../component/botnav/BotNav.jsx';
import TopNav from '../component/topnav/TopNav.jsx';
// import Find from '../find/Find.jsx';
import Circling from '../circling/Circling.jsx';
// import Follow from '../follow/Follow.jsx';
import MyMessage from '../my_message/MyMessage.jsx';
import My from '../my/My.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import First from './First.jsx';
import ImageView from '../component/imageview/ImageView.jsx';

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

  // let find = migi.preExist(
  //   <Find visible={ true }/>,
  //   '#page'
  // );
  let my;
  let circling = migi.preExist(
    <Circling visible={ true }/>,
    '#page'
  );
  // let follow;
  let myMessage;
  let last = circling;

  botNav.on('change', function(i) {
    last.visible = false;
    $net.statsAction(12, {
      id: i,
    });
    if(i === 1) {
      topNav.hide();
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
      // if(!follow) {
      //   follow = migi.render(<Follow/>, '#page');
      // }
      // last = follow;
      if(!myMessage) {
        myMessage = migi.render(<MyMessage/>, '#page');
        myMessage.init();
      }
      last = myMessage;
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
    migi.eventBus.emit('PLAY_INLINE');
  });
  migi.render(<BotFn/>, '#page');
  migi.render(<ImageView/>, '#page');

  let old = false;
  if(jsBridge.appVersion) {
    let version = jsBridge.appVersion.split('.');
    let major = parseInt(version[0]) || 0;
    let minor = parseInt(version[1]) || 0;
    let patch = parseInt(version[2]) || 0;
    if(jsBridge.android) {
      if(minor < 7) {
        old = true;
      }
      else {
        if(patch < 1) {
          old = true;
        }
      }
    }
    else {
      if(minor < 6) {
        old = true;
      }
    }
  }
  if(old) {
    let notice = migi.render(
      <a class="notice" href="#" onClick={ function(e) {
        e.preventDefault();
        let url = jsBridge.android
          ? 'https://circling.net.cn/android/circling-0.7.1.apk'
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
