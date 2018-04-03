/**
 * Created by army8735 on 2017/9/19.
 */

import util from '../common/util';
import net from '../common/net';
import CommentBar from '../component/commentbar/CommentBar.jsx';
import Comment from '../component/comment/Comment.jsx';

let limit;
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
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  setData(authorId, data) {
    let self = this;
    self.authorId = authorId;
    limit = data.limit;
    offset = limit;
    if(data.size) {
      self.ref.comment.setData(data.data);
      if(data.size > limit) {
        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
    }
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
    let comment = self.ref.comment;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    comment.message = '正在加载...';
    ajax = net.postJSON('/h5/author2/comment', { authorId: self.authorId, offset, limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += limit;
        if(data.data.length) {
          comment.appendData(data.data);
        }
        if(offset >= data.size) {
          loadEnd = true;
          comment.message = '已经到底了';
        }
        else {
          comment.message = '';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  render() {
    return <div class={ 'comments' + (this.visible ? '' : ' fn-hide') }>
      <CommentBar ref="commentBar"/>
      <Comment ref="comment"
               on-chooseSubComment={ function(rid, cid, name, n) { this.emit('chooseSubComment', rid, cid, name, n) } }
               on-closeSubComment={ function() { this.emit('closeSubComment') } }/>
    </div>;
  }
}

export default Comments;
