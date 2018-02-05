/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from '../works/Media.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import List from './List.jsx';

let playlistCur;
let playlistCache;

let take = 20;
let skip = 0;
let loading;
let loadEnd;
let hasLoadedFavor;
let hasLoadedHis;
let curTag = 0;
let curPlayTag = 0;
let hisList = [];
let favorList = [];

class Playlist extends migi.Component {
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
        playlistCache = res || [];
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
        jsBridge.setPreference('playlist', hisList.map(function(item) {
          return {
            worksId: item.worksId,
            workId: item.workId,
          };
        }));
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
        jsBridge.setPreference('playlist', hisList.map(function(item) {
          return {
            worksId: item.worksId,
            workId: item.workId,
          };
        }));
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
          jsBridge.pushWindow('/subcomment.html?type=3&id='
            + media.data.worksId + '&sid=' + media.data.workId, {
            title: '评论',
          });
        }
      });

      list.on('del', function(res) {
        let data = res.data;
        for(let i = 0, len = hisList.length; i < len; i++) {
          let item = hisList[i];
          if(item.workId.toString() === data.workId.toString()) {
            hisList.splice(i, 1);
            jsBridge.setPreference('playlist', hisList.map(function(item) {
              return {
                worksId: item.worksId,
                workId: item.workId,
              };
            }));
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
  clickTag(e, vd, tvd) {
    let self = this;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    let $vd = $(vd.element);
    $vd.find('.cur').removeClass('cur');
    $li.addClass('cur');
    let list = self.ref.list;
    if(curTag === 1 && !util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      $vd.find('.cur').removeClass('cur');
      $vd.find('li').eq(0).addClass('cur');
      return;
    }
    list.curTag = curTag = tvd.props.rel;
    switch(curTag) {
      case 0:
        list.setData(hisList);
        if(curPlayTag === 0) {
          jsBridge.getPreference('playlistCur', function(res) {
            playlistCur = res;
            for(let i = 0, len = hisList.length; i < len; i++) {
              let item = hisList[i];
              if(playlistCur && item.workId === playlistCur.workId) {
                list.setCurIndex(i);
                return;
              }
            }
          });
        }
        break;
      case 1:
        list.setData(favorList);
        if(curPlayTag === 1) {
          jsBridge.getPreference('playlistCur', function(res) {
            playlistCur = res;
            for(let i = 0, len = favorList.length; i < len; i++) {
              let item = favorList[i];
              if(playlistCur && item.workId === playlistCur.workId) {
                list.setCurIndex(i);
                return;
              }
            }
          });
        }
        if(loading || loadEnd || hasLoadedFavor) {
          return;
        }
        loading = true;
        net.postJSON('/h5/my/favorMV', { skip, take }, function(res) {
          if(res.success) {
            let data = res.data;
            (data.data || []).forEach(function(item) {
              let works = item.Works_Items_Works[0];
              favorList.push({
                worksId: works.WorksID,
                workId: item.ItemID,
                workName: item.ItemName,
                isLike: item.ISLike,
                isFavor: item.ISFavor,
                likeNum: item.LikeHis,
                url: item.FileUrl,
                lrc: item.lrc,
                worksCover: works.WorksCoverPic,
              });
            });
            // 加载完可能切回最近播放
            if(curTag === 1) {
              list.setData(favorList);
            }
            hasLoadedFavor = true;
            skip += take;
            if(skip >= data.Size) {
              loadEnd = true;
            }
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
            $vd.find('.cur').removeClass('cur');
            $vd.find('li').eq(0).addClass('cur');
            list.curTag = curTag = 0;
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          loading = false;
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          loading = false;
        });
        break;
    }
  }
  checkMore($window) {
    if(curTag !== 1 || loading || loadEnd || !hasLoadedFavor) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    let list = self.ref.list;
    net.postJSON('/h5/my/favorMV', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        let temp = [];
        (data.data || []).forEach(function(item) {
          let works = item.Works_Items_Works[0];
          temp.push({
            worksId: works.WorksID,
            workId: item.ItemID,
            workName: item.ItemName,
            isLike: item.ISLike,
            isFavor: item.ISFavor,
            likeNum: item.LikeHis,
            url: item.FileUrl,
            lrc: item.lrc,
            worksCover: works.WorksCoverPic,
          });
        });
        favorList = favorList.concat(temp);
        // 加载完可能切回最近播放
        if(curTag === 1) {
          list.appendData(temp);
        }
        hasLoadedFavor = true;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
        }
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
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
  render() {
    return <div class="playlist">
      <Media ref="media"/>
      <ul class="tag" onClick={ this.clickTag }>
        <li class="cur" rel={ 0 }>最近播放</li>
        <li rel={ 1 }>收藏列表</li>
      </ul>
      <List ref="list"/>
      <BotPlayBar ref="botPlayBar"/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Playlist;
