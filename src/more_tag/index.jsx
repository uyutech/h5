/**
 * Created by army8735 on 2017/12/26.
 */

'use strict';

import './more_tag.html';
import './index.less';

import MoreTag from './MoreTag.jsx';

jsBridge.ready(function() {
  let moreTag = migi.preExist(
    <MoreTag/>,
    '#page'
  );
  $net.postJSON('/h5/subpost/moreTag', function(res) {
    if(res.success) {
      moreTag.setData(res.data.tags);
    }
    else {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    }
  }, function(res) {
    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
  });
});
