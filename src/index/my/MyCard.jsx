/**
 * Created by army on 2017/6/23.
 */
 
import Profile from './Profile.jsx';
import Types from './Types.jsx';

class MyCard extends migi.Component {
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
    return <div class="my_card">
      <Profile/>
      <p class="sign">签名</p>
      <Types/>
    </div>;
  }
}

export default MyCard;
