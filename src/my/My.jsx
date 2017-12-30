/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Profile from './Profile.jsx';

const pack = require('../../package.json');

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
      migi.eventBus.on('LOGIN', function(loginInfo) {
        self.setData(loginInfo);
      });
      self.init();
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
  init() {
    let self = this;
    net.postJSON('/h5/my/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data);
        jsBridge.setPreference('loginInfo', JSON.stringify(data));
      }
      else if(res.code === 1000) {
        self.isLogin = false;
        self.hasData = true;
        jsBridge.delPreference('loginInfo');
        migi.eventBus.emit('LOGIN_OUT');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;
    self.userInfo = data.userInfo;
    self.bonusPoint = data.bonusPoint;
    self.coins = data.coins || {};

    self.hasData = true;
    self.isLogin = true;

    let profile = self.ref.profile;
    profile.head = self.userInfo.Head_Url;
    profile.sname = self.userInfo.NickName;
    profile.sign = self.userInfo.User_Sign || '';

    let now = Date.now();
    let lastUpdateNickNameTime = data.lastUpdateNickNameTime;
    if(lastUpdateNickNameTime) {
      lastUpdateNickNameTime = new Date(lastUpdateNickNameTime);
    }
    else {
      lastUpdateNickNameTime = 0;
    }
    let updateNickNameTimeDiff = now - lastUpdateNickNameTime;
    let lastUpdateHeadTime = data.lastUpdateHeadTime;
    if(lastUpdateHeadTime) {
      lastUpdateHeadTime = new Date(lastUpdateHeadTime);
    }
    else {
      lastUpdateHeadTime = 0;
    }
    let updateHeadTimeDiff = now - lastUpdateHeadTime;

    profile.updateNickNameTimeDiff = updateNickNameTimeDiff;
    profile.updateHeadTimeDiff = updateHeadTimeDiff;

    if(self.bonusPoint && self.bonusPoint.ranking) {
      $(self.element).find('.bp .rank').html(`全站排名 ${ self.bonusPoint.ranking } 名`);
    }
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
            $.cookie('isLogin', true);
            $.cookie('uid', data.userInfo.UID);
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
      $.cookie('isLogin', null);
      $.cookie('uid', null);
      jsBridge.delPreference('loginInfo');
      jsBridge.loginOut();
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  clickLink(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.children[0];
    if(!url) {
      throw new Error('my url is null');
    }
    jsBridge.pushWindow(url, {
      title,
    });
  }
  clickPrize(e, vd, tvd) {
    let $button = $(tvd.element);
    if($button.hasClass('loading')) {
      return;
    }
    $button.addClass('loading');
    let cartID = tvd.props.rel;
    let idx = tvd.props.idx;
    if($button.hasClass('cancel')) {
      net.postJSON('/h5/my/cancelPrize', { cartID }, function(res) {
        if(res.success) {
          $button.text('发货').removeClass('cancel');
          jsBridge.getPreference('loginInfo', function(loginInfo) {
            if(!loginInfo) {
              return;
            }
            loginInfo.prize[idx].State = 1;
            jsBridge.setPreference('loginInfo', JSON.stringify(loginInfo));
          });
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $button.removeClass('loading');
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        $button.removeClass('loading');
      });
      return;
    }
    net.postJSON('/h5/my/sendPrize', { cartID }, function(res) {
      if(res.success) {
        $button.replaceWith('<span>已确认发货</span>');
        jsBridge.getPreference('loginInfo', function(loginInfo) {
          if(!loginInfo) {
            return;
          }
          loginInfo.prize[idx].State = 2;
          jsBridge.setPreference('loginInfo', JSON.stringify(loginInfo));
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      $button.removeClass('loading');
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      $button.removeClass('loading');
    });
  }
  refresh() {
    this.init();
  }
  genDom() {
    let self = this;
    return <div>
      <Profile ref="profile" userInfo={ self.userInfo }/>
      <ul class="list" onClick={ { a: self.clickLink.bind(self) } }>
        <li><a href="/mall.html" class="mall">圈商城<small>（我的圈币：{ self.coins.Coins || 0 }）</small></a></li>
        <li><a href="/relation.html" class="relation">圈关系</a></li>
        <li><a href="/message.html" class="message">圈消息</a></li>
        <li><a href="/mypost.html" class="post">我画的圈</a></li>
        <li><a href="/myfavor.html" class="favor">我的收藏</a></li>
      </ul>
      <a href="http://circling.cc/#/post/91255" class="help" onClick={ function(e) {
        e.preventDefault();
        jsBridge.pushWindow('/post.html?postID=91255', {
          title: '帮助中心'
        });
      } }>
        <img class="pic" src={ util.autoSsl(util.img60_60_80('//zhuanquan.xyz/temp/f3bcae7e2f60d9729a0e205dfb39ca6e.jpg')) }/>
        <span>帮助中心</span>
      </a>
      <span class="loginout" onClick={ self.clickOut.bind(this) }>退出登录</span>
      <p class="version">版本：{ jsBridge.appVersion + '~' + pack.version }</p>
    </div>;
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
  render() {
    return <div class="my">
      {
        this.hasData
          ? this.isLogin
            ? this.genDom()
            : <div class="login">
                <span class="passport" onClick={ this.clickLogin }>转圈账号</span>
                <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
                <p class="version">版本：{ jsBridge.appVersion + '~' + pack.version }</p>
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
