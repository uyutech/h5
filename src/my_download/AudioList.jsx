/**
 * Created by army8735 on 2018/5/7.
 */

'use strict';

let timeout;
let top;
const HEIGHT = 50;
let num;

class AudioList extends migi.Component {
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
        if(url) {
          jsBridge.pushWindow(url, {
            title,
            transparentTitle: true,
          });
        }
      });
      $list.on('click', '.txt', function() {
        let $this = $(this);
        let absolutePath = 'https://local.circling.cc' + $this.attr('rel');
        let id = $this.attr('workId');
        let title = $this.find('.name').text();
        let author = $this.find('.author').text();
        jsBridge.media({
          key: 'play',
          value: {
            url: absolutePath,
            id,
            title,
            author,
          },
        });
        jsBridge.delPreference('recordCur');
      });
      window.addEventListener('scroll', function() {
        if(!self.visible) {
          return;
        }
        if(timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
          self.fillData();
        }, 100);
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
      if(!item || self.exist[item.name]) {
        return;
      }
      self.exist[item.name] = true;
      self.list.push(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
    self.fillData();
  }
  clearData() {
    let self = this;
    self.exist = {};
    self.list = [];
    $(self.ref.list.element).html('');
  }
  genItem(item) {
    return <li rel={ item.name.replace(/\.\w+/, '') }>
      <a class="pic">
        <img src="/src/common/blank.png"/>
      </a>
      <div class="txt"
           rel={ item.absolutePath }
           workId={ item.name.replace(/\.\w+$/, '') }>
        <span class="name">{ item.name }</span>
        <p class="info">
          <span>{ $util.formatLength(item.length) }</span>
          <span class="author"/>
        </p>
      </div>
      <b class="fn"/>
    </li>;
  }
  fillData() {
    let self = this;
    let y = $util.scrollY();
    let winHeight = document.documentElement.clientHeight;
    if(!top) {
      let rect = self.element.getBoundingClientRect();
      top = rect.top;
    }
    if(!num) {
      num = Math.ceil(winHeight / HEIGHT);
    }
    let lis = self.ref.list.element.querySelectorAll('li');
    let start = 0;
    if(y > top + HEIGHT) {
      let diff = y - top - HEIGHT;
      start = Math.floor(diff / HEIGHT);
    }
    let idList = [];
    for(let i = start, len = Math.min(start + num, lis.length); i < len; i++) {
      let li = lis[i];
      if(!li.classList.contains('loaded')) {
        idList.push(li.getAttribute('rel'));
      }
    }
    if(idList.length) {
      let key = idList.map((id) => {
        return 'work_' + id;
      });
      jsBridge.getCache(key, function(res) {
        if(res && res.length) {
          let hash = {};
          res.forEach(function(item) {
            hash[item.id] = item;
          });
          for(let i = start, len = Math.min(start + num, lis.length); i < len; i++) {
            let li = lis[i];
            let item = hash[li.getAttribute('rel')];
            if(item) {
              li.classList.add('loaded');
              li.querySelector('.pic').href = '/works.html?id=' + item.worksId + '&workId=' + item.id;
              li.querySelector('.pic').title = item.worksTitle;
              li.querySelector('.pic img').src = item.worksCover;
              li.querySelector('.txt .name').textContent = item.title;
              let author = [];
              let hash = {};
              (item.author || []).forEach(function(list) {
                list.list.forEach(function(at) {
                  if(!hash[at.id]) {
                    hash[at.id] = true;
                    author.push(at.name);
                  }
                });
              });
              li.querySelector('.txt .author').textContent = author.join(' ');
            }
          }
        }
      });
    }
  }
  render() {
    return <div class={ 'list audio' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default AudioList;
