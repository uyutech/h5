/**
 * Created by army on 2017/6/18.
 */
 
import Banner from './find/Banner.jsx';
import Tags from './find/Tags.jsx';
import HotWorks from './find/HotWorks.jsx';

class FindCard extends migi.Component {
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
    return <div class="find_card">
      <Banner/>
      <Tags/>
      <HotWorks/>
    </div>;
  }
}

export default FindCard;
