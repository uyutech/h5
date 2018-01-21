/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from './Media.jsx';
import MediaPlaylist from '../component/playlist/Playlist.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';

let playlistCur;
let playlistCache;

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let playlist = self.ref.playlist;
      let media = self.ref.media;
      let botPlayBar = self.ref.botPlayBar;
      let inputCmt = self.ref.inputCmt;
      jsBridge.getPreference('playlist', function(res) {
        playlistCache = res || [];
        let count = 0;
        function fin() {
          if(count >= 3) {
            for(let i = 0, len = self.list.length; i < len; i++) {
              let item = self.list[i];
              if(item.ItemID === playlistCur.workID) {
                jsBridge.setTitle(item.ItemName);
                media.setData(item);
                playlist.setCur(playlistCur);
                return;
              }
            }
            let item = self.list[0];
            jsBridge.setTitle(item.ItemName);
            media.setData(item);
            playlist.setCurIndex(0);
          }
        }
        if(res && res.length) {
          let arr = [];
          let hash = {};
          res.forEach(function(item) {
            arr.push(item.workID);
            hash[item.workID] = item.worksID;
          });
          let workIDs = arr.join(',');
          net.postJSON('/h5/playlist/index', { workIDs }, function(res) {
            if(res.success) {
              let data = res.data.data;
              // 后端大作品全部返回，暂时无法对上记录，手动排序到第一个，给播放列表用取第一个
              data.forEach(function(item) {
                let worksID = hash[item.ItemID];
                for(let i = 1, len = item.Works_Items_Works.length; i < len; i++) {
                  let cur = item.Works_Items_Works[i];
                  if(cur.WorksID === worksID) {
                    item.Works_Items_Works[i] = item.Works_Items_Works[0];
                    item.Works_Items_Works[0] = cur;
                    break;
                  }
                }
              });
              playlist.appendData(self.list = data);
              count++;
              fin();
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
          jsBridge.getPreference('playlist_playing', function(res) {
            self.isPlaying = !!res;
            count++;
            fin();
          });
          jsBridge.getPreference('playlist_cur', function(res) {
            playlistCur = res;
            count++;
            fin();
          });
        }
      });
      jsBridge.on('end', function(e) {
        if(e.data) {
          if(e.data.currentTime === e.data.duration) {
            if(botPlayBar.mode === 'repeat') {
              media.repeat();
            }
            else if(botPlayBar.mode === 'loop') {
              botPlayBar.clickNext();
            }
          }
        }
      });
      jsBridge.on('optionMenu1', function() {
        playlist.currentFn();
      });
      jsBridge.on('timeupdate', function(e) {
        if(e.data) {
          botPlayBar.isPlaying = true;
        }
      });
      playlist.on('choose', function(data) {
        media.setData(data.data);
        media.play();
      });
      media.on('play', function(data) {
        botPlayBar.isPlaying = true;
        jsBridge.setPreference('playlist_playing', true);
        let o = {
          workID: data.ItemID,
          worksID: data.Works_Items_Works[0].WorksID,
        };
        jsBridge.setPreference('playlist_cur', o);
      });
      media.on('pause', function() {
        botPlayBar.isPlaying = false;
        jsBridge.setPreference('playlist_playing', false);
      });
      media.on('stop', function() {
        botPlayBar.isPlaying = false;
        jsBridge.setPreference('playlist_playing', false);
      });
      botPlayBar.on('prev', function() {
        playlist.prevLoop();
      });
      botPlayBar.on('next', function() {
        playlist.nextLoop();
      });
      botPlayBar.on('play', function() {
        media.play();
      });
      botPlayBar.on('pause', function() {
        media.pause();
      });
      botPlayBar.on('comment', function() {
        botPlayBar.hide();
        inputCmt.show();
      });
      inputCmt.on('fn', function() {
        inputCmt.hide();
        botPlayBar.show();
      });
      inputCmt.on('click', function() {});
    });
  }
  clickDel(botFn, data) {
    let self = this;
    botFn.pop = false;
    let media = self.ref.media;
    if(data.isEmpty) {
      self.list = [];
      media.setData(null);
      jsBridge.setPreference('playlist');
      jsBridge.setPreference('playlist_playing');
      jsBridge.setPreference('playlist_cur');
    }
    else if(data.isCur) {
      self.list.splice(data.index, 1);
      let isPlaying = media.isPlaying;
      media.setData(data.first);
      if(isPlaying) {
        media.play();
      }
      self.ref.playlist.setCurIndex(0);
      playlistCache.splice(data.index, 1);
      jsBridge.setPreference('playlist', playlistCache);
    }
  }
  render() {
    return <div class="playlist">
      <Media ref="media"/>
      <ul class="tag">
        <li class="cur">曲目</li>
        <li>收藏列表</li>
      </ul>
      <MediaPlaylist ref="playlist" canDel={ true } clickDel={ this.clickDel.bind(this) }/>
      <BotPlayBar ref="botPlayBar"/>
      <BotFn ref="botFn"/>
      <InputCmt ref="inputCmt" hidden={ true } placeholder={ '发表评论...' } readOnly={ true }/>
    </div>;
  }
}

export default Playlist;
