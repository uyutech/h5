/**
 * Created by army8735 on 2018/4/3.
 */

'use strict';

class CommentBar extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = 0;
  }
  @bind type
  @bind isLogin
  clickType() {}
  render() {
    return <div class="cp-commentbar">
      <ul class="type"
          onClick={ { li: this.clickType } }>
        <li class={ this.type === 0 ? 'cur' : '' }
            rel={ 0 }>全部评论</li>
        {
          this.isLogin
            ? <li rel="1">我的</li>
            : ''
        }
      </ul>
    </div>
  }
}

export default CommentBar;
