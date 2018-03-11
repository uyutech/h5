/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Config extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getCache('loginInfo', function(loginInfo) {
        if(loginInfo) {
          let oauthInfo = loginInfo.oauthInfo;
          (oauthInfo || []).forEach(function(item) {
            console.log(item);
            switch(item.OpenType) {
              case 'telphone':
                self.phone = item.OpenID;
                break;
              case 'weibo':
                self.weibo = item.OpenID;
                break;
            }
          });
        }
      });
    });
  }
  @bind phone
  @bind weibo
  clickOut() {
    let self = this;
    net.postJSON('/h5/login/loginOut', function() {
      $.cookie('isLogin', null);
      $.cookie('uid', null);
      jsBridge.delPreference('loginInfo');
      jsBridge.loginOut();
      jsBridge.popWindow({
        loginOut: true,
      });
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  clickLink(e) {
    e.preventDefault();
  }
  render() {
    return <div class="config">
      <div class="c">
        <ul class="list"
            onClick={ { a: this.clickLink } }>
          <li><a href="#" class={ 'phone' + (this.phone ? ' has' : '') }>{ this.phone ? ('已绑手机：' + this.phone) : '绑定手机' }</a></li>
          <li><a href="#" class={ 'weibo' + (this.weibo ? ' has' : '') }>{ this.weibo ? ('已绑微博：' + this.weibo) : '绑定微博' }</a></li>
        </ul>
        <ul class="list"
            onClick={ { a: this.clickLink } }>
          <li><a href="/shield.html" class="shield">屏蔽设置</a></li>
        </ul>
      </div>
      <div class="bot">
        <span class="out" onClick={ this.clickOut }>退出登录</span>
      </div>
    </div>;
  }
}

export default Config;
