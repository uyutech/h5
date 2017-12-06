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
          userInfo = JSON.parse(userInfo);
          userInfo.ISOpen = self.isPublic;
          jsBridge.setPreference('userInfo', JSON.stringify(userInfo));
        });
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  render() {
    return <div class="top-nav" id="topNav">
      <b class="logo"/>
      <div class={ 'message' + (this.isLogin ? '' : ' fn-hide') } href="/my/message">
        <span>{ this.messageNum || '' }</span>
      </div>
      <span class={ 'public' + (this.isLogin && this.isAuthor ? '' : ' fn-hide') }
            onClick={ this.click }>[{ this.isPublic ? '切换到马甲' : '切换到作者身份' }]</span>
      <div class="user">
        <span class={ 'name' + (this.isPublic ? ' public' : '') }>
          { this.isLogin ? (this.isPublic ? this.authorName : this.name) : '' }
          </span>
        <img src={ this.isLogin ? util.autoSsl(util.img64_64_80(this.head)) || 'src/common/head.png' : 'src/common/head.png' }/>
      </div>
    </div>;
  }
}

export default TopNav;
