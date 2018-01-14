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
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', 'a', function(e) {
        e.preventDefault();
        let $a = $(this);
        let url = $a.attr('href');
        let title = $a.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  render() {
    let data = this.props.data;
    let post = data.commentlist[0];
    let content = post.Content;
    content = content.length > 50 ? (content.slice(0, 50) + '...') : content;
    return <div class={ 'mod-post' + (this.props.last ? ' last' : '') }>
      <a href={ '/post.html?postID=' + post.CommentID } title={ data.Describe } class="pic">
        <img src={ util.autoSsl(util.img750__80(data.coverpic || '/src/common/blank.png')) }/>
      </a>
      <div class="txt">
        <span>{ data.Describe }</span>
        <a href={ '/post.html?postID=' + post.CommentID } title={ data.Describe }>{ content }</a>
      </div>
    </div>;
  }
}

export default Post;
