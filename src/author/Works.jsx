/**
 * Created by army on 2017/6/24.
 */
 
import Tags2 from './Tags2.jsx';
import PlayList from '../component/playlist/PlayList.jsx';

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    this.element.style.display = 'block';
    this.ref.tag.autoWidth();
  }
  hide() {
    this.element.style.display = 'none';
  }
  render() {
    return <div class="works">
      <Tags2 ref="tag"/>
      <PlayList ref="playlist"/>
    </div>;
  }
}

export default Works;
