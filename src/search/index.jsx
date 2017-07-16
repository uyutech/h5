/**
 * Created by army on 2017/7/16.
 */

import './search.html';
import './index.less';

import Nav from './Nav.jsx';
import History from './History.jsx';
import Hot from './Hot.jsx';

migi.render(
  <Nav/>,
  document.body
);

migi.render(
  <History/>,
  document.body
);

migi.render(
  <Hot/>,
  document.body
);
