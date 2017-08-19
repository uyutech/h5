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
    $(this.element).show();
    if(!init) {
      init = true;
      this.load();
    }
  }
  hide() {
    $(this.element).hide();
  }
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
  render() {
    return <div class="comments">
      <Comment ref="comment"/>
      <div class="input">
        <input type="text" placeholder="回复..." onInput={ this.input }/>
        <button onClick={ this.click } class={ this.hasContent ? '' : 'dis' }>确定</button>
      </div>
    </div>;
  }
}

export default AuthorComment;
