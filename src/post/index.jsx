/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './post.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Post from './Post.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let postID = search.postID;

jsBridge.ready(function() {
  let post = migi.preExist(
    <Post/>,
    '#page'
  );
  net.postJSON('/h5/post/index', { postID }, function(res) {
    if(res.success) {
      post.setData(postID, res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
