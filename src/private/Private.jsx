/**
 * Created by army8735 on 2017/12/11.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class Private extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      net.postJSON('/h5/my/private', function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  @bind realName
  @bind phone
  @bind address
  setData(data) {
    let self = this;

    self.realName = data.Name;
    self.phone = data.Phone;
    self.address = data.Address;
    self.hasData = true;
  }
  click3() {
    let self = this;
    jsBridge.prompt({
      message: '请输入姓名',
      value: self.realName,
    }, function(res) {
      if(res.success) {
        let realName = res.value;
        if(realName !== self.realName) {
          net.postJSON('/h5/my/updatePrivate', { realName, phone: self.phone, address: self.address }, function(res) {
            if(res.success) {
              self.realName = realName;
              $(self.ref.realName.element).text(realName);
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
  click4() {
    let self = this;
    jsBridge.prompt({
      message: '请输入手机',
      value: self.phone,
    }, function(res) {
      if(res.success) {
        let phone = res.value;
        if(phone && !/^1\d{10}$/.test(phone) && !/^09\d{8}$/.test(phone)) {
          jsBridge.toast('手机号码不合法~');
          return;
        }
        if(phone !== self.phone) {
          net.postJSON('/h5/my/updatePrivate', { realName: self.realName, phone, address: self.address }, function(res) {
            if(res.success) {
              self.phone = phone;
              $(self.ref.phone.element).text(phone);
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
  click5() {
    let self = this;
    jsBridge.prompt({
      message: '请输入收货地址',
      value: self.address,
    }, function(res) {
      if(res.success) {
        let address = res.value;
        if(address !== self.address) {
          net.postJSON('/h5/my/updatePrivate', { realName: self.realName, phone: self.phone, address }, function(res) {
            if(res.success) {
              self.address = address;
              $(self.ref.address.element).text(address);
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
  genDom() {
    let self = this;
    return <div>
      <label>收件人：</label>
      <span ref="realName">{ self.realName }</span>
      <b class="edit" ref="edit3" onClick={ self.click3.bind(self) }/>
      <br/>
      <label>联系手机：</label>
      <span ref="phone">{ self.phone }</span>
      <b class="edit" ref="edit4" onClick={ self.click4.bind(self) }/>
      <br/>
      <label>收货地址：</label>
      <span ref="address">{ self.address }</span>
      <b class="edit" ref="edit5" onClick={ self.click5.bind(self) }/>
    </div>;
  }
  render() {
    return <div class="private">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Private;
