/**
 * Created by army on 2017/5/13.
 */

import './index.html';
import './index.less';

import BottomNav from './BottomNav.jsx';
import News from './News.jsx';

migi.render(
  <News/>,
  document.body
);

migi.render(
  <BottomNav/>,
  document.body
);
