/**
 * Created by army on 2017/6/18.
 */
 
import Banner from './find/Banner.jsx';
import Tags from './find/Tags.jsx';
import HotWorks from './find/HotWorks.jsx';

let first = true;

class FindCard extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).show();
    if(first) {
      first = false;
      this.ref.tags.autoWidth();
      this.ref.hotWorks.autoWidth();
    }
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="find_card">
      <Banner/>
      <Tags ref="tags"/>
      <HotWorks ref="hotWorks"/>
    </div>;
  }
}

export default FindCard;
