/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import Carousel from './Carousel.jsx';
import FollowList from './FollowList.jsx';
import BottomNav from './BottomNav.jsx';
import News from './News.jsx';

migi.render(
  <Carousel/>,
  document.body
);

migi.render(
  <FollowList/>,
  document.body
);

migi.render(
  <News/>,
  document.body
);

migi.render(
  <BottomNav/>,
  document.body
);
