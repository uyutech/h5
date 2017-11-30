/**
 * Created by army8735 on 2017/9/14.
 */

class NeedLogin extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clickClose(e) {
    e.preventDefault();
    this.hide();
  }
  clickWeibo(e) {
    e.preventDefault();
    location.href = '/oauth/weibo?goto=' + encodeURIComponent(location.href);
  }
  render() {
    return <div class="cp-mlogin fn-hide">
      <div class="c">
        <h3>您尚未登录...</h3>
        <p>{ this.message || '登录后即可进行相关操作~' }</p>
        <a href="/oauth/weibo" class="weibo" onClick={ this.clickWeibo }>微博登录</a>
        <a href="#" class="close" onClick={ this.clickClose }/>
      </div>
    </div>;
  }
}

export default NeedLogin;
