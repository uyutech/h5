/**
 * Created by army8735 on 2017/12/1.
 */

'use strict';

import util from "../common/util";
import net from "../common/net";
import HotPlayList from '../component/hotplaylist/HotPlayList.jsx';

let take = 30;
let skip = take;
let loading;
let loadEnd;
let hidden;

class MAList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    hidden = this.props.hidden;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      if(self.props.dataList.Size <= take) {
        loadEnd = true;
        self.ref.hotPlayList.message = '已经到底了';
      }
    });
  }
  checkMore($window) {
    if(hidden || loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let hotPlayList = self.ref.hotPlayList;
    loading = true;
    hotPlayList.message = '正在加载...';
    net.postJSON('/h5/author/maList', { authorID: self.props.authorID, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(data.data.length) {
          hotPlayList.appendData(res.data.data);
        }
        if(skip >= data.Size) {
          hotPlayList.message = '已经到底了';
          loadEnd = true;
        }
        else {
          hotPlayList.message = '';
        }
      }
      else {
        hotPlayList.message = res.message || util.ERROR_MESSAGE;
      }
      loading = false;
    }, function(res) {
      hotPlayList.message = res.message || util.ERROR_MESSAGE;
      loading = false;
    });
  }
  show() {
    let self = this;
    $(self.element).removeClass('fn-hide');
    hidden = false;
  }
  hide() {
    let self = this;
    $(self.element).addClass('fn-hide');
    hidden = true;
  }
  render() {
    return <div class={ 'ma-list' + (this.props.hidden ? ' fn-hide' : '') }>
      <HotPlayList ref="hotPlayList" dataList={ this.props.dataList.data }/>
    </div>;
  }
}

export default MAList;
