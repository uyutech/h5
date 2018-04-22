/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

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
    self.on(migi.Event.DOM, function() {
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.type && data.type === 'subComment') {
          self.ref.comment.prependData(data.data);
        }
      });
    });
  }
  @bind visible
  setData(id, data) {
    let self = this;
    self.id = id;
    if(data) {
      offset = data.limit;
      self.ref.comment.setData(data.data);
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
    if($util.isBottom()) {
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
    ajax = $net.postJSON('/h5/works2/commentList', { id: self.id, offset }, function(res) {
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
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  reply(id) {
    jsBridge.pushWindow('/sub_comment.html?type=2&id=' + this.id + '&pid=' + id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class={ 'mod-comment' + (this.visible ? '' : ' fn-hide') }>
      <CommentBar ref="commentBar"/>
      <Comment ref="comment"
               message="正在加载..."
               on-reply={ this.reply }/>
    </div>;
  }
}

export default Comments;
