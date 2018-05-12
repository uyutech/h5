/**
 * Created by army8735 on 2018/5/7.
 */

'use strict';

let timeout;
let top;
const HEIGHT = 50;
let num;

class VideoList extends migi.Component {
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
        let absolutePath = $this.attr('rel');
        let video = self.ref.video.element;
        video.src = 'https://local.circling.cc' + absolutePath;
        video.play();
        if(video.requestFullscreen) {
          video.requestFullscreen();
        }
        else if(video.mozRequestFullscreen) {
          video.mozRequestFullscreen();
        }
        else if(video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
        else if(video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
        else if(video.webkitEnterFullScreen) {
          video.webkitEnterFullScreen();
        }
        jsBridge.media({
          key: 'pause',
        });
      });
      $list.on('click', '.fn', function() {
        let $b = $(this);
        let id = parseInt($b.closest('li').attr('rel'));
        let key = 'work_' + id;
        jsBridge.getPreference(key, function(res) {
          if(!res) {
            return;
          }
          let list = [
            [
              {
                class: 'like',
                state: res.isLike,
                name: '点赞',
                click: function(botPanel) {
                  if(!$util.isLogin()) {
                    migi.eventBus.emit('NEED_LOGIN');
                    return;
                  }
                  let url = res.isLike ? 'unLike' : 'like';
                  $net.postJSON('/h5/works/' + url, {
                    workId: id, id: res.worksId,
                  }, function(resp) {
                    if(resp.success) {
                      let data = resp.data;
                      list[0][0].state = res.isLike = data.state;
                      jsBridge.setPreference(key, res);
                      botPanel.list = list;
                    }
                    else if(resp.code === 1000) {
                      migi.eventBus.emit('NEED_LOGIN');
                    }
                    else {
                      jsBridge.toast(resp.message || $util.ERROR_MESSAGE);
                    }
                  }, function(resp) {
                    jsBridge.toast(resp.message || $util.ERROR_MESSAGE);
                  });
                },
              },
              {
                class: 'favor',
                state: res.isFavor,
                name: '收藏',
                click: function(botPanel) {
                  if(!$util.isLogin()) {
                    migi.eventBus.emit('NEED_LOGIN');
                    return;
                  }
                  let url = res.isFavor ? 'unFavor' : 'favor';
                  $net.postJSON('/h5/works/' + url, {
                    workId: id, id: res.worksId,
                  }, function(resp) {
                    if(resp.success) {
                      let data = resp.data;
                      list[0][1].state = res.isFavor = data.state;
                      jsBridge.setPreference(key, res);
                      botPanel.list = list;
                    }
                    else if(resp.code === 1000) {
                      migi.eventBus.emit('NEED_LOGIN');
                    }
                    else {
                      jsBridge.toast(resp.message || $util.ERROR_MESSAGE);
                    }
                  }, function(resp) {
                    jsBridge.toast(resp.message || $util.ERROR_MESSAGE);
                  });
                },
              },
              {
                class: 'link',
                name: '查看作品页',
                click: function(botPanel) {
                  jsBridge.pushWindow('/works.html?id=' + res.worksId + '&workId=' + id, {
                    title: res.worksTitle,
                    transparentTitle: true,
                  });
                  botPanel.cancel();
                },
              },
              {
                class: 'suggest',
                name: '文件信息',
                click: function() {
                  let $li = $b.closest('li');
                  let s = '\n文件名：' + $li.find('.name').attr('rel');
                  s += '\n文件大小：' + $li.find('.length').text();
                  s += '\n创建时间：' + $li.attr('time');
                  s += '\n文件路径：' + $li.find('.txt').attr('rel');
                  jsBridge.toast(s);
                },
              },
              {
                class: 'delete',
                name: '删除',
                click: function(botPanel) {
                  jsBridge.confirm('确认删除吗？', function(res) {
                    if(!res) {
                      return;
                    }
                    jsBridge.deleteLocalMedia({
                      name: $b.closest('li').find('.txt').attr('rel'),
                    }, function(res) {
                      if(res.success) {
                        $list.find('li[rel="' + id + '"]').remove();
                        jsBridge.toast('删除成功');
                      }
                      else {
                        jsBridge.toast(res.message);
                      }
                      botPanel.cancel();
                    });
                  });
                },
              }
            ]
          ];
          migi.eventBus.emit('BOT_PANEL', list);
        });
      });
      jsBridge.on('unFullscreen', function() {
        self.ref.video.element.pause();
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
    return <li rel={ item.name.replace(/\.\w+/, '') }
               time={ moment(item.modified).format('YYYY-MM-DD HH:mm:ss') }>
      <a class="pic">
        <img src="/src/common/blank.png"/>
      </a>
      <div class="txt"
           rel={ item.absolutePath }>
        <span class="name"
              rel={ item.name }>{ item.name }</span>
        <p class="info">
          <span class="length">{ $util.formatLength(item.length) }</span>
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
              li.querySelector('.pic img').src = $util.img(item.worksCover, 80, 80, 80);
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
    return <div class={ 'list video' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
      <video ref="video"/>
    </div>;
  }
}

export default VideoList;
