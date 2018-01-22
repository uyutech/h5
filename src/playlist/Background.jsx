/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

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
      jsBridge.on('mediaTimeupdate', function() {
        if(isPlaying) {
          return;
        }
        isPlaying = true;
        play();
      });
      jsBridge.on('mediaEnd', function(e) {
        isPlaying = false;
        stop();
        if(e.data) {
          if(e.data.currentTime === e.data.duration) {
            jsBridge.getPreference('playlist_mode', function(res) {
              res = res || 'loop';
              if(res === 'loop') {}
              else if(res === 'repeat') {}
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
    return <div class="g-playlist" onClick={ this.click }>
      <b ref="l1"/>
      <b ref="l2"/>
      <b ref="l3"/>
      <b ref="l4"/>
    </div>;
  }
}

export default Background;
