/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class MyPost extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  setData(data) {
    let self = this;

    self.ref.hotPost.setData(data.data);
    loadEnd = data.Size <= take;

    let $window = $(window);
    if(!loadEnd) {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }

    let hotPost = self.ref.hotPost;
    let imageView = self.ref.imageView;
    imageView.on('clickLike', function(sid) {
      hotPost.like(sid, function(res) {
        imageView.isLike = res.ISLike || res.State === 'likeWordsUser';
      });
    });
    jsBridge.on('back', function(e) {
      if(!imageView.isHide()) {
        e.preventDefault();
        imageView.hide();
      }
    });
  }
  checkMore($window) {
    if(loading || loadEnd) {
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
    if(loading) {
      return;
    }
    loading = true;
    let hotPost = self.ref.hotPost;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/my/postList', { skip, take }, function(res) {
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
    return <div class="mypost">
      <h4>我画的圈</h4>
      <HotPost ref="hotPost"
               message={ '正在加载...' }/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default MyPost;
