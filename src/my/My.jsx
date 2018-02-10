/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Profile from './Profile.jsx';

const pack = require('../../package.json');

let bindUuid;
let bindName;

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
  @bind message
  @bind confirm
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
        jsBridge.setPreference('loginInfo', data);
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
    self.oauthInfo = data.oauthInfo || [];
    self.oauthHash = {};
    self.oauthInfo.forEach(function(item) {
      self.oauthHash[item.OpenType] = item;
    });
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

    let step = self.userInfo.User_Reg_Stat || 0;
    if(!step || step < 99) {
      jsBridge.pushWindow('/guide.html?step=' + step + '&nickName=' + encodeURIComponent(self.userInfo.NickName || ''), {
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
        jsBridge.weiboLogin({ openID, token }, function(res) {
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            migi.eventBus.emit('LOGIN', data);
            migi.eventBus.emit('USER_INFO', data.userInfo);
            jsBridge.setPreference('loginInfo', data);
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
  refresh() {
    this.init();
  }
  bindPhone() {
    let self = this;
    bindName = '手机';
    jsBridge.pushWindow('/phone.html', {
      title: '绑定手机',
    });
    jsBridge.on('resume', function cb(e) {
      let data = e.data;
      if(data && data.phone) {
        self.init();
      }
      jsBridge.off('resume', cb);
    });
  }
  bindWeibo() {
    let self = this;
    bindName = '微博';
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        net.postJSON('/h5/passport/bindOauth', { openID, token }, function(res) {
          if(res.success) {
            self.init();
          }
          else if(res.code === 1008) {
            bindUuid = res.data;
            self.message = res.message;
            self.confirm = true;
          }
          else if(res.code === 1007) {
            bindUuid = res.data;
            jsBridge.confirm(res.message + '\n该操作将解除该' + bindName + '与其关联账号的绑定哦~', function(res) {
              if(!res) {
                return;
              }
              net.postJSON('/h5/passport/mergeOauth', {
                code: bindUuid,
                type: 2,
              }, function(res) {
                if(res.success) {
                  jsBridge.toast('绑定成功');
                  self.init();
                }
                else {
                  jsBridge.toast(res.message);
                }
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              });
            });
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          jsBridge.hideLoading();
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          jsBridge.hideLoading();
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
  }
  genDom() {
    let self = this;
    return <div>
      <Profile ref="profile" userInfo={ self.userInfo }/>
      <dl class="bind" ref="bind">
        <dt>绑定信息：</dt>
        <dd class={ 'phone' + (self.oauthHash.telphone ? '' : ' dis') }>
          {
            self.oauthHash.telphone
            ? <span>{ self.oauthHash.telphone.OpenID }</span>
            : <button onClick={ self.bindPhone.bind(self) }>绑定</button>
          }
        </dd>
        <dd class={ 'weibo' + (self.oauthHash.weibo ? '' : ' dis') }>
          {
            self.oauthHash.weibo
            ? <span>{ self.oauthHash.weibo.OpenID }</span>
            : <button onClick={ self.bindWeibo.bind(self) }>绑定</button>
          }
        </dd>
      </dl>
      <ul class="list" onClick={ { a: self.clickLink.bind(self) } }>
        <li>
          <a href="/mall.html" class="mall">圈商城<small>（我的圈币：{ self.coins.Coins || 0 }）</small></a>
        </li>
        <li><a href="/relation.html" class="relation">圈关系</a></li>
        <li><a href="/message.html" class="message">圈消息</a></li>
        <li><a href="/mypost.html" class="post">我画的圈</a></li>
        <li><a href="/myfavor.html" class="favor">我的收藏</a></li>
      </ul>
      <a href="https://circling.cc/#/post/91255" class="help" onClick={ function(e) {
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
    else if(jsBridge.isInApp) {
      jsBridge.toast('转圈账号注册登录功能在0.4版本以后提供，请更新客户端~');
      return;
    }
    jsBridge.pushWindow('/passport.html', {
      title: '登录注册',
      backgroundColor: '#b6d1e8'
    });
  }
  clickMerge() {
    let self = this;
    jsBridge.confirm('合并后，会保留此账号之前的作品、发言、圈币和收藏数据~之后再以此账号登录时会直接进入当前账号哦！确定进行合并吗？', function(res) {
      if(!res) {
        return;
      }
      jsBridge.showLoading();
      net.postJSON('/h5/passport/mergeOauth', {
        code: bindUuid,
        type: 1,
      }, function(res) {
        if(res.success) {
          jsBridge.toast('绑定成功');
          self.confirm = false;
          self.init();
        }
        else {
          jsBridge.toast(res.message);
        }
        jsBridge.hideLoading();
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        jsBridge.hideLoading();
      });
    });
  }
  clickBind() {
    let self = this;
    jsBridge.confirm('该操作将注销之前的账号哦~', function(res) {
      if(!res) {
        return;
      }
      jsBridge.showLoading();
      net.postJSON('/h5/passport/mergeOauth', {
        code: bindUuid,
        type: 2,
      }, function(res) {
        if(res.success) {
          jsBridge.toast('绑定成功');
          self.confirm = false;
          self.init();
        }
        else {
          jsBridge.toast(res.message);
        }
        jsBridge.hideLoading();
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        jsBridge.hideLoading();
      });
    });
  }
  clickCancel() {
    this.confirm = false;
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
                <p class="schema">注册即代表同意<span onClick={ function() {
                  jsBridge.pushWindow('https://zhuanquan.xin/schema.html', { title: '用户协议' });
                } }>《转圈用户协议》</span></p>
                <p class="version">版本：{ jsBridge.appVersion + '~' + pack.version }</p>
              </div>
          : <div>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
      <div class={ 'confirm' + (this.confirm ? '' : ' fn-hide') }>
        <div class="c">
          <p>{ this.message }</p>
          <strong>请问这是您之前的账号吗？</strong>
          <button onClick={ this.clickMerge }>是的，我想要合并两个账号</button>
          <button onClick={ this.clickBind }>不是的，我只要绑定手机就可以了</button>
          <button onClick={ this.clickCancel }>算了，还是维持现状吧</button>
        </div>
      </div>
    </div>;
  }
}

export default My;
