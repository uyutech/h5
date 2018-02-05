/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

import Comment from '../component/comment/Comment.jsx';
import util from "../common/util";
import net from "../common/net";

let take = 30;
let skip = take;
let sortType = 0;
let myComment = 0;
let ajax;
let loading;
let loadEnd;
let visible;

class CommentWrap extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isLogin = util.isLogin();
    self.on(migi.Event.DOM, function() {
      let $body = $(document.body);
      $body.on('click', function() {
        self.showSort = false;
      });
    });
    jsBridge.on('resume', function(e) {
      let data = e.data;console.log(data)
      if(data) {
        if(data.rid) {
          self.ref.comment.prependChild(data);
        }
        else {
          self.ref.comment.prependData(data);
        }
      }
    });
  }
  @bind worksId
  @bind showSort
  @bind sortText
  @bind isLogin
  setData(data) {
    let self = this;
    if(data.Size) {
      self.ref.comment.appendData(data.data);
      if(data.Size > take) {
        let $window = $(window);
        $window.on('scroll', function() {
          self.checkMore($window);
        });
      }
    }
  }
  checkMore($window) {
    if(loading || loadEnd || !visible) {
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
    ajax = net.postJSON('/h5/works/commentList', { worksID: self.worksId, skip, take, sortType, myComment }, function(res) {
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
  show() {
    visible = true;
  }
  hide() {
    visible = false;
  }
  clickType(e, vd, tvd) {
    let self = this;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    myComment = tvd.props.rel;
    skip = 0;
    if(ajax) {
      ajax.abort();
    }
    loadEnd = false;
    loading = false;
    self.ref.comment.clearData();
    self.ref.comment.empty = false;
    self.load();
  }
  clickSort(e) {
    e.stopPropagation();
    this.showSort = true;
  }
  clickSelSort(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showSort = false;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    self.sortText = tvd.children[0];
    sortType = tvd.props.rel;
    skip = 0;
    if(ajax) {
      ajax.abort();
    }
    loadEnd = false;
    loading = false;
    self.ref.comment.clearData();
    self.ref.comment.empty = false;
    self.load();
  }
  chooseSubComment(rid, cid, name, n) {
    let self = this;
    if(!n || n === '0') {
      jsBridge.pushWindow('/subcomment.html?type=3&id='
        + self.worksId + '&cid=' + cid + '&rid=' + rid, {
        title: '评论',
      });
    }
  }
  render() {
    return <div class="mod-comment">
      <div class="fn">
        <ul class="type fn-clear" onClick={ { li: this.clickType } }>
          <li class="cur" rel="0">全部评论</li>
          {
            this.isLogin
              ? <li rel="1">我的</li>
              : ''
          }
        </ul>
        <span class="sort" onClick={ this.clickSort }>{ this.sortText || '按时间' }</span>
        <ul class={ 'sel' + (this.showSort ? '' : ' fn-hide') } onClick={ { li: this.clickSelSort } }>
          <li class="cur" rel="0">按时间</li>
          <li rel="1">按热度</li>
        </ul>
      </div>
      <Comment ref="comment"
               zanUrl="/h5/works/likeComment"
               subUrl="/h5/works/subCommentList"
               delUrl="/h5/works/delComment"
               on-chooseSubComment={ this.chooseSubComment }/>
    </div>;
  }
}

export default CommentWrap;
