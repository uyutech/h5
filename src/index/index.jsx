/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import Nav from './Nav.jsx';
import BottomNav from './BottomNav.jsx';
import FollowCard from './FollowCard.jsx';
import ZhuanquanCard from './ZhuanquanCard.jsx';
import FindCard from './FindCard.jsx';

let nav = migi.render(
  <Nav/>,
  document.body
);

let followCard = migi.render(
  <FollowCard/>,
  document.body
);

let zhuanquanCard = migi.render(
  <ZhuanquanCard/>,
  document.body
);

let findCard = migi.render(
  <FindCard/>,
  document.body
);

let bottomNav = migi.render(
  <BottomNav/>,
  document.body
);

let list = [followCard, zhuanquanCard, findCard];
let last = followCard;
bottomNav.on('change', function(i) {
  last.hide();
  last = list[i];
  last.show();
});
bottomNav.emit('change', 2);
