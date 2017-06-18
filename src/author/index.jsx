/**
 * Created by army on 2017/6/16.
 */
 
import './author.html';
import './index.less';

import Nav from './Nav.jsx';
import Link from './Link.jsx';

jsBridge.ready(function() {
  migi.render(
    <Nav/>,
    document.body
  );
  migi.render(
    <Link/>,
    document.body
  );
});
