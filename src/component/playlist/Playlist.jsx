/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

let mediaService;

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.list = [];
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      if(jsBridge.appVersion) {
        let version = jsBridge.appVersion.split('.');
        let major = parseInt(version[0]) || 0;
        let minor = parseInt(version[1]) || 0;
        let patch = parseInt(version[2]) || 0;
        if(jsBridge.android && (major > 0 || minor > 4) || jsBridge.ios && (major > 0 || minor > 5)) {
          mediaService = true;
        }
      }
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
        let worksId = parseInt($(this).attr('worksId'));
        let workId = parseInt($(this).attr('workId'));
        for(let i = 0, len = self.list.length; i < len; i++) {
          let item = self.list[i];
          if(item.id === worksId && item.work.id === workId) {
            self.setCur(i);
            self.emit('change', self.list[i]);
            break;
          }
        }
      });
      $list.on('click', '.fn', function() {
        let id = parseInt($(this).attr('rel'));
        for(let i = 0, len = self.list.length; i < len; i++) {
          let item = self.list[i];
          if(item.work.id === id) {
            migi.eventBus.emit('BOT_FN', {
              canShare: true,
              canShareIn: true,
              canShareWb: true,
              canShareLink: true,
              clickShareIn: function(botFn) {
                jsBridge.pushWindow('/sub_post.html?worksId=' + item.id
                  + '&workId=' + id
                  + '&cover=' + encodeURIComponent(item.work.cover || item.cover || ''), {
                  title: '画个圈',
                  optionMenu: '发布',
                });
                botFn.cancel();
              },
              clickShareWb: function(botFn) {
                let url = window.ROOT_DOMAIN + '/works/' + item.id + '/' + id;
                let text = '【' + item.work.title;
                if(item.work.subTitle) {
                  text += ' ' + item.work.subTitle;
                }
                text += '】';
                let hash = {};
                item.work.author.forEach((item) => {
                  item.list.forEach((author) => {
                    if(!hash[author.id]) {
                      hash[author.id] = true;
                      text += author.name + ' ';
                    }
                  });
                });
                text += ' #转圈circling# ';
                text += url;
                jsBridge.shareWb({
                  text,
                }, function(res) {
                  if(res.success) {
                    jsBridge.toast("分享成功");
                  }
                  else if(res.cancel) {
                    jsBridge.toast("取消分享");
                  }
                  else {
                    jsBridge.toast("分享失败");
                  }
                });
                botFn.cancel();
              },
              clickShareLink: function(botFn) {
                let url = window.ROOT_DOMAIN + '/works/' + item.id + '/' + id;
                $util.setClipboard(url);
                botFn.cancel();
              },
            });
            break;
          }
        }
      });
      jsBridge.on('mediaStop', function() {
        self.setCur();
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
      if(!item || !item.work || self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
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
      if(!item || !item.work || self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
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
    let url = '/works.html?id=' + item.id + '&workId=' + item.work.id;
    let author = [];
    let hash = {};
    if(self.props.profession) {
      (item.work.profession || []).forEach((item) => {
        author.push(item.name);
      });
    }
    else {
      (item.work.author || []).forEach(function(list) {
        list.list.forEach(function(at) {
          if(!hash[at.id]) {
            hash[at.id] = true;
            author.push(at.name);
          }
        });
      });
    }
    return <li rel={ item.id }>
      <a class="pic"
         title={ item.title }
         href={ url }>
        <img src={ $util.img(item.work.cover || item.cover, 80, 80, 80) || '/src/common/blank.png' }/>
      </a>
      <div class="txt"
           worksId={ item.id }
           workId={ item.work.id }>
        <span class="name">{ item.work.title }</span>
        <p class="author">{ author.join(' ') }</p>
      </div>
      <b class="fn"
         rel={ item.work.id }/>
    </li>;
  }
  setCur(i) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    if(i !== undefined && i !== null) {
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
  render() {
    return <div class={ 'cp-playlist' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Playlist;
