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
    self.dataList = self.props.dataList || [];
    if(self.props.visible !== undefined) {
      self.visible = self.props.visible;
    }
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
      let $root = $(this.element);
      $root.on('click', '.fn', function() {
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
            jsBridge.pushWindow('/subpost.html?worksId=' + worksId
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
  @bind visible = true
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
    this.clearLast();
    last = lastId = null;
    isPlaying = false;
  }
  setData(data) {
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).html(s);
  }
  appendData(data) {
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).append(s);
  }
  genItem(item) {
    let self = this;
    if(item.WorksState === 3) {
      return <li class="private">
        <span class="name">待揭秘</span>
      </li>;
    }
    let works = (item.Works_Items_Works || [])[0] || {};
    if(!works) {
      return;
    }
    let author = ((item.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let url = util.getWorksUrl(works.WorksID, works.WorksType, item.ItemID);
    let authorStr = (author.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    }).join(' ');
    if(item.WorksState === 2) {
      let temp = <li class={ item.ItemID === lastId ? 'cur' : '' }>
        <a href={ url }
           title={ item.ItemName || '待揭秘' }
           class="pic">
          <img class="pic"
               src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
        </a>
        <audio ref="audio"
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
        <div class="txt">
          <a href={ url }
             title={ item.ItemName || '待揭秘' }
             class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
          {
            self.props.profession
              ? <p class="author">{ (author.AuthorInfo || []).map(function(item) {
                return item.AuthorTypeName;
              }).join(' ') }</p>
              : <p class="author">{ authorStr }</p>
          }
        </div>
      </li>;
      if(item.ItemID === lastId) {
        last = item;
      }
      return temp;
    }
    let temp = <li class={ item.ItemID === lastId ? 'cur' : '' }>
      <a href={ url }
         title={ item.ItemName || '待揭秘' }
         class="pic"
         item={ item }>
        <img src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
      </a>
      <audio ref="audio"
             preload="meta"
             playsinline="true"
             webkit-playsinline="true"/>
      <div class="txt">
        <a href={ url }
           title={ item.ItemName || '待揭秘' }
           item={ item }
           class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
        {
          self.props.profession
            ? <p class="author">{ (author.AuthorInfo || []).map(function(item) {
              return item.AuthorTypeName;
            }).join(' ') }</p>
            : <p class="author">{ authorStr }</p>
        }
      </div>
      <b class="fn"
         worksId={ works.WorksID }
         worksTitle={ works.WorksName }
         workId={ item.ItemID }
         workTitle={ item.ItemName }
         worksCover={ works.WorksCoverPic }
         authorStr={ authorStr }
         isLike={ item.ISLike }
         isFavor={ item.ISFavor }/>
    </li>;
    if(item.ItemID === lastId) {
      last = item;
    }
    return temp;
  }
  clearData() {
    $(this.ref.list.element).html('');
    last = lastId = null;
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
  clearLast() {
    if(last) {
      let audio = last.find('audio');
      audio.element.pause();
      last.element.classList.remove('cur');
    }
  }
  render() {
    return <div class={ 'cp-playlist' + (this.visible ? '' : ' fn-hide') }
                onClick={ { '.pic': this.clickPic, '.name': this.click } }>
      <ol class="list" ref="list">
      {
        (this.dataList || []).map(function(item) {
          return this.genItem(item);
        }.bind(this))
      }
      </ol>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Playlist;
