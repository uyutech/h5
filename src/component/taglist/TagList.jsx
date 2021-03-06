/**
 * Created by army8735 on 2018/4/10.
 */

'use strict';

class TagList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', 'a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = '话题-' + $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  @bind message
  @bind visible
  setData(data) {
    let self = this;
    self.clearData();

    if(data && !Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    if(data && !Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    $(self.ref.list.element).html('');
    self.exist = {};
  }
  genItem(item) {
    return <li>
      <a href={ '/tag.html?tag=' + encodeURIComponent(item.name) }
         title={ item.name }>{ item.name }</a>
    </li>;
  }
  render() {
    return <div class={ 'cp-taglist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"/>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default TagList;
