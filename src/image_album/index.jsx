/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import './image_album.html';
import './index.less';

import qs from 'anima-querystring';

import ImageAlbum from './ImageAlbum.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = parseInt(search.id);

jsBridge.ready(function() {
  let imageAlbum = migi.preExist(
    <ImageAlbum/>,
    '#page'
  );
  imageAlbum.init(id);
});
