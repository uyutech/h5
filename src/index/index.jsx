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
import My from '../my/My.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.moveTaskToBack();
  });

  let find = migi.render(<Find/>, '#page');
  // let my = migi.render(<My/>, '#page');
  let my;
  let last = find;
  let topNav = migi.render(<TopNav/>, '#page');
  let botNav = migi.render(<BotNav/>, '#page');

  botNav.on('change', function(i) {
    last.hide();
    if(i === 0) {
      if(!find) {
        find = migi.render(<Find/>, '#page');
        net.postJSON('/h5/find/index', function(res) {
          if(res.success) {
            find.setData(res.data);
          }
        });
      }
      last = find;
    }
    else if(i === 3) {
      if(!my) {
        my = migi.render(<My/>, '#page');
      }
      last = my;
    }
    last.show();
  });
});
