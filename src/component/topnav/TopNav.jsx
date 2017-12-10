/**
 * Created by army8735 on 2017/9/19.
 */

import net from '../../common/net';
import util from '../../common/util';

let loading;

class TopNav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference('userInfo', function(userInfo) {
        if(userInfo) {
          self.name = userInfo.NickName;
          self.authorName = userInfo.AuthorName;
          self.isAuthor = userInfo.ISAuthor;
          self.head = userInfo.Head_Url;
          self.isPublic = userInfo.ISOpen;
          self.isLogin = true;
          $.cookie('isLogin', true);
          $.cookie('uid', userInfo.UID);
        }
      });
      migi.eventBus.on('LOGIN', function(userInfo) {
        self.name = userInfo.NickName;
        self.authorName = userInfo.AuthorName;
        self.isAuthor = userInfo.ISAuthor;
        self.head = userInfo.Head_Url;
        self.isPublic = userInfo.ISOpen;
        self.isLogin = true;
        $.cookie('isLogin', true);
        $.cookie('uid', userInfo.UID);
      });
      migi.eventBus.on('LOGIN_OUT', function() {
        self.isLogin = false;
        self.messageNum = 0;
        $.cookie('isLogin', false);
        $.cookie('uid', null);
      });
    });
  }
  @bind isLogin
  @bind isPublic
  @bind name
  @bind head
  @bind isAuthor
  @bind authorName
  @bind messageNum
  setNum(data) {
    this.messageNum = data.Count;
  }
  click() {
    if(loading) {
      return;
    }
    loading = true;
    let self = this;
    net.postJSON('/h5/my/altSettle', { public: !self.isPublic }, function(res) {
      if(res.success) {
        self.isPublic = !self.isPublic;
        jsBridge.getPreference('userInfo', function(userInfo) {
          if(!userInfo) {
            return;
          }
          userInfo.ISOpen = self.isPublic;
          jsBridge.setPreference('userInfo', JSON.stringify(userInfo));
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  clickMessage() {
    jsBridge.pushWindow('/message.html', {
      title: '圈消息',
    });
  }
  clickUser() {
    migi.eventBus.emit('CLICK_MENU_USER');
  }
  render() {
    return <div class="top-nav" id="topNav">
      <b class="logo"/>
      <div class={ 'message' + (this.isLogin ? '' : ' fn-hide') } onClick={ this.clickMessage }>
        <span>{ this.messageNum || '' }</span>
      </div>
      <span class={ 'public' + (this.isLogin && this.isAuthor ? '' : ' fn-hide') }
            onClick={ this.click }>[{ this.isPublic ? '切换到马甲' : '切换到作者身份' }]</span>
      <div class="user" onClick={ this.clickUser }>
        <span class={ 'name' + (this.isPublic ? ' public' : '') }>
          { this.isLogin ? (this.isPublic ? this.authorName : this.name) : '' }
          </span>
        <img src={ this.isLogin ? util.autoSsl(util.img64_64_80(this.head)) || 'src/common/head.png' : 'src/common/head.png' }/>
      </div>
    </div>;
  }
}

export default TopNav;
