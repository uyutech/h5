/**
 * Created by army8735 on 2017/9/19.
 */

import Background from '../background/Background.jsx';

class TopNav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {

    });
  }
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  click() {
    jsBridge.pushWindow('/search.html', {
      hideBackButton: true,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="top-nav fn-hide" id="topNav">
      <b class="search"
         onClick={ this.click }/>
      <input type="text"
             placeholder="搜索音乐、图片、视频、帖子..."
             readonly="true"
             onClick={ this.click }/>
      <Background/>
    </div>;
  }
}

export default TopNav;
