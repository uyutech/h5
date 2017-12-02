/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Profile from './Profile.jsx';

class My extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      net.postJSON('/h5/my/index', function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else if(res.code === 1000) {
          self.isLogin = false;
          self.hasData = true;
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  @bind isLogin
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  setData(data) {
    let self = this;
    self.isLogin = true;
    self.hasData = true;

    let profile = self.ref.profile;
    let userInfo = data.userInfo;
    profile.head = userInfo.Head_Url;
    profile.sname = userInfo.NickName;
    profile.sign = userInfo.User_Sign || '';
    profile.updateNickNameTimeDiff = data.updateNickNameTimeDiff || 0;
    profile.updateHeadTimeDiff = data.updateHeadTimeDiff || 0;
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
            self.setData(res.data);
            // jsBridge.setPreference('userInfo', res.data, function(res) {
            //   console.log(res);
            //   jsBridge.getPreference('userInfo', function(data) {
            //     console.log(data);
            //   });
            // });
          }
          else {
            jsBridge.toast(res.message);
          }
        });
      }
    });
  }
  clickOut() {
    let self = this;
    net.postJSON('/h5/login/loginOut', function() {
      self.isLogin = false;
      jsBridge.delPreference('userInfo');
      jsBridge.loginOut();
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="my">
      {
        this.hasData
          ? this.isLogin
            ? <div>
                <Profile ref="profile"/>
                <ul class="list">
                  <li><a href="/my/relation" class="relation">圈关系</a></li>
                  <li><a href="/my/message" class="message">圈消息</a></li>
                  <li><a href="/my/post" class="post">我画的圈</a></li>
                  <li><a href="/my/favor" class="favor">我的收藏</a></li>
                </ul>
                <span class="loginout" onClick={ this.clickOut }>退出登录</span>
              </div>
            : <div class="login">
                <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
              </div>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default My;
