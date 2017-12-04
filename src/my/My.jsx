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
    if(self.props.userInfo) {
      self.userInfo = self.props.userInfo;
      self.isLogin = true;
      self.hasData = true;
    }
    if(self.props.bonusPoint) {
      self.bonusPoint = self.props.bonusPoint;
    }
    self.on(migi.Event.DOM, function() {
      net.postJSON('/h5/my/index', function(res) {
        if(res.success) {
          let data = res.data;
          self.setData(data);
          migi.eventBus.emit('LOGIN', data.userInfo);
          jsBridge.setPreference('userInfo', JSON.stringify(data.userInfo));
          jsBridge.setPreference('bonusPoint', JSON.stringify(data.bonusPoint));
        }
        else if(res.code === 1000) {
          self.isLogin = false;
          self.hasData = true;
          jsBridge.delPreference('userInfo');
          jsBridge.delPreference('bonusPoint');
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
    self.userInfo = data.userInfo;
    self.bonusPoint = data.bonusPoint;

    self.hasData = true;
    self.isLogin = true;

    let profile = self.ref.profile;
    profile.head = self.userInfo.Head_Url;
    profile.sname = self.userInfo.NickName;
    profile.sign = self.userInfo.User_Sign || '';
    profile.updateNickNameTimeDiff = data.updateNickNameTimeDiff || 0;
    profile.updateHeadTimeDiff = data.updateHeadTimeDiff || 0;

    if(self.bonusPoint && self.bonusPoint.ranking) {
      $(self.element).find('.bp .rank').html(`全站排名 ${ self.bonusPoint.ranking } 名`);
    }
  }
  clickWeibo() {
    let self = this;
    jsBridge.loginWeibo(function(res) {
      res = JSON.parse(res);
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        jsBridge.weiboLogin({ openID, token }, function(res) {
          res = JSON.parse(res);
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            self.setData(data);
            migi.eventBus.emit('LOGIN', data.userInfo);
            jsBridge.setPreference('userInfo', JSON.stringify(data.userInfo));
            jsBridge.setPreference('bonusPoint', JSON.stringify(data.bonusPoint));
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
  clickOut() {
    let self = this;
    net.postJSON('/h5/login/loginOut', function() {
      self.isLogin = false;
      migi.eventBus.emit('LOGIN_OUT');
      jsBridge.delPreference('userInfo');
      jsBridge.delPreference('bonusPoint');
      jsBridge.loginOut();
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  genDom() {
    let self = this;
    return <div>
      <Profile ref="profile" userInfo={ self.userInfo }/>
      <ul class="list">
        <li><a href="/my/relation" class="relation">圈关系</a></li>
        <li><a href="/my/message" class="message">圈消息</a></li>
        <li><a href="/my/post" class="post">我画的圈</a></li>
        <li><a href="/my/favor" class="favor">我的收藏</a></li>
      </ul>
      {
        self.bonusPoint && self.bonusPoint.ranking
          ? <div class="bp">
              <p class="rank">全站排名 { self.bonusPoint.ranking } 名</p>
              <p><small>以上是截止到11月30日晚0点的积分排名哦。1-10名的小伙伴将获得异世谣随机签名手账一份~11-200名的小伙伴将获得异世谣空白手账一份~
                <br/>福利详情页将和圈币系统一起尽快上线，请耐心等待哦！
                <br/>另外本周末我们将在11-100名中随机抽取3名小伙伴升级为随机签名手账。
                <br/>没进前200的小伙伴们也不用气馁，之前的所有努力都会积累圈币~很快就会上线圈币兑换福利的功能哦！</small></p>
            </div>
          : ''
      }
      <span class="loginout" onClick={ self.clickOut.bind(this) }>退出登录</span>
    </div>;
  }
  render() {
    return <div class="my">
      {
        this.hasData
          ? this.isLogin
            ? this.genDom()
            : <div class="login">
                <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
              </div>
          : <div>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default My;
