/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../post/ImageView.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let limit = 0;
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
  // @bind userId
  init(userId) {
    let self = this;
    self.userId = userId;
    cacheKey = 'userData_' + userId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/user2/index', { userId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        let cache = {};
        Object.keys(data).forEach(function(k) {
          if(k !== 'comment') {
            cache[k] = data[k];
          }
        });
        jsBridge.setPreference(cacheKey, cache);
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
    let nav = self.ref.nav;
    let postList = self.ref.postList;

    nav.setData(data.info);

    if(data.post && data.post.size) {
      limit = data.post.limit;
      offset = limit;
      postList.setData(data.post.data);
      if(data.post.size > limit) {
        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
    }

    return;
    self.ref.nav.userInfo = data.userInfo;
    self.ref.nav.followState = data.followState;

    let $window = $(window);
    loadEnd = data.userPost.Size <= take;
    if(loadEnd) {
      self.ref.hotPost.message = '已经到底了';
    }
    else {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }

    let hotPost = self.ref.hotPost;
    hotPost.appendData(data.userPost.data);
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
    postList.message = '正在加载...';
    ajax = net.postJSON('/h5/user2/post', { circleId: self.circleId, offset, limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += limit;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        if(offset >= data.size) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
        else {
          postList.message = '';
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
    return <div class="user">
      <Background/>
      <Nav ref="nav"/>
      <PostList ref="postList"
                message={ '正在加载...' }/>
      <ImageView ref="imageView"/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default User;
