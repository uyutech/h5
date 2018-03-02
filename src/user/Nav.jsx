/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import util from '../common/util';
import net from '../common/net';

const FOLLOW_STATE = {
  1: '已关注',
  2: '未关注',
  3: '互相关注',
};
let loading;

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind userId
  @bind head
  @bind userName
  @bind sex
  @bind followNum
  @bind fansNumber
  @bind sign
  @bind followState
  set userInfo(userInfo) {
    userInfo = userInfo || {};
    let self = this;
    self.userId = userInfo.UID;
    self.head = userInfo.Head_Url;
    self.userName = userInfo.NickName;
    self.sex = userInfo.Sex;
    self.followNum = userInfo.FollowNumber;
    self.fansNum = userInfo.FansNumber;
    self.sign = userInfo.User_Sign;
  }
  clickFollow() {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loading) {
      return;
    }
    if(self.followState === 2) {
      loading = true;
      net.postJSON('/h5/user/follow', { userID: self.userId }, function(res) {
        if(res.success) {
          self.followState = res.data.FollowState;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
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
    else if(self.followState) {
      jsBridge.confirm('取消关注吗？', function(res) {
        if(res) {
          loading = true;
          net.postJSON('/h5/user/unFollow', { userID: self.userId }, function(res) {
            if(res.success) {
              self.followState = res.data.FollowState ;
            }
            else if(res.code === 1000) {
              migi.eventBus.emit('NEED_LOGIN');
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
      });
    }
  }
  render() {
    return <div class="nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.head || '/src/common/head.png')) }
               onClick={ this.clickPic }/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.userName }</h3>
          </div>
        </div>
        <button class={ 's' + this.followState }
                onClick={ this.clickFollow }>{ FOLLOW_STATE[this.followState] }</button>
      </div>
      <ul class="num">
        <li>关注<strong>{ this.followNum || 0 }</strong></li>
        <li>粉丝<strong>{ this.fansNum || 0 }</strong></li>
      </ul>
      <div class="sign">
        <label>签名</label>
        <span>{ this.sign || '""' }</span>
      </div>
    </div>;
  }
}

export default Nav;
