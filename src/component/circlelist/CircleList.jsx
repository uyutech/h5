/**
 * Created by army8735 on 2018/8/11.
 */

'use strict';

class CircleList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', 'li', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = '/circle.html?id=' + $this.attr('rel');
        let title = '圈子-' + $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  @bind visible
  setData(data) {
    let self = this;
    self.clearData();

    if(data && !Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item) || '';
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
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    $(self.ref.list.element).html('');
    self.exist = {};
  }
  genItem(item) {
    return <li rel={ item.id }
               title={ item.name }>
      <img src={ $util.img(item.cover, 160, 160, 80) || '/src/common/blank.png' }/>
      <span>{ item.name }</span>
    </li>;
  }
  render() {
    return <div class={ 'cp-circlelist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"/>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default CircleList;
