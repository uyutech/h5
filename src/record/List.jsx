/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

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
              for(let i = 0, len = self.list.length; i < len; i++) {
                if(self.list[i].id === id) {
                  self.list.splice(i, 1);
                  jsBridge.setPreference('record', self.list);
                  return;
                }
              }
              botFn.cancel();
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
    return <li>
      <a class="pic"
         title={ item.worksTitle }
         href={ url }>
        <img src={ util.img(item.worksCover, 80, 80, 80) || '/src/common/blank.png' }/>
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
    $list.find('li').eq(i).addClass('cur');
  }
  render() {
    return <div class={ 'cp-playlist mod-list' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default List;
