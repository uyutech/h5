/**
 * Created by army8735 on 2017/8/3.
 */

import './redirect.html';
import './index.less';

jsBridge.ready(function() {
  jsBridge.swipeRefresh(false);
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.moveTaskToBack();
  });
  util.postJSON('api/Users/ChkCookie', function(res) {
    if(res.success) {
      location.replace('index.html');
      let data = res.data;
      let regStat = data.User_Reg_Stat;
      let authorName = data.AuthorName;
      if(regStat >= 4) {
        location.replace('index.html');
      }
      else {
        location.replace('guide.html?step=' + regStat + '&authorName=' + encodeURIComponent(authorName));
      }
    }
    else {
      location.replace('login.html');
    }
  }, function() {
    location.replace('login.html');
  });
});

// import qs from 'anima-querystring';
//
// let search = qs.parse(location.search.replace(/^\?/, ''));
// let data = {};
// try {
//   data = JSON.parse(search.data || '{}') || {};
// }
// catch(e) {
//   console.log(e.toString());
//   data = {};
// }
// // location.replace('index.html');
//
// let regStat = data.User_Reg_Stat;
// let authorName = data.AuthorName;
// if(regStat !== undefined && regStat !== null) {
//   if(regStat >= 4) {
//     location.replace('index.html');
//   }
//   else {
//     location.replace('guide.html?step=' + regStat + '&authorName=' + encodeURIComponent(authorName));
//   }
// }
// else {
//   location.replace('login.html');
// }
