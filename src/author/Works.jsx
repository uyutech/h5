/**
 * Created by army on 2017/6/24.
 */
 
import Tags2 from './Tags2.jsx';
import PlayList from '../component/playlist/PlayList.jsx';

let init;
let last = '';
let ajax;

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      self.ref.tag.on('change', function(lA, lB) {
        // self.ref.playlist.load(lA, lB);
        let Parameter = lA.concat(lB);
        Parameter = Parameter.length ? JSON.stringify(Parameter) : '';
        if(last !== Parameter) {
          last = Parameter;
          if(ajax) {
            ajax.abort();
          }
          ajax = util.postJSON('api/author/SearchWorks', { AuthorID: this.props.authorId, Parameter, Skip: 1, Take: 10 }, function(res) {
            if(res.success) {
              self.ref.playlist.setData(res.data);
            }
          });
        }
      });
    });
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
    util.postJSON('api/author/GetAuthorWorks', { AuthorID: this.props.authorId }, function (res) {
      if(res.success) {
        let data = res.data;
        self.ref.tag.tagList = data;
        self.ref.tag.autoWidth();
      }
    });
    ajax = util.postJSON('api/author/SearchWorks', { AuthorID: this.props.authorId, Parameter: '', Skip: 1, Take: 10 }, function(res) {
      if(res.success) {
        self.ref.playlist.setData(res.data);
      }
    });
  }
  render() {
    return <div class="works">
      <Tags2 authorId={ this.props.authorId } ref="tag"/>
      <PlayList ref="playlist"/>
    </div>;
  }
}

export default Works;
