/**
 * Created by army on 2017/6/8.
 */

import './works.html';
import './index.less';

import Nav from './Nav.jsx';
import Authors from './Authors.jsx';
import Medias from './Medias.jsx';
import Tags from './Tags.jsx';
import Intro from './Intro.jsx';
import PlayList from './PlayList.jsx';
import Comments from './Comments.jsx';

let nav = migi.render(
  <Nav/>,
  document.body
);

let authors = migi.render(
  <Authors/>,
  document.body
);

let medias = migi.render(
  <Medias nav={ nav }/>,
  document.body
);

let tags = migi.render(
  <Tags/>,
  document.body
);

let selects = migi.render(
  <div class="selects" style={ `width:${tags.getTagNum()}00%` }>
    <Intro/>
    <PlayList/>
    <Comments/>
    <div>empty</div>
    <div>empty</div>
  </div>,
  document.body
);

let $window = $(window);
let winWidth = $window.width();
let $selects = $(selects.element);
// let timeout;
tags.on('change', function(i) {
  let x = i * winWidth;
  $selects.css('transform', `translate3d(${-x}px,0,0)`);
  // $selects.children('div').removeClass('fn-zero');
  // if(timeout) {
  //   clearTimeout(timeout);
  // }
  // timeout = setTimeout(function() {
  //   $selects.children('div').addClass('fn-zero');
  //   $selects.children('div').eq(i).removeClass('fn-zero');
  // }, 200);
});
// tags.emit('change', 2);
