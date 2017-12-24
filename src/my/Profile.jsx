/**
 * Created by army8735 on 2017/10/30.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    if(self.props.userInfo) {
      self.head = self.props.userInfo.Head_Url;
      self.userId = self.props.userInfo.UID;
      self.sname = self.props.userInfo.NickName;
      self.sign = self.props.userInfo.User_Sign;
    }
  }
  @bind head
  @bind userId
  @bind sname
  @bind sign
  @bind updateNickNameTimeDiff
  @bind updateHeadTimeDiff
  click() {
    let self = this;
    if(self.updateNickNameTimeDiff < 24 * 60 * 60 * 1000) {
      jsBridge.toast('昵称一天只能修改一次哦~');
      return;
    }
    jsBridge.prompt(self.sname, function(res) {
      if(res.success) {
        let newName = res.value;
        let length = newName.length;
        if(length < 4 || length > 8) {
          jsBridge.toast('昵称长度需要在4~8个字之间哦~');
          return;
        }
        if(newName !== self.sname) {
          net.postJSON('/h5/my/updateNickName', { nickName: newName }, function(res) {
            if(res.success) {
              self.sname = newName;
              self.updateNickNameTimeDiff = 0;
              jsBridge.getPreference('loginInfo', function(loginInfo) {
                loginInfo.userInfo.NickName = newName;
                jsBridge.setPreference('loginInfo', JSON.stringify(loginInfo));
                migi.eventBus.emit('USER_INFO', loginInfo.userInfo);
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
  clickPic() {
    let self = this;
    if(self.updateHeadTimeDiff < 24 * 60 * 60 * 1000) {
      jsBridge.toast('头像一天只能修改一次哦~');
      return;
    }
    jsBridge.album(function(res) {
      if(res.success) {
        let img = Array.isArray(res.base64) ? res.base64[0] : res.base64;
        self.head = img;
        net.postJSON('/h5/my/uploadHead', { img }, function(res) {
          if(res.success) {
            self.head = res.url;
            self.updateHeadTimeDiff = 0;
            jsBridge.getPreference('loginInfo', function(loginInfo) {
              loginInfo.userInfo.Head_Url = res.url;
              jsBridge.setPreference('loginInfo', JSON.stringify(loginInfo));
              migi.eventBus.emit('USER_INFO', loginInfo.userInfo);
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
  click2() {
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
              self.sign = newSign;return;
              jsBridge.getPreference('loginInfo', function(loginInfo) {
                loginInfo.userInfo.User_Sign = newSign;
                jsBridge.setPreference('loginInfo', JSON.stringify(loginInfo));
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
  clickPri(e, vd) {
    e.preventDefault();
    jsBridge.pushWindow('/private.html', {
      title: '收货信息'
    });
  }
  render() {
    return <div class="profile">
      <h4>我的资料</h4>
      <div class="c">
        <div class="pic" onClick={ this.clickPic }>
          <img src={ util.autoSsl(util.img200_200_80(this.head)) || '/src/common/head.png' }/>
        </div>
        <div class="txt">
          <label>uid：</label>
          <span>{ this.userId }</span>
          <br/>
          <label>昵称：</label>
          <strong ref="sname">{ this.sname }</strong>
          <b class="edit" ref="edit" onClick={ this.click }/>
          <br/>
          <label>签名：</label>
          <p ref="sign" class={ this.sign ? 'sign' : 'sign empty' }>{ this.sign || '暂无签名' }</p>
          <b class="edit edit2" ref="edit2" onClick={ this.click2 }/>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
