/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Profile from './Profile.jsx';
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
  @bind hasData
  @bind userID
  setData(userID, data) {
    let self = this;

    self.userID = userID;
    self.userInfo = data.userInfo;
    self.followState = data.followState;
    self.userPost = data.userPost;

    self.hasData = true;

    let $window = $(window);
    loadEnd = self.userPost.Size <= take;
    if(loadEnd) {
      self.ref.hotPost.message = '已经到底了';
    }
    else {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }

    let hotPost = self.ref.hotPost;
    let imageView = self.ref.imageView;
    imageView.on('clickLike', function(sid) {
      hotPost.like(sid, function(res) {
        imageView.isLike = res.ISLike;
      });
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
  genDom() {
    let self = this;
    return <div>
      <Profile userInfo={ self.userInfo } followState={ self.followState }/>
      <h4>TA画的圈</h4>
      <HotPost ref="hotPost" dataList={ self.userPost.data }/>
      <ImageView ref="imageView"/>
    </div>;
  }
  render() {
    return <div class="user">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default User;
