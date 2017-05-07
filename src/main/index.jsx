/**
 * Created by army on 2017/3/19.
 */

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

var bottomNav = migi.render(
  <BottomNav/>,
  document.body
);
bottomNav.on('change', function(index) {
  $slide.removeClass('s1 s2 s3');
  $slide.addClass('s' + index);
});

JSBridge.ready(function() {
  // setTimeout(function() {
  //   JSBridge.back();
  // }, 5000);
  // JSBridge.confirm({
  //   title: 123,
  //   message: 'ffff'
  // }, function(res) {
  //   console.log(res);
  // });
  // JSBridge.hideBackButton();
  // setTimeout(function() {
  //   JSBridge.showBackButton();
  // }, 5000);
  // JSBridge.setTitle('test');
  // document.addEventListener('back', function(e) {
  //   e.preventDefault();
  // });
  // JSBridge.showLoading('aaa');
  // setTimeout(function() {
  //   JSBridge.hideLoading();
  // }, 5000);
  JSBridge.pushWindow('https://www.baidu.com');
  JSBridge.on('pause', function() {
    console.log('pause ' + location.href);
  });
  JSBridge.on('resume', function() {
    console.log('resume ' + location.href);
  });
  // $.getJSON("http://www.army8735.me/migijs/migi/demo/data.json", function(res) {
  //   console.log(JSON.stringify(res));
  // });
});
