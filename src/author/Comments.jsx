/**
 * Created by army8735 on 2017/9/19.
 */

import util from '../common/util';
import net from '../common/net';
import CommentBar from '../component/commentbar/CommentBar.jsx';
import Comment from '../component/comment/Comment.jsx';

let offset;
let ajax;
let loading;
let loadEnd;

class Comments extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  setData(authorId, data) {
    let self = this;
    self.authorId = authorId;
    if(data) {
      offset = data.limit;
      self.ref.comment.setData(data.data);
      if(offset >= data.count) {
        self.ref.comment.message = '已经到底了';
      }
    }
  }
  listenScroll() {
    let self = this;
    window.addEventListener('scroll', function() {
      self.checkMore();
    });
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd || !self.visible) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let comment = self.ref.comment;
    comment.message = '正在加载...';
    loading = true;
    ajax = net.postJSON('/h5/author2/commentList', { authorId: self.authorId, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.data.length) {
          comment.appendData(data.data);
        }
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          comment.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  reply(id) {
    jsBridge.pushWindow('/subcomment.html?type=1&id=' + this.authorId + '&pid=' + id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class={ 'mod-comments' + (this.visible ? '' : ' fn-hide') }>
      <CommentBar ref="commentBar"/>
      <Comment ref="comment"
               message="正在加载..."
               on-reply={ this.reply }/>
    </div>;
  }
}

export default Comments;
