/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';

const pack = require('../../package.json');

let scrollY = 0;
let ajax;

let currentPriority = 0;
let cacheKey = 'my';

class My extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      self.init();
      jsBridge.on('resume', function(e) {
        if(e.data) {
          if(e.data.loginOut) {
            self.isLogin = false;
            self.setData(null, 1);
            jsBridge.delPreference(cacheKey);
            $.cookie('isLogin', null);
          }
          else if(e.data.guide || e.data.login) {
            self.init();
          }
        }
      });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    $util.scrollY(scrollY);
  }
  @bind isLogin
  @bind coins
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/my/index', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
        self.isLogin = true;
        $.cookie('isLogin', true);
      }
      else if(res.code === 1000) {
        self.isLogin = false;
        self.setData(null, 1);

        jsBridge.delPreference(cacheKey);
        $.cookie('isLogin', null);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let nav = self.ref.nav;

    if(data && data.user) {
      self.coins = data.user.coins;
      nav.setData(data.user, data.author, data.followPersonCount, data.fansCount);
      if(priority === 1) {
        let regState = data.user.regState || 0;
        let isAuthor = !!(data.author && data.author.length);
        let settle = isAuthor ? data.author[0].settle : 0;
        if(isAuthor && settle === 0 || regState < 99) {
          jsBridge.pushWindow('/guide.html?regState=' + regState + '&nickname='
            + encodeURIComponent(data.user.nickname || '')
            + '&isAuthor=' + isAuthor
            + '&authorId=' + (isAuthor ? data.author[0].id : '')
            + '&authorName=' + (isAuthor ? data.author[0].name : '')
            + '&settle=' + settle, {
            title: '用户引导',
          });
        }
      }
    }
    else {
      self.coins = 0;
      nav.setData();
    }
  }
  clickWeibo() {
    let self = this;
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openId = res.openId || res.openID;
        let token = res.token;
        jsBridge.login('/h5/passport/loginWeibo', { openId, token }, function(res) {
          jsBridge.hideLoading();
          if(res.success) {
            let data = res.data;
            self.setData(data, 1);
            self.isLogin = true;

            jsBridge.setPreference(cacheKey, data);
            $.cookie('isLogin', true);
            migi.eventBus.emit('LOGIN');
          }
          else {
            jsBridge.toast(res.message);
          }
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
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
    jsBridge.pushWindow('/passport.html', {
      title: '登录注册',
      backgroundColor: '#b6d1e8',
      transparentTitle: true,
    });
  }
  render() {
    return <div class={ 'my' + (this.visible ? '' : ' fn-hide') }>
      <Background/>
      <Nav ref="nav"
           cacheKey={ cacheKey }/>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/my_message.html" class="message">圈消息</a></li>
        <li><a href="/my_relation.html" class="relation">圈关系</a></li>
        <li>
          <a href="/mall.html" class="mall">圈商城<small>（<b/>圈币：{ this.coins || 0 }）</small></a>
        </li>
        <li><a href="/my_address.html" class="address">收货地址</a></li>
      </ul>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/my_favor.html" class="favor">我的收藏</a></li>
        <li><a href="/my_post.html" class="post">我画的圈</a></li>
        <li><a href="/my_download.html" class="download">我的下载</a></li>
      </ul>
      <ul class={ 'list' + (this.isLogin ? '' : ' fn-hide') }
          onClick={ { a: this.clickLink } }>
        <li><a href="/post.html?id=91255" class="help">帮助中心</a></li>
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
