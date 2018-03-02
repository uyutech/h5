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
