/**
 * Created by army8735 on 2017/9/18.
 */

import './author.html';
import './index.less';

import qs from 'anima-querystring';

import Author from './Author.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

let author = migi.render(
  <Author/>,
  '#page'
);

author.setID(id);
author.load();
