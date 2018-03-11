/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './user.html';
import './index.less';

import qs from 'anima-querystring';

import User from './User.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let userID = search.userID;

jsBridge.ready(function() {
  let user = migi.preExist(
    <User/>,
    '#page'
  );
  user.load(userID);
  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
  });
  // net.postJSON('/h5/user/index', { userID }, function(res) {
  //   if(res.success) {
  //     user.setData(userID, res.data);
  //   }
  //   else {
  //     jsBridge.toast(res.message || util.ERROR_MESSAGE);
  //   }
  // }, function(res) {
  //   jsBridge.toast(res.message || util.ERROR_MESSAGE);
  // });
});
