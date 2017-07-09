/**
 * Created by army on 2017/6/11.
 */
 
import Comment from '../component/comment/Comment.jsx';

class Comments extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="comments">
      <Comment/>
    </div>;
  }
}

export default Comments;
