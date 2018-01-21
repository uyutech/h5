/**
 * Created by army8735 on 2018/1/17.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from './Media.jsx';
import MediaPlaylist from '../component/playlist/Playlist.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let playlistCur;

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let playlist = self.ref.playlist;
      let media = self.ref.media;
      let botPlayBar = media.ref.botPlayBar;
      jsBridge.getPreference('playlist', function(res) {
        let count = 0;
        function fin() {
          if(count >= 3) {
            for(let i = 0, len = self.list.length; i < len; i++) {
              let item = self.list[i];
              if(item.ItemID === playlistCur.workID) {
                jsBridge.setTitle(item.ItemName);
                self.cur = item;
                media.setData(item);
                playlist.setCur(playlistCur);
                return;
              }
            }
            let item = self.list[0];
            jsBridge.setTitle(item.ItemName);
            self.cur = item;
            media.setData(item);
            playlist.setCurIndex(0);
            self.loaded = true;
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
            self.playing = !!res;
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
      playlist.on('choose', function(data) {
        media.setData(data.data);
        media.play();
        let o = {
          workID: data.data.ItemID,
          worksID: data.data.Works_Items_Works[0].WorksID,
        };
        jsBridge.setPreference('playlist_cur', o);
      });
      botPlayBar.on('prev', function() {
        playlist.prevLoop();
      });
      botPlayBar.on('next', function() {
        playlist.nextLoop();
      });
    });
  }
  @bind loaded
  @bind list
  @bind cur
  @bind playing
  clickDel(botFn) {}
  render() {
    return <div class="playlist">
      <Media ref="media"/>
      <ul class="tag">
        <li class="cur">曲目</li>
        <li>收藏列表</li>
      </ul>
      <MediaPlaylist ref="playlist" canDel={ true } clickDel={ this.clickDel }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Playlist;
