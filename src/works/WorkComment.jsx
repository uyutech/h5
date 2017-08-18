/**
 * Created by army on 2017/6/11.
 */
 
import Comment from '../component/comment/Comment.jsx';

let init;

class WorkComment extends migi.Component {
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
    util.postJSON('api/works/GetToWorkMessage_List', { WorkID: self.props.workId , Skip: 0, Take: 10 }, function(res) {
      if(res.success) {
        self.ref.comment.list = res.data.data;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
  }
  @bind hasContent
  input(e, vd) {
    let v = $(vd.element).val().trim();
    this.hasContent = v.length > 0;
  }
  click(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    let $input = $vd.prev();
    let Content = $input.val();
    if(!$vd.hasClass('dis')) {
      util.postJSON('api/comment/AddComment', {
        ParentID: -1,
        Content,
        commentType: 1,
        commentTypeID: self.props.workId,
      }, function(res) {
        if(res.success) {
          $input.val('');
          self.ref.comment.list.push(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      });
    }
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

export default WorkComment;
