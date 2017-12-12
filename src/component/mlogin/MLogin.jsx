import util from "../../common/util";

/**
 * Created by army8735 on 2017/9/14.
 */

class NeedLogin extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clickClose(e) {
    e.preventDefault();
    this.hide();
  }
  clickWeibo() {
    let self = this;
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        jsBridge.weiboLogin({ openID, token }, function(res) {
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            migi.eventBus.emit('LOGIN', data);
            migi.eventBus.emit('USER_INFO', data.userInfo);
            jsBridge.setPreference('loginInfo', JSON.stringify(data));
            self.hide();
          }
          else {
            jsBridge.toast(res.message);
          }
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
  }
  render() {
    return <div class="cp-mlogin fn-hide">
      <div class="c">
        <h3>您尚未登录...</h3>
        <p>{ this.message || '登录后即可进行相关操作~' }</p>
        <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
        <a href="#" class="close" onClick={ this.clickClose }/>
      </div>
    </div>;
  }
}

export default NeedLogin;
