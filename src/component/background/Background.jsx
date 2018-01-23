/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

import util from "../../common/util";

let interval;
let isPlaying;

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
        stop();
        interval = setInterval(function() {
          setHeight($l1, Math.random() * 62);
          setHeight($l2, Math.random() * 62);
          setHeight($l3, Math.random() * 62);
          setHeight($l4, Math.random() * 62);
        }, 100);
      }
      function stop() {
        if(interval) {
          clearInterval(interval);
        }
        setHeight($l1, 31);
        setHeight($l2, 62);
        setHeight($l3, 31);
        setHeight($l4, 62);
      }
      jsBridge.on('mediaTimeupdate', function(e) {
        if(isPlaying) {
          return;
        }
        isPlaying = true;
        play();
      });
      jsBridge.on('mediaEnd', function(e) {
        isPlaying = false;
        stop();
        let playlist_cur;
        let playlist;
        let mode;
        let count = 0;
        function fin() {
          if(count >= 3) {
            if(mode === 'loop') {
              // 异常情况，直接播放第一个，否则播放下一个
              for(let i = 0, len = playlist.length; i < len; i++) {
                let item = playlist[i];
                if(item.worksId === playlist_cur.worksId && item.workId === playlist_cur.workId) {
                  let next = i + 1;
                  if(next === len) {
                    next = 0;
                  }
                  playlist_cur = playlist[next];
                  jsBridge.setPreference('playlist_cur', playlist_cur);
                  jsBridge.media({
                    key: 'info',
                    value: {
                      url: location.protocol + util.autoSsl(playlist_cur.url),
                      name: playlist_cur.workId,
                    },
                  });
                  jsBridge.media({
                    key: 'play',
                  });
                  return;
                }
              }
              playlist_cur = playlist[0];
              jsBridge.setPreference('playlist_cur', playlist_cur);
              jsBridge.media({
                key: 'info',
                value: {
                  url: location.protocol + util.autoSsl(playlist_cur.url),
                  name: playlist_cur.workId,
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
          // 误差<1s认为播放完毕，因为end事件偶尔在加载出错过程中抛出
          if(Math.abs(e.data.duration - e.data.currentTime) < 1000) {
            jsBridge.getPreference('playlist_mode', function(res) {
              res = res || 'loop';
              mode = res;
              if(res === 'loop' || res === 'repeat') {
                count++;
                fin();
              }
            });
            jsBridge.getPreference('playlist_cur', function(res) {
              playlist_cur = res || {};
              count++;
              fin();
            });
            jsBridge.getPreference('playlist', function(res) {
              playlist = res || [];
              count++;
              fin();
            });
          }
        }
      });
      // 空绑service
      jsBridge.media();
      jsBridge.on('resume', function() {
        jsBridge.media();
      });
      jsBridge.on('pause', function() {
        isPlaying = false;
        stop();
      });
    });
  }
  click() {
    jsBridge.pushWindow('/playlist.html', {
      transparentTitle: true,
      backIcon: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v7W1tby8vL9/f0AAACWlpbb29sAAAD+/v79/f37+/vDw8O4uLgyMjLS0tL6+vrv7+/S0tL39/fz8/PY2NimpqaUlJSjo6Ozs7PY2Nj///9WoHXJAAAAJHRSTlMAAgUIJg8XDBMf9ZCP8RxVRiL459NOMCgWu7OIg2hoXFZOQ0I8A0qaAAAAy0lEQVRYw+3Wxw7CQAxFUWxnSiiBFEjobf7/G/EkrJGwJRbIb3/PKopnZrPZvhmArsZhQLkBiKeUzmIBkJYppZYQNH3qAoGmXz0coaa/ewYU/bpmABR9UUVCUPWBtD2C9b/u94qeAdrlfn4rSlmPb+BaeyfoGQjxMArbGLgXAeViEoQAxaqYhA2JBAq+1AiA5Ez4S+FJoBO6/FFrhDYfFrFwbJpLPm1ioe57nwGpEH3lx9MkFYKLbvy1SQUknuaRxATnoHzm2Wy2j3sBzCEcEv1zv9AAAAAASUVORK5CYII=',
      optionMenuIcon2: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
      titleColor: '#FFFFFF',
    });
  }
  render() {
    return <div class={ 'cp-background' + (this.props.topRight ? ' tr' : '') } onClick={ this.click }>
      <b ref="l1"/>
      <b ref="l2"/>
      <b ref="l3"/>
      <b ref="l4"/>
    </div>;
  }
}

export default Background;
