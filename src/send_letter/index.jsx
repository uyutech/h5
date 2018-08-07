/**
 * Created by army8735 on 2018/8/7.
 */

'use strict';

import './send_letter.html';
import './index.less';

import qs from 'anima-querystring';

import SendLetter from './SendLetter.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  jsBridge.refreshState(false);
  let sendLetter = migi.preExist(
    <SendLetter/>,
    '#page'
  );
  sendLetter.init(id);
});
