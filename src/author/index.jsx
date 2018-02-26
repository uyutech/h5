/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './author.html';
import './index.less';

import qs from 'anima-querystring';

import Author from './Author.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let authorId = search.authorId;

jsBridge.ready(function() {
  if(!authorId) {
    jsBridge.toast('未知authorId');
    return;
  }
  let author = migi.preExist(
    <Author/>,
    '#page'
  );
  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
  });
  jsBridge.getPreference('authorPageNav_' + authorId, function(res) {
    if(res) {
      author.ref.nav.setData(res);
    }
  });
  author.load(authorId);
});
