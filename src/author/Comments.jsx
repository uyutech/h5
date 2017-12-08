/**
 * Created by army8735 on 2017/9/19.
 */

import util from '../common/util';
import net from '../common/net';
import Comment from '../component/comment/Comment.jsx';

let take = 30;
let skip = take;
let sortType = 0;
let myComment = 0;
let currentCount = 0;
let ajax;
let loading;
let loadEnd;
let hidden;

class Comments extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    hidden = this.props.hidden;
    self.authorID = self.props.authorID;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      if(self.props.commentData.Size <= take) {
        loadEnd = true;
        self.ref.comment.message = '已经到底了';
      }
    });
  }
  @bind authorID
  show() {
    let self = this;
    $(self.element).removeClass('fn-hide');
    hidden = false;
  }
  hide() {
    let self = this;
    $(self.element).addClass('fn-hide');
    hidden = true;
  }
  checkMore($window) {
    if(hidden || loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
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
    ajax = net.postJSON('/api/author/commentList', { authorID: self.authorID, skip, take, sortType, myComment, currentCount }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(data.data.length) {
          comment.appendData(data.data);
        }
        if(skip >= data.Size) {
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
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    currentCount = 0;
    sortType = rel;
    skip = 0;
    if(ajax) {
      ajax.abort();
    }
    loadEnd = false;
    loading = false;
    this.ref.comment.clearData();
    this.load();
  }
  switchType2(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    currentCount = 0;
    myComment = rel;
    skip = 0;
    if(ajax) {
      ajax.abort();
    }
    loadEnd = false;
    loading = false;
    this.ref.comment.clearData();
    this.load();
  }
  render() {
    return <div class={ 'comments' + (this.props.hidden ? ' fn-hide' : '') }>
      <div class="fn">
        <ul class="type fn-clear" onClick={ { li: this.switchType2 } }>
          <li class="cur" rel="0">全部评论<small>{ this.props.commentData.Count }</small></li>
          {
            this.props.isLogin
              ? <li rel="1">我的</li>
              : ''
          }
        </ul>
        <ul class="type2 fn-clear" onClick={ { li: this.switchType } }>
          <li class="cur" rel="0">最新</li>
          <li rel="1">最热</li>
        </ul>
      </div>
      <Comment ref="comment"
               zanUrl="/api/author/likeComment"
               subUrl="/api/author/subCommentList"
               delUrl="/api/author/delComment"
               data={ this.props.commentData.data }
               message={ (!this.props.commentData.Size || this.props.commentData.Size > take) ? '' : '已经到底了' }/>
    </div>;
  }
}

export default Comments;
