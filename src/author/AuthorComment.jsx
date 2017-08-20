/**
 * Created by army8735 on 2017/8/19.
 */

import Comment from '../component/comment/Comment.jsx';

let init;

class AuthorComment extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    let self = this;
    $(self.element).show();
    if(!init) {
      init = true;
      self.load();
      self.ref.comment.on('chooseSubComment', function(id, name) {
        console.log(id, name);
        self.replayId = id;
        self.replayName = name;
      });
    }
  }
  hide() {
    $(this.element).hide();
  }
  @bind replayId
  @bind replayName
  @bind hasContent
  @bind loading
  load() {
    let self = this;
    util.postJSON('api/author/GetToAuthorMessage_List', { AuthorID: self.props.authorId , Skip: 0, Take: 10 }, function(res) {
      if(res.success) {
        self.ref.comment.list = res.data.data;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
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
      let ParentID = self.replayId === null ? self.replayId : -1;
      self.loading = true;
      util.postJSON('api/comment/AddComment', {
        ParentID,
        Content,
        commentType: 2,
        commentTypeID: self.props.authorId,
      }, function(res) {
        if(res.success) {
          $input.val('');
          if(ParentID > -1) {
            self.ref.comment.list.push(res.data);
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

export default AuthorComment;
