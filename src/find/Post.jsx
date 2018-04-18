/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.data = self.props.data;
  }
  @bind data
  render() {
    return <div class="mod-post">
      <a class="pic"
         href={ '/post.html?id=' + this.data }
         title={ this.data.title }>
        <img src={ util.img(this.data.cover, 750, 0, 80) || '/src/common/blank.png' }/>
      </a>
      <div class="txt">
        <span>{ this.data.title }</span>
        <a href={ '/post.html?id=' + this.data }
           title={ this.data.title }>{ this.data.describe }</a>
      </div>
    </div>;
  }
}

export default Post;
