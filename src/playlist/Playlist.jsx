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

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let list = self.ref.list;
      let media = self.ref.media;
      let botPlayBar = self.ref.botPlayBar;
      let inputCmt = self.ref.inputCmt;
      let count = 0;
      function fin() {
        if(count >= 2) {
          for(let i = 0, len = playlistCache.length; i < len; i++) {
            let item = playlistCache[i];
            if(item.worksId === playlistCur.worksId && item.workId === playlistCur.workId) {
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
          // 误差<1s认为播放完毕，因为end事件偶尔在加载出错过程中抛出
          if(Math.abs(e.data.duration - e.data.currentTime) < 1000) {
            if(botPlayBar.mode === 'repeat') {
              media.repeat();
            }
            else if(botPlayBar.mode === 'loop') {
              list.nextLoop();
            }
          }
        }
      });
      jsBridge.on('optionMenu2', function() {
        list.currentFn();
      });
      jsBridge.on('mediaTimeupdate', function(e) {
        if(e.data) {
          botPlayBar.isPlaying = true;
        }
      });

      list.on('choose', function(data) {
        media.setData(data);
        media.play();
      });

      media.on('play', function(data) {
        botPlayBar.isPlaying = true;
        jsBridge.setPreference('playlistCur', data);
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
        botPlayBar.hide();
        inputCmt.show();
      });

      inputCmt.on('fn', function() {
        inputCmt.hide();
        botPlayBar.show();
      });
      inputCmt.on('click', function() {});

      migi.eventBus.on(['likeWork', 'favorWork'], function(res) {
        jsBridge.setPreference('playlist', res.list);
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
    });
  }
  render() {
    return <div class="playlist">
      <Media ref="media"/>
      <ul class="tag">
        <li class="cur">曲目</li>
        <li>收藏列表</li>
      </ul>
      <List ref="list"/>
      <BotPlayBar ref="botPlayBar"/>
      <BotFn ref="botFn"/>
      <InputCmt ref="inputCmt" hidden={ true } placeholder={ '发表评论...' } readOnly={ true }/>
    </div>;
  }
}

export default Playlist;