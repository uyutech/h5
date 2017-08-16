/**
 * Created by army on 2017/6/18.
 */

import Carousel from './Carousel.jsx';
import FollowList from './FollowList.jsx';
import Dynamic from '../../component/dynamic/Dynamic.jsx';

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
      'http://bbs.xiguo.net/zq/zz/01.jpg'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    names: ['河图'],
    time: '3天前',
    type: 'weibo',
    action: '发布了微博',
    txt: '加油，天下都是你和我的'
  }
];

class FollowCard extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    this.on(migi.Event.DOM, function() {
      util.postJSON('api/follow/GetUserFollow', { TagSkip: 0, TagTake: 10, AuthorSkip: 0, AuthorTake: 10, WorksSkip: 0, WorksTake: 10 }, function(res) {
        if(res.success) {
          let data = res.data;
          // self.ref.carousel.list = data.GetUserFollowWorks.data;
          self.ref.followList.list1 = data.GetUserFollowTag.data;
          self.ref.followList.autoWidth1();
          self.ref.followList.list2 = data.GetUserFollowAuthor.data;
          self.ref.followList.autoWidth2();
        }
        else {}
      });
    });
  }
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="follow_card">
      <Carousel ref="carousel"/>
      <FollowList ref="followList"/>
      <Dynamic list={ list }/>
    </div>;
  }
}

export default FollowCard;
