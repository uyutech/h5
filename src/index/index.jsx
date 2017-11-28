/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import util from '../common/util';
import BotNav from '../component/botnav/BotNav.jsx';
import Find from './Find.jsx';

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.moveTaskToBack();
  });

  let find = migi.render(<Find/>, '#page');
  let botNav = migi.render(<BotNav/>, '#page');

  util.postJSON('/api/find/index', function(res) {
    if(res.success) {
      find.setData(res.data);
    }
  });
});
