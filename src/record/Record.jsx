/**
 * Created by army8735 on 2018/1/17.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from '../works/Media.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import List from './List.jsx';

let playlistCur;
let playlistCache;

let offset = 0;
let loading;
let loadEnd;
let hasLoadedHis;
let curTag = 0;
let curPlayTag = 0;
let hisList = [];

class Record extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let list = self.ref.list;
      let media = self.ref.media;
      let botPlayBar = self.ref.botPlayBar;
      let count = 0;
      function fin() {
        if(count >= 2) {
          let workIds = playlistCache.filter(function(item) {
            return !!item.workId;
          }).map(function(item) {
            return item.workId;
          });
          if(!workIds.length) {
            return;
          }
          net.postJSON('/h5/playlist/index', { workIDs: workIds.join(',') }, function(res) {
            if(res.success) {
              let data = res.data;
              let format = data.data.map(function(item) {
                let works = item.Works_Items_Works[0];
                return {
                  worksId: works.WorksID,
                  workId: item.ItemID,
                  worksCover: works.WorksCoverPic,
                  workName: item.ItemName,
                  workType: item.ItemType,
                  isLike: item.ISLike,
                  likeNum: item.LikeHis,
                  isFavor: item.ISFavor,
                  lrc: item.lrc,
                  url: item.FileUrl,
                };
              });
              hisList = format;
              hasLoadedHis = true;
              if(curTag !== 0) {
                return;
              }
              list.setData(format);
              for(let i = 0, len = format.length; i < len; i++) {
                let item = format[i];
                if(playlistCur && item.workId === playlistCur.workId) {
                  jsBridge.setTitle(item.workName);
                  media.setData(item);
                  list.setCurIndex(i);
                  return;
                }
              }
              // 找不到默认展示第一个
              let item = format[0];
              if(item) {
                jsBridge.setTitle(item.workName);
                media.setData(item);
                list.setCurIndex(0);
              }
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
        }
      }
      jsBridge.getPreference('playlist', function(res) {
        playlistCache = jsBridge.android ? (res || []) : JSON.parse(res || '[]');
        count++;
        fin();
      });
      jsBridge.getPreference('playlistCur', function(res) {
        playlistCur = res;
        count++;
        fin();
      });
      jsBridge.on('mediaEnd', function(e) {
        if(e.data) {
          if(botPlayBar.mode === 'repeat') {
            media.repeat();
          }
          else if(botPlayBar.mode === 'loop') {
            list.nextLoop();
          }
        }
      });
      jsBridge.on('optionMenu2', function() {
        list.currentFn();
      });
      jsBridge.on('mediaTimeupdate', function(e) {
        if(e.data && media.data && e.data.id.toString() === media.data.workId.toString()) {
          media.isPlaying = botPlayBar.isPlaying = true;
        }
      });
return;
      list.on('choose', function(data) {
        jsBridge.setTitle(data.workName);
        curPlayTag = curTag;
        if(media.data && media.data.workId === data.workId) {
          media.play();
          return;
        }
        media.stop();
        media.setData(data);
        media.play();
        jsBridge.setPreference('playlistCur', data);
        for(let i = 0, len = hisList.length; i < len; i++) {
          let item = hisList[i];
          if(item.workId.toString() === data.workId.toString()) {
            return;
          }
        }
        hisList.unshift(data);
        let res = hisList.map(function(item) {
          return {
            worksId: item.worksId,
            workId: item.workId,
          };
        });
        jsBridge.setPreference('playlist', jsBridge.android ? res : JSON.stringify(res));
      });
      list.on('change', function(res) {
        let data = res.data;
        jsBridge.setTitle(data.workName);
        curPlayTag = curTag;
        // 只有一首或者播放中切换到另外一个列表，结束时假如当前列表进行切换的和正在播放的相同，直接从0开始重新播放
        if(media.data && media.data.workId === data.workId) {
          media.repeat();
          list.setCurIndex(res.index);
          return;
        }
        media.setData(data);
        media.play();
        jsBridge.setPreference('playlistCur', data);
        for(let i = 0, len = hisList.length; i < len; i++) {
          let item = hisList[i];
          if(item.workId.toString() === data.workId.toString()) {
            return;
          }
        }
        hisList.unshift(data);
        let res2 = hisList.map(function(item) {
          return {
            worksId: item.worksId,
            workId: item.workId,
          };
        });
        jsBridge.setPreference('playlist', jsBridge.android ? res2 : JSON.stringify(res2));
      });

      media.on('play', function() {
        botPlayBar.isPlaying = true;
      });
      media.on('pause', function() {
        botPlayBar.isPlaying = false;
      });
      media.on('stop', function() {
        botPlayBar.isPlaying = false;
      });

      botPlayBar.on('prev', function() {
        list.prevLoop();
      });
      botPlayBar.on('next', function() {
        list.nextLoop();
      });
      botPlayBar.on('play', function() {
        media.play();
      });
      botPlayBar.on('pause', function() {
        media.pause();
      });
      botPlayBar.on('comment', function() {
        if(media.data) {
          jsBridge.pushWindow('/sub_comment.html?type=3&id='
            + media.data.worksId + '&sid=' + media.data.workId, {
            title: '评论',
            optionMenu: '发布',
          });
        }
      });

      list.on('del', function(res) {
        let data = res.data;
        for(let i = 0, len = hisList.length; i < len; i++) {
          let item = hisList[i];
          if(item.workId.toString() === data.workId.toString()) {
            hisList.splice(i, 1);
            let res2 = hisList.map(function(item) {
              return {
                worksId: item.worksId,
                workId: item.workId,
              };
            });
            jsBridge.setPreference('playlist', jsBridge.android ? res2 : JSON.stringify(res2));
            return;
          }
        }
        if(res.isCur) {
          jsBridge.setTitle(hisList[0].workName);
          media.setData({
            worksId: hisList[0].worksId,
            workId: hisList[0].workId,
          });
          media.play();
          list.setCurIndex(0);
          jsBridge.setPreference('playlistCur', hisList[0]);
        }
      });

      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    });
  }
  @bind curColum
  init() {
    let self = this;
    let list = self.ref.list;
    self.curColum = 0;
    jsBridge.getCache(['record', 'recordCur'], function([record, recordCur]) {
      if(record && record.length) {
        list.setData(record);
        if(recordCur) {
          for(let i = 0, len = record.length; i < len; i++) {
            let item = record[i];
            if(item.id === recordCur) {
              self.setMedia(item);
              list.setCur(i);
              break;
            }
          }
        }
      }
      else {
        list.message = '暂无记录';
      }
    });
    if(util.isLogin()) {
      self.load();
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    }
  }
  setMedia(item) {
    let self = this;
    self.ref.media.setData(item || null);
  }
  checkMore() {
    let self = this;
    if(loadEnd || loading || self.curColum !== 1) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    let playlist = self.ref.playlist;
    net.postJSON('/h5/my2/favorList', { offset, kind: 2 }, function(res) {
      if(res.success) {
        let data = res.data;
        playlist.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          playlist.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  clickTag(e, vd, tvd) {
    let self = this;
    if(self.curColum === tvd.props.rel) {
      return;
    }
    self.curColum = tvd.props.rel;
  }
  change(data) {
    this.setMedia(data || null);
  }
  change2(data) {
    let self = this;
    let work = {};
    Object.keys(data.work).forEach((key) => {
      work[key] = data.work[key];
    });
    work.worksId = data.id;
    work.worksTitle = data.title;
    work.worksCover = data.cover;
    self.setMedia(work);
    self.ref.media.play();
    util.recordPlay(work, function(record) {
      self.ref.list.setData(record);
      self.ref.list.setCur(0);
      self.curColum = 0;
    });
  }
  mediaLike(data) {
    jsBridge.getPreference('record', function(record) {
      if(record) {
        for(let i = 0, len = record.length; i < len; i++) {
          let item = record[i];
          if(item.id === data.id) {
            item.isLike = data.isLike;
            item.likeCount = data.likeCount;
            jsBridge.setPreference('record', record);
            return;
          }
        }
      }
    });
  }
  mediaFavor(data) {
    jsBridge.getPreference('record', function(record) {
      if(record) {
        for(let i = 0, len = record.length; i < len; i++) {
          let item = record[i];
          if(item.id === data.id) {
            item.isFavor = data.isFavor;
            item.favorCount = data.favorCount;
            jsBridge.setPreference('record', record);
            return;
          }
        }
      }
    });
  }
  render() {
    return <div class="record">
      <Media ref="media"
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }/>
      <ul class="tag"
          onClick={ this.clickTag }>
        <li class={ this.curColum === 0 ? 'cur' : '' }
            rel={ 0 }>最近播放</li>
        <li class={ this.curColum === 1 ? 'cur' : '' }
            rel={ 1 }>收藏列表</li>
      </ul>
      <List ref="list"
            on-change={ this.change }
            @visible={ this.curColum === 0 }/>
      <Playlist ref="playlist"
                message="正在加载..."
                on-change={ this.change2 }
                @visible={ this.curColum === 1 }/>
      <BotPlayBar ref="botPlayBar"/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Record;
