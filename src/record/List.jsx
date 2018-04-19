/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

class List extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.list = [];
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', '.pic', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.txt', function() {
        let id = parseInt($(this).attr('rel'));
        for(let i = 0, len = self.list.length; i < len; i++) {
          if(self.list[i].id === id) {
            self.setCur(i);
            jsBridge.setPreference('recordCur', id);
            self.emit('change', self.list[i]);
            break;
          }
        }
      });
      $list.on('click', '.fn', function() {
        let $fn = $(this);
        let $li = $fn.closest('li');
        let id = parseInt($fn.attr('rel'));
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canDel: true,
          clickDel: function(botFn) {
            jsBridge.confirm('确认删除吗？', function(res) {
              if(!res) {
                botFn.cancel();
                return;
              }
              $li.remove();
              botFn.cancel();
              for(let i = 0, len = self.list.length; i < len; i++) {
                if(self.list[i].id === id) {
                  let data = self.list.splice(i, 1);
                  self.emit('del', data[0]);
                  jsBridge.setPreference('record', self.list);
                  return;
                }
              }
            });
          },
        });
      });
    });
  }
  @bind message
  @bind visible
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
    data.forEach(function(item) {
      if(self.exist[item.id]) {
        return;
      }
      self.exist[item.id] = true;
      self.list.push(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach(function(item) {
      if(self.exist[item.id]) {
        return;
      }
      self.exist[item.id] = true;
      self.list.push(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  prependData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    let $list = $(self.ref.list.element);
    data.forEach(function(item) {
      $list.find('#list_' + item.id).remove();
      self.exist[item.id] = true;
      for(let i = 0, len = self.list.length; i < len; i++) {
        if(self.list[i].id === item.id) {
          self.list.splice(i, 1);
          break;
        }
      }
      self.list.unshift(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).prepend(s);
    jsBridge.setPreference('record', self.list);
  }
  clearData() {
    let self = this;
    self.exist = {};
    self.list = [];
    $(self.ref.list.element).html('');
  }
  genItem(item) {
    let self = this;
    let url = '/works.html?id=' + item.worksId + '&workId=' + item.id;
    let author = [];
    let hash = {};
    item.author.forEach(function(list) {
      list.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    return <li id={ 'list_' + item.id }
               rel={ item.id }>
      <a class="pic"
         title={ item.worksTitle }
         href={ url }>
        <img src={ $util.img(item.worksCover, 80, 80, 80) || '/src/common/blank.png' }/>
      </a>
      <div class="txt"
           rel={ item.id }>
        <span class="name">{ item.title }</span>
        <p class="author">{ author.join(' ') }</p>
      </div>
      <b class="fn"
         rel={ item.id }/>
    </li>;
  }
  setCur(i) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    if(i !== null && i !== undefined) {
      jsBridge.setPreference('recordCur', self.list[i].id);
      $list.find('li').eq(i).addClass('cur');
    }
  }
  prev() {
    let self = this;
    if(self.list.length < 2) {
      return;
    }
    let $list = $(self.ref.list.element);
    let $cur = $list.find('li.cur');
    let $prev = $cur.prev();
    if(!$prev[0]) {
      $prev = $list.find('li:last-child');
    }
    let id = parseInt($prev.attr('rel'));
    for(let i = 0, len = self.list.length; i < len; i++) {
      let item = self.list[i];
      if(item.id === id) {
        self.setCur(i);
        return item;
      }
    }
  }
  next() {
    let self = this;
    if(self.list.length < 2) {
      return;
    }
    let $list = $(self.ref.list.element);
    let $cur = $list.find('li.cur');
    let $next = $cur.next();
    if(!$next[0]) {
      $next = $list.find('li:first-child');
    }
    let id = parseInt($next.attr('rel'));
    for(let i = 0, len = self.list.length; i < len; i++) {
      let item = self.list[i];
      if(item.id === id) {
        self.setCur(i);
        return item;
      }
    }
  }
  like(data) {
    let self = this;
    for(let i = 0, len = self.list.length; i < len; i++) {
      let item = self.list[i];
      if(item.id === data.id) {
        item.isLike = data.isLike;
        item.likeCount = data.likeCount;
        jsBridge.setPreference('record', self.list);
        return;
      }
    }
  }
  favor(data) {
    let self = this;
    for(let i = 0, len = self.list.length; i < len; i++) {
      let item = self.list[i];
      if(item.id === data.id) {
        item.isFavor = data.isFavor;
        item.favorCount = data.favorCount;
        jsBridge.setPreference('record', self.list);
        return;
      }
    }
  }
  render() {
    return <div class={ 'cp-playlist mod-list' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default List;
