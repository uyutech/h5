import util from "../../common/util";

/**
 * Created by army8735 on 2017/9/14.
 */

class NeedLogin extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.passport && util.isLogin()) {
          self.hide();
        }
      });
    });
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
  clickLogin() {
    if(jsBridge.appVersion) {
      let version = jsBridge.appVersion.split('.');
      let minor = parseInt(version[1]) || 0;
      if(minor < 4) {
        jsBridge.toast('转圈账号注册登录功能在0.4版本以后提供，请更新客户端~');
        return;
      }
    }
    else {
      jsBridge.toast('转圈账号注册登录功能在0.4版本以后提供，请更新客户端~');
      return;
    }
    jsBridge.pushWindow('/passport.html', {
      title: '登录注册',
      backgroundColor: '#b6d1e8'
    });
  }
  clickWeibo() {
    let self = this;
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        jsBridge.login(window.ROOT_DOMAIN + '/h5/oauth/weibo', { openID, token }, function(res) {
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            migi.eventBus.emit('LOGIN', data);
            migi.eventBus.emit('USER_INFO', data.userInfo);
            jsBridge.setPreference('loginInfo', data);
            $.cookie('isLogin', true);
            $.cookie('uid', data.userInfo.UID);
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
        <span class="passport" onClick={ this.clickLogin }>转圈账号</span>
        <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
        <p class="schema">注册即代表同意<span onClick={ function() {
          jsBridge.pushWindow('https://zhuanquan.xin/schema.html', { title: '用户协议' });
        } }>《转圈用户协议》</span></p>
        <a href="#" class="close" onClick={ this.clickClose }/>
      </div>
    </div>;
  }
}

export default NeedLogin;
