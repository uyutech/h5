/**
 * Created by army8735 on 2017/9/21.
 */

import './search.html';
import './index.less';

import qs from 'anima-querystring';

import TopNav from '../component/topnav/TopNav.jsx';
import Search from './Search.jsx';

let s = qs.parse(location.search.replace(/^\?/, ''));
let kw = s.kw;

let topNav = migi.render(
  <TopNav/>,
  '#page'
);
topNav.on('search', function(kw) {
  location.href = '?kw=' + kw;
});

let search = migi.render(
  <Search/>,
  '#page'
);

if(kw && kw.length) {
  topNav.kw = kw;
  search.load(kw);
}