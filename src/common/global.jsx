/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from './net';
import util from './util';

import MLogin from '../component/mlogin/MLogin.jsx';
import Share from '../component/share/Share.jsx';

let mlogin;
migi.eventBus.on('NEED_LOGIN', function() {
  if(!mlogin) {
    mlogin = migi.render(
      <MLogin/>,
      document.body
    );
  }
  mlogin.show();
});

let share;
migi.eventBus.on('SHARE', function(url) {
  if(url.charAt(0) === '/') {
    url = window.ROOT_DOMAIN + url;
  }
  if(!share) {
    share = migi.render(
      <Share/>,
      document.body
    );
  }
  share.url = url;
  share.show();
});

migi.eventBus.on('PLAYLIST', function() {
  jsBridge.pushWindow('/playlist.html', {
    transparentTitle: true,
    backIcon: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v7W1tby8vL9/f0AAACWlpbb29sAAAD+/v79/f37+/vDw8O4uLgyMjLS0tL6+vrv7+/S0tL39/fz8/PY2NimpqaUlJSjo6Ozs7PY2Nj///9WoHXJAAAAJHRSTlMAAgUIJg8XDBMf9ZCP8RxVRiL459NOMCgWu7OIg2hoXFZOQ0I8A0qaAAAAy0lEQVRYw+3Wxw7CQAxFUWxnSiiBFEjobf7/G/EkrJGwJRbIb3/PKopnZrPZvhmArsZhQLkBiKeUzmIBkJYppZYQNH3qAoGmXz0coaa/ewYU/bpmABR9UUVCUPWBtD2C9b/u94qeAdrlfn4rSlmPb+BaeyfoGQjxMArbGLgXAeViEoQAxaqYhA2JBAq+1AiA5Ez4S+FJoBO6/FFrhDYfFrFwbJpLPm1ioe57nwGpEH3lx9MkFYKLbvy1SQUknuaRxATnoHzm2Wy2j3sBzCEcEv1zv9AAAAAASUVORK5CYII=',
    optionMenuIcon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
    titleColor: '#FFFFFF',
  });
});
