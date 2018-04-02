/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

import Comment from '../component/comment/Comment.jsx';
import util from "../common/util";
import net from "../common/net";

let limit;
let offset;
let ajax;
let loading;
let loadEnd;

class CommentWrap extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $body = $(document.body);
      $body.on('click', function() {
        self.showSort = false;
      });
      self.isLogin = util.isLogin();
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.type && data.type === 'subComment') {
          self.ref.comment.prependData(data.data);
        }
      });
    });
  }
  @bind isLogin
  @bind visible
  setData(worksId, data) {
    let self = this;
    limit = data.limit;
    offset = limit;
    self.worksId = worksId;
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
    ajax = net.postJSON('/h5/works2/comment', { worksId: self.worksId, offset, limit, }, function(res) {
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
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
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
    offset = 0;
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
    offset = 0;
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
        optionMenu: '发布',
      });
    }
  }
  render() {
    return <div class={ 'mod-comment' + (this.visible ? '' : ' fn-hide') }>
      <div class="fn">
        <ul class="type" onClick={ { li: this.clickType } }>
          <li class="cur" rel="0">全部评论</li>
          {
            this.isLogin
              ? <li rel="1">我的</li>
              : ''
          }
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
