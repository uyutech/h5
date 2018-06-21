/**
 * Created by army8735 on 2018/5/22.
 */

'use strict';

class Letter extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', '.pic', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          transparentTitle: true,
          title,
        });
      });
      $list.on('click', '.txt', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  @bind message
  setData(data) {
    let self = this;
    self.clearData();
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach((item) => {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    self.clearData();
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach((item) => {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
  }
  genItem(item) {
    let self = this;
    let id = item.id;
    if(self.exist[id]) {
      return;
    }
    self.exist[id] = true;
    return <li id={ 'letter_' + (item.id) }
               rel={ item.userId }>
      <a class="pic"
         href={ '/user.html?id=' + item.userId }
         title={ (item.user || {}).nickname }>
        <img src={ $util.img((item.user || {}).headUrl, 96, 96, 80) || '/src/common/head.png' }/>
        <small class="num">{ item.count || '' }</small>
      </a>
      <a class="txt"
         href={ '/my_dialog.html?id=' + item.userId }
         title={ '和' + (item.user || {}).nickname + '的私信对话' }>
        <span class="name">{ (item.user || {}).nickname }</span>
        <p class="content">{ (item.letter || {}).content }</p>
      </a>
      <div class="info">
        <span class="time">{ $util.formatDate(item.updateTime) }</span>
        {
          item.typeName
            ? <span class="type">{ item.typeName }</span>
            : ''
        }
      </div>
    </li>;
  }
  setNum(id, num) {
    this.ref.list.element.querySelector('li[rel="' + id + '"]').querySelector('.num').textContent = num || '';
  }
  render() {
    return <div class="mod-letter">
      <ol class="list"
          ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default Letter;
