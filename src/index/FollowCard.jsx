/**
 * Created by army on 2017/6/18.
 */

import Carousel from './follow/Carousel.jsx';
import FollowList from './follow/FollowList.jsx';
import News from './follow/News.jsx';

class FollowCard extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="follow_card">
      <Carousel/>
      <FollowList/>
      <News/>
    </div>;
  }
}

export default FollowCard;
