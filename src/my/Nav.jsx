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
  @bind head
  @bind userName
  @bind sex
  @bind sign
  @bind updateNickNameTimeDiff
  @bind updateHeadTimeDiff
  set userInfo(userInfo) {
    userInfo = userInfo || {};
    let self = this;
    self.userId = userInfo.UID;
    self.head = userInfo.Head_Url;
    self.userName = userInfo.NickName;
    self.sex = userInfo.Sex;
    self.sign = userInfo.User_Sign;
  }
  clickPic() {
    let self = this;
    if(self.updateHeadTimeDiff < 24 * 60 * 60 * 1000) {
      jsBridge.toast('头像一天只能修改一次哦~');
      return;
    }
    jsBridge.album(function(res) {
      if(res.success) {
        let img = Array.isArray(res.base64) ? res.base64[0] : res.base64;
        net.postJSON('/h5/my/uploadHead', { img }, function(res) {
          if(res.success) {
            self.head = res.url;
            self.updateHeadTimeDiff = 0;
            jsBridge.getPreference('loginInfo', function(loginInfo) {
              loginInfo.userInfo.Head_Url = res.url;
              jsBridge.setPreference('loginInfo', loginInfo);
            });
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        });
      }
    });
  }
  clickName() {
    let self = this;
    if(self.updateNickNameTimeDiff < 24 * 60 * 60 * 1000) {
      jsBridge.toast('昵称一天只能修改一次哦~');
      return;
    }
    jsBridge.prompt(self.userName, function(res) {
      if(res.success) {
        let newName = res.value;
        let length = newName.length;
        if(length < 4 || length > 8) {
          jsBridge.toast('昵称长度需要在4~8个字之间哦~');
          return;
        }
        if(newName !== self.userName) {
          net.postJSON('/h5/my/updateNickName', { nickName: newName }, function(res) {
            if(res.success) {
              self.userName = newName;
              self.updateNickNameTimeDiff = 0;
              jsBridge.getPreference('loginInfo', function(loginInfo) {
                loginInfo.userInfo.NickName = newName;
                jsBridge.setPreference('loginInfo', loginInfo);
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
        let newSign = res.value;
        let length = newSign.length;
        if(length > 16) {
          jsBridge.toast('签名长度不能超过16个字哦~');
          return;
        }
        if(newSign !== self.sign) {
          net.postJSON('/h5/my/updateSign', { sign: newSign }, function(res) {
            if(res.success) {
              self.sign = newSign;
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
  render() {
    return <div class="nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img288_288_80(this.head || '/src/common/head.png')) }
               onClick={ this.clickPic }/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.userName }</h3>
            <b class={ 'sex' + this.sex }/>
            <b class={ 'edit' + (this.userId ? '' : ' fn-hide') } onClick={ this.clickName }/>
          </div>
        </div>
      </div>
      <div class="sign">
        <label>签名</label>
        <span>{ this.sign || "“”" }</span>
        <b class={ 'edit' + (this.userId ? '' : ' fn-hide') } onClick={ this.clickSign }/>
      </div>
    </div>;
  }
}

export default Nav;
