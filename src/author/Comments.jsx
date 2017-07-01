/**
 * Created by army on 2017/7/1.
 */
 
import Comment from '../component/comment/Comment.jsx';

class Comments extends migi.Component{
  constructor(...data) {
    super(...data);
  }
  show() {
    this.element.style.display = 'block';
  }
  hide() {
    this.element.style.display = 'none';
  }
  render() {
    return <div class="comments">
      <Comment/>
    </div>;
  }
}

export default Comments;
