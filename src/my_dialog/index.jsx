/**
 * Created by army8735 on 2018/5/25.
 */

'use strict';

import './my_dialog.html';
import './index.less';

import qs from 'anima-querystring';

import MyDialog from './MyDialog.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow({
      myMessage: true,
      myDialog: id,
    });
  });
  let myDialog = migi.preExist(
    <MyDialog/>,
    '#page'
  );
  myDialog.init(id);
});
