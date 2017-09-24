/**
 * Created by army8735 on 2017/9/11.
 */

import './works.html';
import './index.less';

import qs from 'anima-querystring';

import Works from './Works.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let works = migi.render(
    <Works/>,
    '#page'
  );

  works.setID(id);
  works.load();
});
