/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';

const pack = require('../../package.json');

let ajax;

class My extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.coins = {};
    if(self.props.loginInfo) {
      let userInfo = self.props.loginInfo.userInfo;
      if(userInfo) {
        self.isLogin = true;
      }
    }
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('LOGIN', function(loginInfo) {
        self.setData(loginInfo);
      });
      self.init();
    });
    jsBridge.on('resume', function(e) {
      if(e.data && e.data.guide) {
        self.init();
      }
      if(e.data && e.data.loginOut) {
        self.isLogin = false;
        self.ref.nav.userInfo = null;
      }
    });
  }
  @bind isLogin
  @bind coins
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/my/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data);
        jsBridge.setPreference('loginInfo', data);
        $.cookie('isLogin', true);
        $.cookie('uid', data.userInfo.UID);
        $.cookie('userType', data.userInfo.UserType);
      }
      else if(res.code === 1000) {
        self.isLogin = false;
        jsBridge.delPreference('loginInfo');
        $.cookie('isLogin', null);
        $.cookie('uid', null);
        $.cookie('userType', null);
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
    self.oauthInfo = data.oauthInfo || [];
    self.oauthHash = {};
    self.oauthInfo.forEach(function(item) {
      self.oauthHash[item.OpenType] = item;
    });
    self.bonusPoint = data.bonusPoint;
    self.coins = data.coins || {};

    self.isLogin = true;

    let nav = self.ref.nav;
    nav.userInfo = data.userInfo;

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

    nav.updateNickNameTimeDiff = updateNickNameTimeDiff;
    nav.updateHeadTimeDiff = updateHeadTimeDiff;

    let step = self.userInfo.User_Reg_Stat || 0;
    let basicAuthor = null;
    let userToAuthorList = self.userInfo.userToAuthorList || [];
    for(let i = 0, len = userToAuthorList.length; i < len; i++) {
      if(userToAuthorList[i].Type === 0) {
        basicAuthor = userToAuthorList[i];
        break;
      }
    }
    if((basicAuthor && basicAuthor.State === 0) || step < 99) {
      jsBridge.pushWindow('/guide.html?step=' + step + '&nickName='
        + encodeURIComponent(self.userInfo.NickName || '')
        + '&isAuthor=' + !!basicAuthor
        + '&authorId=' + (basicAuthor ? basicAuthor.AuthorID : '')
        + '&authorName=' + (basicAuthor ? basicAuthor.AuthorName : '')
        + '&authorState=' + (basicAuthor ? basicAuthor.State : ''), {
        title: '用户引导',
      });
    }
  }
  clickWeibo() {
    let self = this;
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        jsBridge.login('/h5/oauth/weibo', { openID, token }, function(res) {
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            migi.eventBus.emit('LOGIN', data);
            jsBridge.setPreference('loginInfo', data);
            $.cookie('isLogin', true);
            $.cookie('uid', data.userInfo.UID);
            $.cookie('userType', data.userInfo.UserType);
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
  clickLink(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.children[0];
    jsBridge.pushWindow(url, {
      title,
    });
  }
  refresh() {
    this.init();
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
    else if(jsBridge.isInApp) {
      jsBridge.toast('转圈账号注册登录功能在0.4版本以后提供，请更新客户端~');
      return;
    }
    jsBridge.pushWindow('/passport.html', {
      title: '登录注册',
      backgroundColor: '#b6d1e8',
    });
  }
  render() {
    return <div class="my">
      <Background/>
      <Nav ref="nav"
           loginInfo={ this.props.loginInfo }/>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/message.html" class="message">圈消息</a></li>
        <li><a href="/relation.html" class="relation">圈关系</a></li>
        <li>
          <a href="/mall.html" class="mall">圈商城<small>（<b/>圈币：{ this.coins.Coins || 0 }）</small></a>
        </li>
      </ul>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/myfavor.html" class="favor">我的收藏</a></li>
        <li><a href="/mypost.html" class="post">我画的圈</a></li>
      </ul>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/post.html?postId=91255" class="help">帮助中心</a></li>
        <li><a href="/config.html" class="config">系统设置</a></li>
      </ul>
      <div class={ 'login' + (this.isLogin ? ' fn-hide' : '') }>
        <span class="passport" onClick={ this.clickLogin }>转圈账号</span>
        <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
        <p class="schema">注册即代表同意<span onClick={ function() {
          jsBridge.pushWindow('https://zhuanquan.xin/schema.html', { title: '用户协议' });
        } }>《转圈用户协议》</span></p>
      </div>
      <p class="version">版本：{ jsBridge.appVersion + '~' + pack.version }</p>
    </div>;
  }
}

export default My;
