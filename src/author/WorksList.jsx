/**
 * Created by army8735 on 2018/3/30.
 */

'use strict';

class WorksList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.data = this.props.data;
    this.offset = this.data.limit;
    this.list = this.data.data;
  }
  @bind loading
  @bind list
  clickChange() {
    let self = this;
    if(self.loading) {
      return;
    }
    self.loading = true;
    $net.postJSON('/h5/author/skillWorks', {
      id: self.props.authorId, offset: self.offset, skillId: self.data.info.id,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        self.list = data.data;
        self.offset += data.limit;
        if(self.offset >= data.count) {
          self.offset = 0;
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      self.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class={ 'mod-workslist ' + (this.loading ? 'loading' : '') }>
      <h4>
        { this.data.info.name }作品
        { this.data.count > this.data.limit ? <span onClick={ this.clickChange }>换一换</span> : '' }
      </h4>
      <ul onClick={ { a: this.click } }>
      {
        (this.list || []).map((item) => {
          return <li>
            <a class="pic"
               href={ '/works.html?id=' + item.id }
               title={ item.title }>
              <img src={ $util.img(item.cover, 170, 170, 80) || '/src/common/blank.png' }/>
              <span class="type">{ item.typeName }</span>
            </a>
            <a class="name"
               href={ '/works.html?id=' + item.id }
               title={ item.title }>{ item.title }</a>
          </li>;
        })
      }
      </ul>
    </div>;
  }
}

export default WorksList;
