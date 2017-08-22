/**
 * Created by army on 2017/6/18.
 */

import Carousel from './Carousel.jsx';
import FollowList from './FollowList.jsx';
import Dynamic from '../../component/dynamic/Dynamic.jsx';

class FollowCard extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    this.on(migi.Event.DOM, function() {
      util.postJSON('api/follow/GetUserFollow', { TagSkip: 0, TagTake: 10, AuthorSkip: 0, AuthorTake: 10, WorksSkip: 0, WorksTake: 10, DynamicSkip: 0, DynamicTake: 10 }, function(res) {
        if(res.success) {
          let data = res.data;
          self.ref.carousel.list = data.GetUserFollowWorks.data;
          self.ref.carousel.init();
          self.ref.followList.list1 = data.GetUserFollowTag.data;
          self.ref.followList.autoWidth1();
          self.ref.followList.list2 = data.GetUserFollowAuthor.data;
          self.ref.followList.autoWidth2();
          self.ref.dynamic.list = data.GetAuthorDynamic.data;
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
      <Dynamic ref="dynamic"/>
    </div>;
  }
}

export default FollowCard;
