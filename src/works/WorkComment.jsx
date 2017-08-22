/**
 * Created by army on 2017/6/11.
 */
 
import Comment from '../component/comment/Comment.jsx';

let init;
let Skip = -1;
let Take = 10;
let Size = 0;
let loadingMore;
let isShow;
let scrollCb;

class WorkComment extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    let self = this;
    isShow = true;
    $(self.element).show();
    if(!init) {
      init = true;
      self.load();
      self.ref.comment.on('chooseSubComment', function(rid, cid, name) {
        self.rootId = rid;
        self.replayId = cid;
        self.replayName = name;
      });
    }
  }
  hide() {
    isShow = false;
    $(this.element).hide();
  }
  @bind rootId = null
  @bind replayId = null
  @bind replayName
  @bind hasContent
  @bind loading
  load() {
    let self = this;
    util.postJSON('api/works/GetToWorkMessage_List', { WorkID: self.props.workId , Skip, Take }, function(res) {
      if(res.success) {
        let data = res.data;
        self.ref.comment.list = data.data || [];
        Size = data.Size;
        if(data.data.length) {
          Skip = data.data[data.data.length - 1].Send_ID;
          if(data.data.length >= Size) {
            self.ref.comment.message = '';
          }
          else {
            scrollCb = function() {
              self.checkMore();
            };
            $(window).on('scroll', scrollCb);
          }
        }
        else {
          self.ref.comment.message = '暂无评论';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  checkMore() {
    let self = this;
    let $window = $(window);
    let $body = $(document.body);
    let WIN_HEIGHT = $window.height();
    if(isShow && !loadingMore && $body.scrollTop() + WIN_HEIGHT + 30 > $body.height()) {
      loadingMore = true;
      util.postJSON('api/works/GetToWorkMessage_List', { WorkID: self.props.workId , Skip, Take }, function(res) {
        if(res.success) {
          let data = res.data;
          if(data.data.length) {
            Skip = data.data[data.data.length - 1].Send_ID;
            self.ref.comment.addMore(data.data);
            if(data.data.length < Take) {
              self.ref.comment.message = '';
              $window.off('scroll', scrollCb);
            }
          }
          else {
            self.ref.comment.message = '';
            $window.off('scroll', scrollCb);
          }
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingMore = false;
      }, function() {
        loadingMore = false;
      });
    }
  }
  clickReplay() {
    this.replayId = null;
    this.replayName = null;
  }
  input(e, vd) {
    let v = $(vd.element).val().trim();
    this.hasContent = v.length > 0;
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
      util.postJSON('api/comment/AddComment', {
        ParentID,
        RootID,
        Content,
        commentType: 1,
        commentTypeID: self.props.workId,
      }, function(res) {
        if(res.success) {
          $input.val('');
          if(RootID === -1) {
            self.ref.comment.addNew(res.data);
          }
          else {
            self.ref.comment.addChild(res.data);
          }
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="comments">
      <Comment ref="comment"/>
      <div class="form">
        <div class={ 'reply' + (this.replayId ? '' : ' fn-hide') } onClick={ this.clickReplay }>{ this.replayName }</div>
        <div class="inputs">
          <input ref="input" type="text" placeholder="回复..." onInput={ this.input }/>
        </div>
        <button onClick={ this.click } class={ this.hasContent && !this.loading ? '' : 'dis' }>确定</button>
      </div>
    </div>;
  }
}

export default WorkComment;
