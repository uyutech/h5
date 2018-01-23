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
  let author = migi.preExist(
    <Author/>,
    '#page'
  );
  jsBridge.getPreference('authorPageNav_' + authorId, function(res) {
    if(res) {
      console.log(res);
      author.ref.nav.setData(res);
    }
  });
  author.load(authorId);
});
