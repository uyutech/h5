/**
 * Created by army8735 on 2017/10/6.
 */

'use strict';

class Share extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind url
  show() {
    $(this.element).removeClass('fn-hide');
  }
  click() {
    let input = this.ref.share.element;
    input.focus();
    input.setSelectionRange(0, 9999);
    try{
      document.execCommand('copy');
      jsBridge.toast('分享链接已复制成功，可以分享给亲朋好友啦！如没有复制成功，也可以直接复制输入框中的网址哦！');
    } catch(err) {
      jsBridge.toast('分享链接已复制成功，可以分享给亲朋好友啦！如没有复制成功，也可以直接复制输入框中的网址哦！');
    }
  }
  clickClose() {
    $(this.element).addClass('fn-hide');
  }
  render() {
    return <div class="cp-share fn-hide">
      <div class="c">
        <label>页面地址</label>
        <input class="share" ref="share" type="text" value={ this.url }/>
        <button onClick={ this.click }>复制</button>
        <span class="close" onClick={ this.clickClose }/>
      </div>
    </div>;
  }
}

export default Share;
