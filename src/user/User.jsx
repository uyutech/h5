/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Profile from './Profile.jsx';
import Page from '../component/page/Page.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';

let loading;
let take = 10;
let skip = take;

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

    let page = self.ref.page;
    let page2 = self.ref.page2;
    page.on('page', function(i) {
      if(page2) {
        page2.index = i;
      }
      self.load(i);
    });
    if(page2) {
      page2.on('page', function(i) {
        page.index = i;
        self.load(i);
      });
    }
  }
  load(i) {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    skip = (i - 1) * take;
    net.postJSON('/h5/user/postList', { userID: self.userID, skip, take }, function(res) {
      if(res.success) {
        self.ref.hotPost.setData(res.data.data);
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
      <Page ref="page" total={ Math.ceil(self.userPost.Size / take) }/>
      <HotPost ref="hotPost" dataList={ self.userPost.data }/>
      {
        self.userPost.Size > take
          ? <Page ref="page2" total={ Math.ceil(self.userPost.Size / take) }/>
          : ''
      }
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
