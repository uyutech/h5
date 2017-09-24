/**
 * Created by army8735 on 2017/9/19.
 */

import Comment from '../component/comment/Comment.jsx';

let Skip = -1;
let Take = 10;
let SortType = 0;
let MyComment = 0;
let CurrentCount = 0;
let ajax;
let ajaxMore;
let loadEnd;
let $window = $(window);

class AuthorComment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      $window.on('scroll', function() {
        self.checkMore();
      });
      let comment = self.ref.comment;
      comment.on('chooseSubComment', function(rid, cid, name) {
        self.rootId = rid;
        self.replayId = cid;
        self.replayName = name;
      });
      comment.on('closeSubComment', function() {
        self.clickReplay();
      });
    });
  }
  @bind showComment
  @bind rootId = null
  @bind replayId = null
  @bind replayName
  @bind hasContent
  @bind loading
  @bind authorID
  show() {
    let self = this;
    $(self.element).removeClass('fn-hide');
    self.showComment = true;
  }
  hide() {
    let self = this;
    $(self.element).addClass('fn-hide');
    self.showComment = false;
    Skip = -1;
  }
  load() {
    let self = this;
    self.ref.comment.message = '读取中...';
    if(ajax) {
      ajax.abort();
    }
    if(ajaxMore) {
      ajaxMore.abort();
    }
    self.loading = true;
    ajax = util.postJSON('api/author/GetToAuthorMessage_List', { AuthorID: self.authorID , Skip, Take, SortType, MyComment, CurrentCount }, function(res) {
      if(res.success) {
        let data = res.data;
        CurrentCount = data.Size;
        Skip += Take;
        if(data.data.length) {
          self.ref.comment.message = '';
          self.ref.comment.appendData(res.data.data);
        }
        else {
          self.ref.comment.appendData(res.data.data);
          self.ref.comment.message = '暂无评论';
          loadEnd = true;
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        self.ref.comment.message = res.message || util.ERROR_MESSAGE;
      }
      self.loading = false;
    }, function(res) {
      self.ref.comment.message = res.message || util.ERROR_MESSAGE;
      self.loading = false;
    });
  }
  checkMore() {
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(self.showComment && !self.loading && !loadEnd && bool) {
      self.loading = true;
      ajaxMore = util.postJSON('api/author/GetToAuthorMessage_List', { AuthorID: self.authorID , Skip, Take, SortType, MyComment, CurrentCount }, function(res) {
        if(res.success) {
          let data = res.data;
          CurrentCount = data.Size;
          Skip += Take;
          if(data.data.length) {
            self.ref.comment.appendData(data.data);
            if(data.data.length < Take) {
              self.ref.comment.message = '已经到底了';
              loadEnd = true;
            }
          }
          else {
            loadEnd = true;
            self.ref.comment.message = '已经到底了';
          }
        }
        else {
          self.ref.comment.message = res.message || util.ERROR_MESSAGE;
        }
        self.loading = false;
      }, function(res) {
        self.ref.comment.message = res.message || util.ERROR_MESSAGE;
        self.loading = false;
      });
    }
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    CurrentCount = 0;
    SortType = rel;
    Skip = 0;
    if(ajax) {
      ajax.abort();
    }
    if(ajaxMore) {
      ajaxMore.abort();
    }
    loadEnd = false;
    this.loading = false;
    this.ref.comment.clearData();
    this.load();
  }
  switchType2(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    CurrentCount = 0;
    MyComment = rel;
    Skip = 0;
    if(ajax) {
      ajax.abort();
    }
    if(ajaxMore) {
      ajaxMore.abort();
    }
    loadEnd = false;
    this.loading = false;
    this.ref.comment.clearData();
    this.load();
  }
  clickReplay() {
    this.replayId = null;
    this.replayName = null;
    this.rootId = null;
  }
  input(e, vd) {
    if(window.$CONFIG.isLogin !== 'True') {
      migi.eventBus.emit('NEED_LOGIN');
      $(vd.element).blur();
    }
    else {
      let v = $(vd.element).val().trim();
      this.hasContent = v.length > 0;
    }
  }
  focus(e, vd) {
    if(window.$CONFIG.isLogin !== 'True') {
      migi.eventBus.emit('NEED_LOGIN');
      $(vd.element).blur();
    }
  }
  click(e) {
    e.preventDefault();
    let self = this;
    if(self.hasContent) {
      let $input = $(this.ref.input.element);
      let Content = $input.val();
      let ParentID = self.replayId !== null ? self.replayId : -1;
      let RootID = self.rootId !== null ? self.rootId : -1;
      self.loading = true;
      util.postJSON('api/author/AddComment', {
        ParentID,
        RootID,
        Content,
        AuthorCommentID: self.authorID,
      }, function(res) {
        if(res.success) {
          self.ref.comment.element.scrollIntoView();
          $input.val('');
          self.hasContent = false;
          if(RootID === -1) {
            self.ref.comment.prependData(res.data);
            self.ref.comment.message = '';
          }
          else {
            self.ref.comment.prependChild(res.data);
          }
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="comments fn-hide">
      <ul class="type2 fn-clear" onClick={ { li: this.switchType2 } }>
        <li class="cur" rel="0">全部</li>
        <li rel="1">我的</li>
      </ul>
      <ul class="type fn-clear" onClick={ { li: this.switchType } }>
        <li class="cur" rel="0">最新</li>
        <li rel="1">最热</li>
      </ul>
      <Comment ref="comment" zanUrl="api/author/AddWorkCommentLike" subUrl="api/author/GetTocomment_T_List" delUrl="api/author/DeleteCommentByID"/>
      <div class="form">
        <div class={ 'reply' + (this.replayId ? '' : ' fn-hide') } onClick={ this.clickReplay }>{ this.replayName }</div>
        <div class="inputs">
          <input ref="input" type="text" placeholder="回复..." onInput={ this.input } onFocus={ this.focus }/>
        </div>
        <button onClick={ this.click } class={ this.hasContent && !this.loading ? '' : 'dis' }>确定</button>
      </div>
    </div>;
  }
}

export default AuthorComment;
