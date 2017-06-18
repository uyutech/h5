/**
 * Created by army on 2017/6/8.
 */

import './works.html';
import './index.less';

import Nav from './Nav.jsx';
import Authors from './Authors.jsx';
import Video from './Video.jsx';
import Audio from './Audio.jsx';
import Image from './Image.jsx';
import Link from './Link.jsx';
import MediaSwitch from './MediaSwitch.jsx';
import Tags from './Tags.jsx';
import Intro from './Intro.jsx';
import PlayList from './PlayList.jsx';
import Comments from './Comments.jsx';
import Menu from './Menu.jsx';
import ImageView from './ImageView.jsx';

let $window = $(window);
let winWidth = $window.width();

jsBridge.ready(function() {
  let images = [
    'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100388475.jpg',
    'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100222800.jpg',
    'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100393706.jpg'
  ];
  
  let nav = migi.render(
    <Nav/>,
    document.body
  );
  let authors = migi.render(
    <Authors/>,
    document.body
  );
  let menu = migi.render(
    <Menu/>,
    document.body
  );
  menu.len(3);
  authors.on('choose', function(uid, x, y) {
    menu.pos(x, y);
    menu.hide();
    setTimeout(function() {
      menu.show();
    }, 50);
  });
  authors.on('chooseNone', function() {
    menu.hide();
  });
  $(document.body).on('touchstart', function(e) {
    if ($(e.target).closest('.authors')[0]) {
      return;
    }
    menu.hide();
  });
  let medias = migi.render(
    <div class="medias">
      <div class="c">
        <Video/>
        <Audio/>
        <Image images={ images }/>
        <Link/>
      </div>
      <MediaSwitch nav={ nav }/>
    </div>,
    document.body
  );
  let $mediasC = $(medias.element).children('.c');
  let video = medias.find(Video);
  video.on('playing', function() {
    menu.hide();
  });
  video.on('pause', function() {
  });
  let audio = medias.find(Audio);
  let image = medias.find(Image);
  let mediaSwitch = medias.find(MediaSwitch);
  mediaSwitch.on('change', function(i) {
    let x = i * winWidth;
    $mediasC.css('-webkit-transform', `translate3d(${-x}px,0,0)`);
    $mediasC.css('transform', `translate3d(${-x}px,0,0)`);
  });
  mediaSwitch.emit('change', 3);
  let imageView = migi.render(
    <ImageView images={ images }/>,
    document.body
  );
  image.on('show', function(i) {
    imageView.show(i);
  });
  
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
  let $selects = $(selects.element);
  // let timeout;
  tags.on('change', function(i) {
    let x = i * winWidth;
    $selects.css('-webkit-transform', `translate3d(${-x}px,0,0)`);
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
});
