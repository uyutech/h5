/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';

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
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    net.postJSON('/h5/my2/postList', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
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

    postList.setData(data.data);
    offset = data.limit;
    if(data.count === 0) {
      postList.message = '暂无画圈';
    }
    else if(offset >= data.count) {
      postList.message = '已经到底了';
    }

    // let hotPost = self.ref.hotPost;
    // let imageView = self.ref.imageView;
    // imageView.on('clickLike', function(sid) {
    //   hotPost.like(sid, function(res) {
    //     imageView.isLike = res.ISLike || res.State === 'likeWordsUser';
    //   });
    // });
    // jsBridge.on('back', function(e) {
    //   if(!imageView.isHide()) {
    //     e.preventDefault();
    //     imageView.hide();
    //   }
    // });
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
    ajax = net.postJSON('/h5/my2/postList', { offset, }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        offset += data.limit;
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
  commentFavor(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.data.forEach(function(item) {
          if(item.id === id) {
            item.isFavor = data.state;
            item.favorCount = data.count;
          }
        })
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  commentLike(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.data.forEach(function(item) {
          if(item.id === id) {
            item.isLike = data.state;
            item.likeCount = data.count;
          }
        })
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  render() {
    return <div class="mypost">
      <h4>我画的圈</h4>
      <PostList ref="postList"
                visible={ true }
                message={ '正在加载...' }
                on-favor={ this.commentFavor }
                on-like={ this.commentLike }/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default MyPost;
