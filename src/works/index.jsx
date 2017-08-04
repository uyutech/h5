/**
 * Created by army on 2017/6/8.
 */

import './works.html';
import './index.less';

import qs from 'anima-querystring';

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

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

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
  // mediaSwitch.emit('change', 3);
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
  let intro = migi.render(
    <Intro/>,
    document.body
  );
  let comments = migi.render(
    <Comments/>,
    document.body
  );
  tags.on('change', function(i) {
    intro.hide();
    comments.hide();
    switch(i) {
      case '0':
        intro.show();
        break;
      case '1':
        comments.show();
        break;
    }
  });
  // tags.emit('change', 2);

  if(id) {
    util.postJSON('api/works/GetWorkDetails', { WorksID: id }, function(res) {
      console.log(res);
      nav.title = res.Title;
      nav.subTitle = res.sub_Title;

      let temp = [];
      function addAuthor(type, data) {
        if(data && data.length) {
          let arr = {
            type,
            list: []
          };
          data.forEach(function(author) {
            arr.list.push({
              id: author.ID,
              name: author.AuthName,
              img: author.HeadUrl,
            });
          });
          temp.push(arr);
        }
      }
      if(res.Works_Music) {
        res.Works_Music.forEach(function(item) {
          addAuthor('歌手', item.Works_Music_Siger);
          addAuthor('作词', item.Works_Music_Lyricist);
          addAuthor('策划', item.Works_Music_Arrange);
          addAuthor('混音', item.Works_Music_Mixer);
          addAuthor('压缩', item.Works_Music_Composer);
        });
      }
      if(temp.length) {
        authors.setAuthor(temp);
      }
    });
  }
});
