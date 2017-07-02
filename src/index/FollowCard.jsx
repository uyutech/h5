/**
 * Created by army on 2017/6/18.
 */

import Carousel from './follow/Carousel.jsx';
import FollowList from './follow/FollowList.jsx';
import Dynamic from '../component/dynamic/Dynamic.jsx';

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
      <Dynamic/>
    </div>;
  }
}

export default FollowCard;
