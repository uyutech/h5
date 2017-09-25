/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

// import Nav from './Nav.jsx';
import TopNav from '../component/topnav/TopNav.jsx';
import BottomNav from './BottomNav.jsx';
// import FollowCard from './follow/FollowCard.jsx';
// import ZhuanquanCard from './ZhuanquanCard.jsx';
import Find from '../find/Find.jsx';
import My from '../my/My.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.moveTaskToBack();
  });
  let topNav = migi.render(
    <TopNav/>,
    '#page'
  );

  topNav.on('search', function(kw) {
    jsBridge.pushWindow('search.html?kw=' + encodeURIComponent(kw));
  });

  let followCard, zhuanquanCard, findCard, myCard;

  // followCard = migi.render(
  //   <FollowCard/>,
  //   '#page'
  // );

  let bottomNav = migi.render(
    <BottomNav/>,
    '#page'
  );

  let last = followCard;
  bottomNav.on('change', function(i) {
    last && last.hide();
    location.hash = i;
    switch (i) {
      // case '0':
      //   if(!followCard) {
      //     followCard = migi.render(
      //       <FollowCard/>,
      //       '#page'
      //     );
      //   }
      //   last = followCard;
      //   break;
      // case '1':
      //   if(!zhuanquanCard) {
      //     zhuanquanCard = migi.render(
      //       <ZhuanquanCard/>,
      //       '#page'
      //     );
      //   }
      //   last = zhuanquanCard;
      //   break;
      case '0':
        if(!findCard) {
          findCard = migi.render(
            <Find/>,
            '#page'
          );
          findCard.load();
        }
        last = findCard;
        break;
      case '1':
        if(!myCard) {
          myCard = migi.render(
            <My/>,
            '#page'
          );
        }
        last = myCard;
        break;
    }
    last.show();
  });
  // bottomNav.emit('change', '3');

  bottomNav.setCurrent(location.hash.replace(/^#/, '') || '0');
});
