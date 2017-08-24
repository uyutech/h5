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
  clickOut(e) {
    e.preventDefault();
    jsBridge.showLoading();
    util.postJSON('api/users/Cancellation', function(res) {
      jsBridge.hideLoading();
      jsBridge.setPreference('sessionid', null, function() {
        //
      });
    }, function(res) {
      jsBridge.hideLoading();
      jsBridge.setPreference('sessionid', null, function() {
        //
      });
    });
  }
  render() {
    return <div class="my_card">
      <Profile/>
      <p class="sign">签名</p>
      <Types/>
      <a href="#" class="logout" onClick={ this.clickOut }>退出登录</a>
    </div>;
  }
}

export default MyCard;
