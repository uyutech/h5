/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from './Media.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import List from './List.jsx';

let playlistCur;
let playlistCache;

let take = 20;
let skip = 0;
let loading;
let loadEnd;
let hasLoaded;
let curTag = 0;
let curPlayTag = 0;
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
          for(let i = 0, len = playlistCache.length; i < len; i++) {
            let item = playlistCache[i];
            if(playlistCur && item.worksId === playlistCur.worksId && item.workId === playlistCur.workId) {
              jsBridge.setTitle(item.workName);
              media.setData(item);
              list.setCurIndex(i);
              return;
            }
          }
          // 找不到默认播第一个
          let item = playlistCache[0];
          if(item) {
            jsBridge.setTitle(item.workName);
            media.setData(item);
            list.setCurIndex(0);
          }
        }
      }
      jsBridge.getPreference('playlist', function(res) {
        playlistCache = res || [];
        list.appendData(playlistCache);
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
        if(media.data && media.data.worksId === data.worksId && media.data.workId === data.workId) {
          media.play();
          return;
        }
        media.stop();
        media.setData(data);
        media.play();
        jsBridge.setPreference('playlistCur', data);
        jsBridge.getPreference('playlist', function(res) {
          playlistCache = res || [];
          for(let i = 0, len = playlistCache.length; i < len; i++) {
            let item = playlistCache[i];
            if(item.worksId === data.worksId && item.workId === data.workId) {
              return;
            }
          }
          playlistCache.unshift(data);
          jsBridge.setPreference('playlist', playlistCache);
        });
      });
      list.on('change', function(res) {
        let data = res.data;
        jsBridge.setTitle(data.workName);
        curPlayTag = curTag;
        // 只有一首或者播放中切换到另外一个列表，结束时假如当前列表进行切换的和正在播放的相同，直接从0开始重新播放
        if(media.data && media.data.worksId === data.worksId && media.data.workId === data.workId) {
          media.currentTime = 0;
          media.play();
          list.setCurIndex(res.index);
          return;
        }
        media.setData(data);
        media.play();
        jsBridge.setPreference('playlistCur', data);
        jsBridge.getPreference('playlist', function(res) {
          playlistCache = res || [];
          for(let i = 0, len = playlistCache.length; i < len; i++) {
            let item = playlistCache[i];
            if(item.worksId === data.worksId && item.workId === data.workId) {
              return;
            }
          }
          playlistCache.unshift(data);
          jsBridge.setPreference('playlist', playlistCache);
        });
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
        jsBridge.getPreference('playlistCur', function(res) {
          if(res) {
            jsBridge.pushWindow('/subcomment.html?type=3&id='
              + res.worksId + '&sid=' + res.workId, {
              title: '评论',
            });
          }
        });
      });

      list.on(['likeWork', 'favorWork'], function(res) {
        let data = res.data;
        jsBridge.getPreference('playlist', function(res) {
          playlistCache = res || [];
          for(let i = 0, len = playlistCache.length; i < len; i++) {
            let item = playlistCache[i];
            if(item.worksId === data.worksId && item.workId === data.workId) {
              playlistCache[i] = data;
              jsBridge.setPreference('playlist', playlistCache);
              return;
            }
          }
        });
      });
      list.on('del', function(res) {
        jsBridge.setPreference('playlist', res.list);
        if(!res.list.length) {
          media.setData(null);
          jsBridge.setPreference('playlistCur');
        }
        else if(res.isCur) {
          media.setData(res.list[0]);
          media.play();
          list.setCurIndex(0);
          jsBridge.setPreference('playlistCur', res.list[0]);
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
    let count = 0;
    function fin() {
      if(count >=2) {
        for(let i = 0, len = playlistCache.length; i < len; i++) {
          let item = playlistCache[i];
          if(playlistCur && item.worksId === playlistCur.worksId && item.workId === playlistCur.workId) {
            list.setCurIndex(i);
            return;
          }
        }
      }
    }
    switch(curTag) {
      case 0:
        jsBridge.getPreference('playlist', function(res) {
          playlistCache = res || [];
          list.setData(playlistCache);
          count++;
          fin();
        });
        if(curPlayTag === 0) {
          jsBridge.getPreference('playlistCur', function(res) {
            playlistCur = res;
            count++;
            fin();
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
              if(playlistCur && item.worksId === playlistCur.worksId && item.workId === playlistCur.workId) {
                list.setCurIndex(i);
                return;
              }
            }
          });
        }
        if(loading || loadEnd || hasLoaded) {
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
            hasLoaded = true;
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
    if(curTag !== 1 || loading || loadEnd || !hasLoaded) {
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
        hasLoaded = true;
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
