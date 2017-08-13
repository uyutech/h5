/**
 * Created by army on 2017/6/24.
 */
 
import Tags2 from './Tags2.jsx';
import PlayList from '../component/playlist/PlayList.jsx';

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  load(authorId) {
    let self = this;
    util.postJSON('api/author/GetAuthorWorks', { AuthorID: authorId }, function (res) {
      if(res.success) {
        let data = res.data;
        console.log(data);
        let tagList = [];
        Object.keys(data).forEach(function(k) {
          let v = data[k];
          tagList.push({
            k,
            v
          });
        });
        self.ref.tag.tagList = tagList;
        self.ref.tag.autoWidth();
      }
    });
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
      <Tags2 authorId={ this.props.authorId } ref="tag"/>
      <PlayList ref="playlist"/>
    </div>;
  }
}

export default Works;
