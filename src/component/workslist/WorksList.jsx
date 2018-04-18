/**
 * Created by army8735 on 2018/4/10.
 */

'use strict';

import util from "../../common/util";

class WorksList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
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
    $(self.ref.list.element).html(s);
  }
  clearData() {
    let self = this;
    $(self.ref.list.element).html('');
    self.exist = {};
  }
  genItem(item) {
    let url = '/works.html?id=' + item.id;
    return <li>
      <a class="pic"
         href={ url }
         title={ item.title }>
        <img src={ util.autoSsl(util.img170_170_80(item.cover)) || '/src/common/blank.png' }/>
        <span class="type">{ item.typeName }</span>
        <span class="num">{ util.abbrNum(item.popular) }</span>
      </a>
      <a class="txt"
         href={ url }
         title={ item.title }>
        <span>{ item.title }</span>
        <span class="profession">{ (item.profession || {}).name }</span>
      </a>
    </li>;
  }
  render() {
    return <div class={ 'cp-workslist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"/>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default WorksList;
