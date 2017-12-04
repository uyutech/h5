/**
 * Created by army8735 on 2017/9/19.
 */

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
  render() {
    return <div class="top-nav" id="topNav">
      <b class="logo"/>
      <div class={ 'message' + (this.isLogin ? '' : ' fn-hide') } href="/my/message">
        <span></span>
      </div>
      <span class={ (this.isLogin && this.isAuthor ? '' : 'fn-hide') + ' public' }>[{ this.isPublic ? '切换到马甲' : '切换到作者身份' }]</span>
      <div class="user">
        <span class={ 'name' + (this.isPublic ? ' public' : '') }>{ this.isLogin ? (this.isPublic ? this.authorName : this.name) : '' }</span>
        <img src={ (this.isLogin && this.head) || 'src/common/head.png' }/>
      </div>
    </div>;
  }
}

export default TopNav;
