/**
 * Created by army8735 on 2017/8/3.
 */

import './redirect.html';
import './index.less';

import qs from 'anima-querystring';

let search = qs.parse(location.search.replace(/^\?/, ''));
let data = {};
try {
  data = JSON.parse(search.data || '{}') || {};
}
catch(e) {
  console.log(e.toString());
  data = {};
}

let regStat = data.User_Reg_Stat;
if(regStat !== undefined) {
  if(regStat >= 4) {
    location.href = 'index.html';
  }
  else {
    location.href = 'guide.html?step=' + regStat;
  }
}
else {
  location.href = 'login.html';
}
