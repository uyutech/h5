/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let bindUuid;
let bindName;
let openId;

class Config extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getCache('loginInfo', function(loginInfo) {
        if(loginInfo) {
          let oauthInfo = loginInfo.oauthInfo;
          (oauthInfo || []).forEach(function(item) {
            switch(item.OpenType) {
              case 'telphone':
                self.phone = item.OpenID;
                break;
              case 'weibo':
                self.weibo = item.OpenID;
                break;
            }
          });
        }
      });
    });
  }
  @bind phone
  @bind weibo
  @bind message
  @bind confirm
  bindPhone() {
    let self = this;
    bindName = '手机';
    jsBridge.pushWindow('/phone.html', {
      title: '绑定手机',
    });
    jsBridge.on('resume', function cb(e) {
      let data = e.data;
      if(data && data.phone) {
        self.phone = data.phone;
      }
      jsBridge.off('resume', cb);
    });
  }
  bindWeibo() {
    let self = this;
    bindName = '微博';
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在登录...');
        let openID = res.openID;
        let token = res.token;
        net.postJSON('/h5/passport/bindOauth', { openID, token }, function(res) {
          if(res.success) {
            self.weibo = openID;
          }
          else if(res.code === 1008) {
            bindUuid = res.data;
            openId = openID;
            self.message = res.message;
            self.confirm = true;
          }
          else if(res.code === 1007) {
            bindUuid = res.data;
            jsBridge.confirm(res.message + '\n该操作将解除该' + bindName + '与其关联账号的绑定哦~', function(res) {
              if(!res) {
                return;
              }
              net.postJSON('/h5/passport/mergeOauth', {
                code: bindUuid,
                type: 2,
              }, function(res) {
                if(res.success) {
                  jsBridge.toast('绑定成功');
                  self.weibo = openID;
                }
                else {
                  jsBridge.toast(res.message);
                }
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              });
            });
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          jsBridge.hideLoading();
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          jsBridge.hideLoading();
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
  }
  clickMerge() {
    let self = this;
    jsBridge.confirm('合并后，会保留此账号之前的作品、发言、圈币和收藏数据~之后再以此账号登录时会直接进入当前账号哦！确定进行合并吗？', function(res) {
      if(!res) {
        return;
      }
      jsBridge.showLoading();
      net.postJSON('/h5/passport/mergeOauth', {
        code: bindUuid,
        type: 1,
      }, function(res) {
        if(res.success) {
          jsBridge.toast('绑定成功');
          self.confirm = false;
          self.weibo = openId;
        }
        else {
          jsBridge.toast(res.message);
        }
        jsBridge.hideLoading();
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        jsBridge.hideLoading();
      });
    });
  }
  clickBind() {
    let self = this;
    jsBridge.confirm('该操作将注销之前的账号哦~', function(res) {
      if(!res) {
        return;
      }
      jsBridge.showLoading();
      net.postJSON('/h5/passport/mergeOauth', {
        code: bindUuid,
        type: 2,
      }, function(res) {
        if(res.success) {
          jsBridge.toast('绑定成功');
          self.confirm = false;
          self.weibo = openId;
        }
        else {
          jsBridge.toast(res.message);
        }
        jsBridge.hideLoading();
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        jsBridge.hideLoading();
      });
    });
  }
  clickCancel() {
    this.confirm = false;
  }
  clickPhone(e) {
    e.preventDefault();
    if(this.phone) {}
    else {
      this.bindPhone();
    }
  }
  clickWeibo(e) {
    e.preventDefault();
    if(this.weibo) {}
    else {
      this.bindWeibo();
    }
  }
  clickLink(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href, {
      title: '屏蔽设置',
    });
  }
  clickOut() {
    let self = this;
    net.postJSON('/h5/login/loginOut', function() {
      $.cookie('isLogin', null);
      $.cookie('uid', null);
      jsBridge.delPreference('loginInfo');
      jsBridge.loginOut();
      jsBridge.popWindow({
        loginOut: true,
      });
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="config">
      <div class="c">
        <ul class="list">
          <li><a href="#"
                 onClick={ this.clickPhone }
                 class={ 'phone' + (this.phone ? ' has' : '') }>{ this.phone ? ('已绑手机：' + this.phone) : '绑定手机' }</a></li>
          <li><a href="#"
                 onClick={ this.clickWeibo }
                 class={ 'weibo' + (this.weibo ? ' has' : '') }>{ this.weibo ? ('已绑微博：' + this.weibo) : '绑定微博' }</a></li>
        </ul>
        <ul class="list"
            onClick={ { a: this.clickLink } }>
          <li><a href="/shield.html" class="shield">屏蔽设置</a></li>
        </ul>
      </div>
      <div class="bot">
        <span class="out" onClick={ this.clickOut }>退出登录</span>
      </div>
      <div class={ 'confirm' + (this.confirm ? '' : ' fn-hide') }>
        <div class="c">
          <p>{ this.message }</p>
          <strong>请问这是您之前的账号吗？</strong>
          <button onClick={ this.clickMerge }>是的，我想要合并两个账号</button>
          <button onClick={ this.clickBind }>不是的，我只要绑定就可以了</button>
          <button onClick={ this.clickCancel }>算了，还是维持现状吧</button>
        </div>
      </div>
    </div>;
  }
}

export default Config;
