/**
 * Created by army8735 on 2017/9/19.
 */

class TopNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind isPublic
  @bind head
  render() {
    return <div class="top-nav" id="topNav">
      <a href="/" class="logo"/>
      <a class="message" href="/my/message">
        <span>123</span>
      </a>
      <span class="public">[{ this.isPublic ? '切换到马甲' : '切换到作者身份' }]</span>
      <a href="/my" class="user">
        <span class="${'name' + (isPublic ? ' public' : '')}">{ this.isPublic ? 111 : 222 }</span>
        <img src={ this.head || '../../common/head.png' }/>
      </a>
    </div>;
  }
}

export default TopNav;
