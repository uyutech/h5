/**
 * Created by army on 2017/6/8.
 */

import './works.html';
import './index.less';

import Nav from './Nav.jsx';
import Authors from './Authors.jsx';
import Video from './Video.jsx';
import Tags from './Tags.jsx';
import Intro from './Intro.jsx';

let nav = migi.render(
  <Nav/>,
  document.body
);

let authors = migi.render(
  <Authors/>,
  document.body
);

let video = migi.render(
  <Video nav={ nav }/>,
  document.body
);

let tags = migi.render(
  <Tags/>,
  document.body
);

let intro = migi.render(
  <Intro/>,
  document.body
);

// migi.render(
//   <a href="#" class="test" onClick={ function(e) { e.preventDefault(); location.reload(true); } }>刷新</a>,
//   document.body
// );