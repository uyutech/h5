/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../post/ImageView.jsx';

let limit = 0;
let offset = 0;
let ajax;
let loading;
let loadEnd;
let currentPriority = 0;
let cacheKey;

class MyPost extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  init() {
    let self = this;
    cacheKey = 'myPost';
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/my2/post', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let postList = self.ref.postList;
    offset = limit = data.limit;
    postList.setData(data.data);
    if(data.count > limit) {
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    }

    return;

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
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let postList = self.ref.postList;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    ajax = net.postJSON('/h5/my2/post', { offset, limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += limit;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
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
      <PostList ref="postList"
               message={ '正在加载...' }/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default MyPost;
