/**
 * Created by army8735 on 2018/4/6.
 */

'use strict';


import util from '../../common/util';

class WorksVideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.list = self.props.list;
  }
  @bind message
  @bind visible
  @bind list
  setData(data) {
    let self = this;
    self.exist = {};
    let $list = $(self.ref.list.element);
    let s = '';
    (data || []).forEach(function(item) {
      if(self.exist[item.id]) {
        return;
      }
      self.exist[item.id] = true;
      s += self.genItem(item);
    });
    $list.html(s);
  }
  appendData(data) {
    let self = this;
    let $list = $(self.ref.list.element);
    let s = '';
    (data || []).forEach(function(item) {
      if(self.exist[item.id]) {
        return;
      }
      self.exist[item.id] = true;
      s += self.genItem(item);
    });
    $list.append(s);
  }
  clearData() {
    let $list = $(self.ref.list.element);
    $list.html('');
  }
  genItem(item) {
    let url = '/works.html?id=' + item.id;
    let author = [];
    let hash = {};
    (item.author || []).forEach(function(list) {
      (list.list || []).forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    return <li>
      <a class="pic"
         title={ item.title }
         href={ url }>
        <img src={ util.autoSsl(util.img750__80(item.cover)) || '/src/common/blank.png' }/>
        <div class="num">
          <span class="play">{ util.abbrNum(0) }次播放</span>
        </div>
      </a>
      <a class="name"
         href={ url }
         title={ item.title }>{ item.title }</a>
      <div class="info">
        <p class="author">{ author.join(' ') }</p>
        <b class="like">1</b>
        <b class="comment">2</b>
        <b class="fn"/>
      </div>
    </li>;
  }
  render() {
    return <div class={ 'cp-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default WorksVideoList;
