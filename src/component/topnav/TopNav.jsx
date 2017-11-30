/**
 * Created by army8735 on 2017/9/19.
 */

class TopNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind isLogin
  @bind isPublic
  @bind head
  render() {
    return <div class="top-nav" id="topNav">
      <b class="logo"/>
      <div class={ 'message' + (this.hasData && this.isLogin ? '' : ' fn-hide') } href="/my/message">
        <span></span>
      </div>
      <span class={ (this.hasData && this.isLogin ? '' : 'fn-hide') + ' public' }>[{ this.isPublic ? '切换到马甲' : '切换到作者身份' }]</span>
      <div class="user">
        <span class={ 'name' + (this.isPublic ? ' public' : '') }>{ this.hasData && this.isLogin ? (this.isPublic ? 111 : 222) : '' }</span>
        <img src={ this.head || 'src/common/head.png' }/>
      </div>
    </div>;
  }
}

export default TopNav;
