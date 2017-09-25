/**
 * Created by army8735 on 2017/9/20.
 */

import Profile from './Profile.jsx';
import Types from './Types.jsx';

class My extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clickOut(e) {
    e.preventDefault();
    util.postJSON('api/users/Cancellation', function(res) {
      location.reload(true);
    });
  }
  render() {
    return <div class="my">
      <Profile/>
      <Types/>
      <a href="#" class="logout" onClick={ this.clickOut }>退出登录</a>
    </div>;
  }
}

export default My;
