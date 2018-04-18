/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let loadingFavor;
let loadingLike;
let ajaxFavor;
let ajaxLike;
let last;
let lastId;
let isPlaying;
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
        let id = parseInt($(this).attr('rel'));
        for(let i = 0, len = self.list.length; i < len; i++) {
          if(self.list[i].work.id === id) {
            self.setCur(i);
            self.emit('change', self.list[i]);
            break;
          }
        }
      });
      $list.on('click', '.fn', function() {
        let $fn = $(this);
        let isLike = $fn.attr('isLike') === 'true';
        let isFavor = $fn.attr('isFavor') === 'true';
        let worksId = $fn.attr('worksId');
        let workId = $fn.attr('workId');
        let worksTitle = $fn.attr('worksTitle');
        let worksCover = $fn.attr('worksCover');
        let workCover = $fn.attr('workCover');
        let authorStr = $fn.attr('authorStr');
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canLike: true,
          canFavor: true,
          canShare: true,
          canShareIn: true,
          canShareWb: true,
          canShareLink: true,
          isLike,
          isFavor,
          clickFavor: function(botFn) {
            if(loadingFavor) {
              return;
            }
            loadingFavor = true;
            ajaxFavor = net.postJSON(isFavor ? '/h5/works/unFavorWork' : '/h5/works/favorWork', { workID: $fn.attr('workId') }, function(res) {
              if(res.success) {
                let data = res.data;
                $fn.attr('isFavor', isFavor = botFn.isFavor = data.State === 'favorWork');
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
              loadingFavor = false;
            }, function(res) {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
              loadingFavor = false;
            });
          },
          clickLike: function(botFn) {
            if(loadingLike) {
              return;
            }
            loadingLike = true;
            ajaxLike = net.postJSON('/h5/works/likeWork', { workID: $fn.attr('workId') }, function(res) {
              if(res.success) {
                let data = res.data;
                $fn.attr('isLike', isLike = botFn.isLike = data.State === 'likeWordsUser');
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
              loadingLike = false;
            }, function(res) {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
              loadingLike = false;
            });
          },
          clickCancel: function() {
            if(ajaxFavor) {
              ajaxFavor.abort();
            }
            if(ajaxLike) {
              ajaxLike.abort();
            }
            loadingFavor = false;
            loadingLike = false;
          },
          clickShareWb: function() {
            let url = window.ROOT_DOMAIN + '/works/' + worksId;
            if(workId) {
              url += '/' + workId;
            }
            let text = '【';
            if(worksTitle) {
              text += worksTitle;
            }
            text += '】';
            text += authorStr;
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
          },
          clickShareLink: function() {
            let url = window.ROOT_DOMAIN + '/works/' + worksId;
            if(workId) {
              url += '/' + workId;
            }
            util.setClipboard(url);
          },
          clickShareIn: function(botFn) {
            jsBridge.pushWindow('/sub_post.html?id=' + worksId
              + '&workId=' + workId
              + '&cover=' + encodeURIComponent(worksCover || ''), {
              title: '画个圈',
              optionMenu: '发布',
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
      if(self.exist[item.work.id]) {
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
      if(self.exist[item.work.id]) {
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
    return <li>
      <a class="pic"
         title={ item.title }
         href={ url }>
        <img src={ util.autoSsl(util.img750__80(item.cover)) || '/src/common/blank.png' }/>
      </a>
      <div class="txt" rel={ item.work.id }>
        <span class="name">{ item.work.title }</span>
        <p class="author">{ author.join(' ') }</p>
      </div>
      <b class="fn"/>
    </li>;
  }
  setCur(i) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    $list.find('li').eq(i).addClass('cur');
  }
  clickPic(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let self = this;
    if(self.props.playInline) {
      let li = tvd.closest('li');
      let audio = li.find('audio');
      if(li.element.classList.contains('cur')) {
        if(mediaService) {
          jsBridge.media({
            key: isPlaying ? 'pause' : 'play',
          });
        }
        else {
          isPlaying ? audio.element.pause() : audio.element.play();
        }
        isPlaying = !isPlaying;
        return;
      }
      self.clearLast();
      li.element.classList.add('cur');
      last = li;
      let item = tvd.props.item;
      lastId = item.ItemID;
      if(mediaService) {
        jsBridge.media({
          key: 'info',
          value: {
            id: item.ItemID,
            url: location.protocol + util.autoSsl(item.FileUrl),
            name: item.workId,
          },
        });
        jsBridge.media({
          key: 'play',
        });
        jsBridge.getPreference('playlist', function(res) {
          res = jsBridge.android ? (res || []) : JSON.parse(res || '[]');
          for (let i = 0, len = res.length; i < len; i++) {
            if(res[i].workId === item.ItemID) {
              res.splice(i, 1);
              break;
            }
          }
          res.unshift({
            workId: item.ItemID,
          });
          jsBridge.setPreference('playlist', jsBridge.android ? res : JSON.parse(res));
        });
        jsBridge.setPreference('playlistCur', {
          workId: item.ItemID,
        });
      }
      else {
        audio.element.src = item.FileUrl;
        audio.element.play();
        isPlaying = true;
      }
      return;
    }
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class={ 'cp-playlist' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Playlist;
