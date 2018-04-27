/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

function setHeight($b, percent) {
  $b.css('height', Math.floor(percent) + '%');
}

class Background extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $l1 = $(self.ref.l1.element);
      let $l2 = $(self.ref.l2.element);
      let $l3 = $(self.ref.l3.element);
      let $l4 = $(self.ref.l4.element);
      function play() {
        setHeight($l1, Math.random() * 62);
        setHeight($l2, Math.random() * 62);
        setHeight($l3, Math.random() * 62);
        setHeight($l4, Math.random() * 62);
        if(self.timeout) {
          clearTimeout(self.timeout);
        }
        self.timeout = setTimeout(function() {
          setHeight($l1, 31);
          setHeight($l2, 62);
          setHeight($l3, 31);
          setHeight($l4, 62);
        }, 300);
      }
      jsBridge.on('mediaTimeupdate', function(e) {
        play();
      });
      if(self.props.disableEvent) {
        return;
      }
      jsBridge.on('mediaEnd', function(e) {
        let playlistCur;
        let playlist;
        let mode;
        let count = 0;
        function fin() {
          if(count >= 3) {
            if(mode === 'loop') {
              // 异常情况，直接播放第一个，否则播放下一个
              for(let i = 0, len = playlist.length; i < len; i++) {
                let item = playlist[i];
                if(item.worksId === playlistCur.worksId && item.workId === playlistCur.workId) {
                  let next = i + 1;
                  if(next === len) {
                    next = 0;
                  }
                  playlistCur = playlist[next];
                  jsBridge.setPreference('playlistCur', playlistCur);
                  jsBridge.media({
                    key: 'info',
                    value: {
                      id: playlistCur.workId,
                      url: location.protocol + $util.autoSsl(playlistCur.url),
                      name: playlistCur.workId,
                    },
                  });
                  jsBridge.media({
                    key: 'play',
                  });
                  return;
                }
              }
              playlistCur = playlist[0];
              jsBridge.setPreference('playlistCur', playlistCur);
              jsBridge.media({
                key: 'info',
                value: {
                  url: location.protocol + $util.autoSsl(playlistCur.url),
                  name: playlistCur.workId,
                },
              });
              jsBridge.media({
                key: 'play',
              });
            }
            else if(mode === 'repeat') {
              jsBridge.media({
                key: 'play',
              });
            }
          }
        }
        if(e.data) {
          jsBridge.getPreference('playlist_mode', function(res) {
            res = res || 'loop';
            mode = res;
            if(res === 'loop' || res === 'repeat') {
              count++;
              fin();
            }
          });
          jsBridge.getPreference('playlistCur', function(res) {
            playlistCur = res || {};
            count++;
            fin();
          });
          jsBridge.getPreference('playlist', function(res) {
            playlist = jsBridge.android ? (res || []) : JSON.parse(res || '[]');
            count++;
            fin();
          });
        }
      });
      // 空绑service，回到前台重绑以接收media事件
      jsBridge.media();
      jsBridge.on('resume', function() {
        jsBridge.media();
      });
    });
  }
  click() {
    if(this.props.disableClick) {
      return;
    }
    let version = jsBridge.appVersion.split('.');
    let major = parseInt(version[0]) || 0;
    let minor = parseInt(version[1]) || 0;
    let patch = parseInt(version[2]) || 0;
    if(jsBridge.ios && major < 0 && minor < 6) {
      return;
    }
    jsBridge.pushWindow('/record.html', {
      title: '最近播放',
      transparentTitle: true,
    });
  }
  render() {
    return <div class="cp-background" onClick={ this.click }>
      <b ref="l1"/>
      <b ref="l2"/>
      <b ref="l3"/>
      <b ref="l4"/>
    </div>;
  }
}

export default Background;
