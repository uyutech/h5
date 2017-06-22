/**
 * Created by army on 2017/6/18.
 */
 
import Banner from './find/Banner.jsx';
import Tags from './find/Tags.jsx';
import HotWorks from './find/HotWorks.jsx';
import HotAlbum from './find/HotAlbum.jsx';
import HotAuthor from './find/HotAuthor.jsx';

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
      this.ref.hotAlbum.autoWidth();
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
      <HotAlbum ref="hotAlbum"/>
      <HotAuthor ref="hotAuthor"/>
    </div>;
  }
}

export default FindCard;
