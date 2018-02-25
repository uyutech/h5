/**
 * Created by army8735 on 2018/2/25.
 */

'use strict';

import HotPost from '../component/hotpost/HotPost.jsx';
import net from "../common/net";
import util from "../common/util";

let take = 10;
let skip = take;
let loading;
let loadEnd;
let ajax;

class Dynamics extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      if(self.props.data.Size > take) {
        let $window = $(window);
        $window.on('scroll', function() {
          if(!self.visible) {
            return;
          }
          self.checkMore($window);
        });
      }
      else {
        self.ref.hotPost.message = '已经到底了';
      }
    });
  }
  @bind visible
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let scrollY = $window.scrollTop();
    let bool;
    bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/author/dynamic', { authorId: self.props.authorId, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  render() {
    return <div class={ this.visible ? '' : 'fn-hide' }>
      <HotPost ref="hotPost"
               dataList={ this.props.data.data }/>
    </div>;
  }
}

export default Dynamics;
