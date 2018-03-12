/**
 * Created by army8735 on 2017/9/19.
 */

import util from '../common/util';
import net from '../common/net';
import Comment from '../component/comment/Comment.jsx';

let take = 30;
let skip = 0;
let sortType = 0;
let myComment = 0;
let currentCount = 0;
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
  setData(data) {
    let self = this;
    self.ref.comment.setData(data.data);
    skip += take;
    if(data.Size > take) {
      let $window = $(window);
      $window.on('scroll', function() {
        if(!self.visible) {
          return;
        }
        self.checkMore($window);
      });
    }
    else {
      self.ref.comment.message = '已经到底了';
    }
    jsBridge.on('resume', function(e) {
      let data = e.data;
      if(data) {
        if(data.RootID > 0) {
          self.ref.comment.prependChild(data);
        }
        else {
          self.ref.comment.prependData(data);
        }
      }
    });
  }
  checkMore($window) {
    if(loading || loadEnd) {
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
    ajax = net.postJSON('/h5/author/commentList', { authorID: self.authorId, skip, take, sortType, myComment, currentCount }, function(res) {
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
    this.ref.comment.empty = false;
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
    this.ref.comment.empty = false;
    this.load();
  }
  render() {
    return <div class={ 'comments' + (this.visible ? '' : ' fn-hide') }>
      <div class="fn">
        <ul class="type fn-clear" onClick={ { li: this.switchType2 } }>
          <li class="cur" rel="0">全部评论<small>{ this.count }</small></li>
          {
            this.isLogin
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
               zanUrl="/h5/author/likeComment"
               subUrl="/h5/author/subCommentList"
               delUrl="/h5/author/delComment"
               on-chooseSubComment={ function(rid, cid, name, n) { this.emit('chooseSubComment', rid, cid, name, n) } }
               on-closeSubComment={ function() { this.emit('closeSubComment') } }/>
    </div>;
  }
}

export default Comments;
