/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class User extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind userID
  load(userID) {
    let self = this;
    self.userID = userID;
    net.postJSON('/h5/user/index', { userID }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;
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
      self.loadMore();
    }
  }
  loadMore() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    let hotPost = self.ref.hotPost;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/user/postList', { userID: self.userID, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.appendData(res.data.data);
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
    return <div class="user">
      <Background/>
      <Nav ref="nav"/>
      <HotPost ref="hotPost"/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default User;
