/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import Post from './Post.jsx';
import Article from './Article.jsx';

class SubPost extends migi.Component {
  constructor(...data) {
    super(...data);
    this.index = 0;
  }
  @bind index
  init(data) {
    this.ref.post.init(data);
  }
  click(e, vd, tvd) {
    if(this.index === tvd.props.rel) {
      return;
    }
    this.index = tvd.props.rel
  }
  render() {
    return <div class="sub-post">
      <ul class="tab"
          onClick={ { li: this.click } }>
        <li class={ this.index === 0 ? 'cur' : '' }
            rel={ 0 }>画圈</li>
        <li class={ this.index === 1 ? 'cur' : '' }
            rel={ 1 }>约稿</li>
      </ul>
      <Post ref="post"
            @visible={ this.index === 0 }/>
      <Article ref="article"
               @visible={ this.index === 1 }/>
    </div>;
  }
}

export default SubPost;
