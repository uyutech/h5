/**
 * Created by army8735 on 2018/2/24.
 */

'use strict';

import util from '../common/util';
import net from "../common/net";

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    if(self.props.loginInfo) {
      let userInfo = self.props.loginInfo.userInfo;
      if(userInfo) {
        self.userInfo = userInfo;
      }
    }
  }
  @bind userId
  @bind nickname
  @bind headUrl
  @bind sex
  @bind sign
  @bind isFollow
  @bind followPersonCount
  @bind isFans
  @bind fansCount
  setData(data, followPersonCount, fansCount) {
    data = data || {};
    let self = this;console.log(data.sign);
    self.userId = data.id;
    self.headUrl = data.headUrl;
    self.nickname = data.nickname;
    self.sex = data.sex;
    self.sign = data.sign;
    self.followPersonCount = followPersonCount;
    self.fansCount = fansCount;
  }
  clickPic(e) {
    if(!util.isLogin()) {
      e.preventDefault();
    }
  }
  change(e, vd) {}
  clickName() {
    let self = this;
    jsBridge.prompt(self.nickname, function(res) {
      if(res.success) {
        let nickname = res.value;
        let length = nickname.length;
        if(length < 2 || length > 8) {
          jsBridge.toast('昵称长度需要在2~8个字之间哦~');
          return;
        }
        if(nickname !== self.nickname) {
          net.postJSON('/h5/my2/nickname', { value: nickname }, function(res) {
            if(res.success) {
              self.nickname = nickname;
              jsBridge.getPreference(self.props.cacheKey, function(info) {
                info.nickname = nickname;
                jsBridge.setPreference(self.props.cacheKey, info);
              });
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
        }
      }
    });
  }
  clickSign() {
    let self = this;
    jsBridge.prompt(self.sign, function(res) {
      if(res.success) {
        let sign = res.value;
        let length = sign.length;
        if(length > 45) {
          jsBridge.toast('签名长度不能超过45个字哦~');
          return;
        }
        if(sign !== self.sign) {
          net.postJSON('/h5/my2/sign', { value: sign }, function(res) {
            if(res.success) {
              self.sign = sign;
              jsBridge.getPreference(self.props.cacheKey, function(data) {
                if(data) {
                  data.info.sign = sign;
                  jsBridge.setPreference(self.props.cacheKey, data);
                }
              });
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
        }
      }
    });
  }
  clickPersonal() {
    jsBridge.pushWindow('/user.html?userID=' + this.userId, {
      transparentTitle: true,
    });
  }
  clickAuthor() {
    jsBridge.pushWindow('/author.html?authorId=' + this.userInfo.AuthorID, {
      transparentTitle: true,
    });
  }
  render() {
    return <div class="nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.headUrl || '/src/common/head.png')) }/>
          <input type="file"
                 onClick={ this.clickPic }
                 onChange={ this.change }/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.nickname }</h3>
            <b class={ 'edit' + (this.userId ? '' : ' fn-hide') } onClick={ this.clickName }/>
          </div>
          <p>uid: { (this.userId ? this.userId.toString() : '').replace(/^20180*/, '') }</p>
        </div>
        <button onClick={ this.clickPersonal }>个人主页</button>
        <button class={ 'author' + (this.isAuthor ? '' : ' fn-hide') }
                onClick={ this.clickAuthor }>作者主页</button>
      </div>
      <ul class="num">
        <li>关注<strong>{ this.followPersonCount || 0 }</strong></li>
        <li>粉丝<strong>{ this.fansCount || 0 }</strong></li>
      </ul>
      <div class="sign">
        <label>签名</label>
        <span>{ this.sign || '暂时还没有签名哦~' }</span>
        <b class={ 'edit' + (this.userId ? '' : ' fn-hide') } onClick={ this.clickSign }/>
      </div>
    </div>;
  }
}

export default Nav;
