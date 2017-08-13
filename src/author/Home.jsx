/**
 * Created by army on 2017/6/24.
 */

import HotAlbum from '../index/find/HotAlbum.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import Dynamic from '../component/dynamic/Dynamic.jsx';

let hotAlbum = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zj/z002.jpg',
    name: '漱愿记',
    num: '33w'
  }
];

let list = [
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/03.png',
      'http://bbs.xiguo.net/zq/zz/02.png'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/01.jpg',
    names: ['慕寒', '司夏'],
    time: '1小时前',
    type: 'song',
    action: '发布了歌曲',
    song: '《明月舟》'
  },
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/02.png'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    names: ['司夏'],
    time: '1天前',
    type: 'song',
    action: '发布了歌曲',
    song: '《送郎君》'
  },
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/02.png'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    names: ['司夏'],
    time: '3天前',
    type: 'weibo',
    action: '发布了微博',
    txt: '小伙伴们高考加油！'
  }
];

class Home extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.ref.hotAlbum.autoWidth();
    });
  }
  show() {
    this.element.style.display = 'block';
  }
  hide() {
    this.element.style.display = 'none';
  }
  render() {
    return <div class="home">
      <HotWork authorId={ this.props.authorId } ref="hotWork" title="热门作品"/>
      <HotAlbum ref="hotAlbum" list={ hotAlbum } title="专辑"/>
      <HotAuthor ref="hotAuthor" title="关系"/>
      <h5 class="dynamic">作者动态</h5>
      <Dynamic list={ list }/>
    </div>;
  }
}

export default Home;
