import './index.html';
import './index.less';

import SearchNav from './SearchNav.jsx';
import Carousel from './Carousel.jsx';
import Follow from './Follow.jsx';
import News from './News.jsx';
import BottomNav from './BottomNav.jsx';

let slide = migi.render(
  <ul class="slide">
    <li>
      <SearchNav/>
      <Carousel/>
      <Follow/>
      <News/>
    </li>
    <li>zhuanquan</li>
    <li>find</li>
    <li>my</li>
  </ul>,
  document.body
);
let $slide = $(slide.element);
// migi.render(
//   <SearchNav/>,
//   document.body
// );
// migi.render(
//   <Carousel/>,
//   document.body
// );
{/*migi.render(*/}
  {/*<Follow/>,*/}
//   document.body
// );
// migi.render(
//   <News/>,
//   document.body
// );
var bottomNav = migi.render(
  <BottomNav/>,
  document.body
);
bottomNav.on('change', function(index) {
  $slide.removeClass('s1 s2 s3');
  $slide.addClass('s' + index);
});
