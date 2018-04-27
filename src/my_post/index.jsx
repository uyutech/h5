/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import './my_post.html';
import './index.less'

import MyPost from './MyPost.jsx';

jsBridge.ready(function() {
  let myPost = migi.preExist(
    <MyPost/>,
    '#page'
  );
  myPost.init();
});
