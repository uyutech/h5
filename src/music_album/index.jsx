/**
 * Created by army8735 on 2018/2/3.
 */

'use strict';

import './music_album.html';
import './index.less';

import qs from 'anima-querystring';

import MusicAlbum from './MusicAlbum.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = parseInt(search.id);
let workId = parseInt(search.workId) || undefined;

jsBridge.ready(function() {
  let music = migi.preExist(
    <MusicAlbum/>,
    '#page'
  );
  music.init(id, workId);

  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
  });
});
