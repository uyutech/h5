/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import List from './List.jsx';

let currentPriority = 0;
let cacheKey;
let ajax;

class MyRelation extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.tag = 0;
  }
  @bind tag
  init(tag) {
    let self = this;
    self.tag = tag;
    cacheKey = 'myRelation';
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/my/relationList', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
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
    let friend = self.ref.friend;
    let follow = self.ref.follow;
    let fans = self.ref.fans;
    let author = self.ref.author;

    friend.setData(data.friendList, priority);
    follow.setData(data.followUserList, priority);
    fans.setData(data.fansList, priority);
    author.setData(data.followAuthorList, priority);
  }
  clickTag(e, vd, tvd) {
    if(tvd.props.rel === this.tag) {
      return;
    }
    this.tag = tvd.props.rel;
  }
  render() {
    return <div class="relation">
      <ul class="tag"
          onClick={ { li: this.clickTag } }>
        <li class={ this.tag === 0 ? 'cur' : '' }
            rel={ 0 }>圈友</li>
        <li class={ this.tag === 1 ? 'cur' : '' }
            rel={ 1 }>我关注的</li>
        <li class={ this.tag === 2 ? 'cur' : '' }
            rel={ 2 }>关注我的</li>
        <li class={ this.tag === 3 ? 'cur' : '' }
            rel={ 3 }>关注作者</li>
      </ul>
      <List ref="friend"
            url={ '/h5/my/friendList' }
            message="正在加载..."
            @visible={ this.tag === 0}/>
      <List ref="follow"
            url={ '/h5/my/followUserList' }
            @visible={ this.tag === 1}/>
      <List ref="fans"
            url={ '/h5/my/fansList' }
            @visible={ this.tag === 2}/>
      <List ref="author"
            url={ '/h5/my/followAuthorList' }
            isAuthor={ true }
            @visible={ this.tag === 3}/>
    </div>;
  }
}

export default MyRelation;
