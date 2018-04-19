/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let offset = 0;
let ajax;
let loading;
let loadEnd;

let currentPriority = 0;
let cacheKey;

class User extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind id
  init(id) {
    let self = this;
    self.id = id;
    cacheKey = 'userData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/user2/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        let cache = {};
        Object.keys(data).forEach(function(k) {
          if(k !== 'comment') {
            cache[k] = data[k];
          }
        });
        jsBridge.setPreference(cacheKey, cache);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.data = data;
    let nav = self.ref.nav;
    let postList = self.ref.postList;

    nav.setData(data.info, data.followPersonCount, data.fansCount, data.isFollow, data.isFans);

    if(data.postList && data.postList.count) {
      offset = data.postList.limit;
      postList.setData(data.postList.data);
      if(offset >= data.postList.count) {
        loadEnd = true;
        postList.message = '已经到底了';
      }
      else {
        loadEnd = false;
        postList.message = '正在加载...';
      }
    }
    else {
      loadEnd = true;
      postList.message = '暂无动态';
    }

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
    if($util.isBottom()) {
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
    ajax = $net.postJSON('/h5/user2/postList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += data.limit;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  follow(data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.isFollow = data.state;
        cache.fansCount = data.count;
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  render() {
    return <div class="user">
      <Background/>
      <Nav ref="nav"
           on-follow={ this.follow }/>
      <PostList ref="postList"
                visible={ true }
                message={ '正在加载...' }/>
      <ImageView ref="imageView"/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default User;
