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
let postId = search.postId || search.postID;

jsBridge.ready(function() {
  let post = migi.preExist(
    <Post/>,
    '#page'
  );
  post.init(postId);
});
