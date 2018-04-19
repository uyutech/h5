/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './post.html';
import './index.less';

import qs from 'anima-querystring';


import util from '../common/util';
import Post from './Post.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let post = migi.preExist(
    <Post/>,
    '#page'
  );
  post.init(id);

  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
  });
});
