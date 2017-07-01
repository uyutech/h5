/**
 * Created by army on 2017/6/16.
 */
 
import './author.html';
import './index.less';

import Nav from './Nav.jsx';
import Link from './Link.jsx';
import Tags from './Tags.jsx';
import Home from './Home.jsx';
import Works from './Works.jsx';
import Comments from './Comments.jsx';

jsBridge.ready(function() {
  migi.render(
    <Nav/>,
    document.body
  );
  migi.render(
    <Link/>,
    document.body
  );
  let tags = migi.render(
    <Tags/>,
    document.body
  );
  let home = migi.render(
    <Home/>,
    document.body
  );
  let works = migi.render(
    <Works/>,
    document.body
  );
  let comments = migi.render(
    <Comments/>,
    document.body
  );
  tags.on('change', function(i) {
    home.hide();
    works.hide();
    comments.hide();
    switch (i) {
      case '0':
        home.show();
        break;
      case '1':
        works.show();
        break;
      case '2':
        comments.show();
        break;
    }
  });
  tags.emit('change', '2');
});
