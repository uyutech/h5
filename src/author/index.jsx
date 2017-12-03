/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import './author.html';
import './index.less';

import qs from 'anima-querystring';

import net from '../common/net';
import util from '../common/util';
import Author from './Author.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let authorID = search.authorID;

jsBridge.ready(function() {
  let author = migi.preExist(
    <Author/>,
    '#page'
  );
  net.postJSON('/h5/author/index', { authorID }, function(res) {
    if(res.success) {
      author.setData(authorID, res.data);
    }
    else {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || util.ERROR_MESSAGE);
  });
});
