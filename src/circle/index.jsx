/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './circle.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Circle from './Circle.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let circleId = search.circleId;

jsBridge.ready(function() {
  let circle = migi.preExist(
    <Circle/>,
    '#page'
  );
  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
  });
  circle.init(circleId);
});
