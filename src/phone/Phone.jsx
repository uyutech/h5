/**
 * Created by army8735 on 2017/12/31.
 */

'use strict';

let interval;

class Phone extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.phone = '';
    self.password = '';
    self.code = '';
    self.count = 0;
  }
  @bind phone
  @bind password
  @bind visible
  @bind code
  @bind count
  @bind loading
  // @bind message
  // @bind confirm
  isPhoneValid() {
    return /^1\d{10}$/.test(this.phone);
  }
  isPasswordValid() {
    return this.password.length >= 6;
  }
  isCodeValid() {
    return /^\d{6}$/.test(this.code);
  }
  clickCode() {
    let self = this;
    if(self.count) {
      return;
    }
    if(!self.phone) {
      jsBridge.toast('请填写手机号~');
      return;
    }
    if(!self.isPhoneValid()) {
      jsBridge.toast('手机号不符合要求~');
      return;
    }
    self.count = 60;
    interval = setInterval(function() {
      if(--self.count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    $net.postJSON('/h5/passport/bindCode', { phone: self.phone }, function(res) {
      if(res.success) {
        jsBridge.toast('验证码已发送，10分钟内有效~');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  clickOk() {
    let self = this;
    if(self.loading) {
      return;
    }
    if(!self.phone) {
      jsBridge.toast('请填写手机号~');
      return;
    }
    if(!self.isPhoneValid()) {
      jsBridge.toast('手机号不符合要求~');
      return;
    }
    if(!self.password) {
      jsBridge.toast('请填写密码~');
      return;
    }
    if(!self.isPasswordValid()) {
      jsBridge.toast('密码长度不符合要求~');
      return;
    }
    if(!self.code) {
      jsBridge.toast('请填写验证码~');
      return;
    }
    if(!self.isCodeValid()) {
      jsBridge.toast('验证码不符合要求~');
      return;
    }
    self.loading = true;
    let phone = self.phone;
    let password = self.password;
    $net.postJSON('/h5/passport/bindPhone', {
      phone,
      pw: password,
      code: self.code,
    }, function(res) {
      if(res.success) {
        jsBridge.toast('绑定成功');
        jsBridge.popWindow({
          bindPhone: phone,
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.loading = false;
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  // clickMerge() {
  //   let self = this;
  //   let phone = self.phone;
  //   let password = self.password;
  //   jsBridge.confirm('合并后，会保留此账号之前的作品、发言、圈币和收藏数据~之后再以此账号登录时会直接进入当前账号哦！确定进行合并吗？', function(res) {
  //     if(!res) {
  //       return;
  //     }
  //     if(self.loading) {
  //       return;
  //     }
  //     self.loading = true;
  //     $net.postJSON('/h5/passport/merge', {
  //       phone,
  //       password,
  //       type: 1,
  //     }, function(res) {
  //       if(res.success) {
  //         jsBridge.toast('绑定成功');
  //         jsBridge.popWindow({
  //           phone,
  //         });
  //       }
  //       else {
  //         jsBridge.toast(res.message);
  //       }
  //       self.loading = false;
  //     }, function(res) {
  //       jsBridge.toast(res.message || $util.ERROR_MESSAGE);
  //       self.loading = false;
  //     });
  //   });
  // }
  // clickBind() {
  //   let self = this;
  //   let phone = self.phone;
  //   let password = self.password;
  //   jsBridge.confirm('该操作将注销之前的账号哦~', function(res) {
  //     if(!res) {
  //       return;
  //     }
  //     if(self.loading) {
  //       return;
  //     }
  //     self.loading = true;
  //     $net.postJSON('/h5/passport/merge', {
  //       phone,
  //       password,
  //       type: 2,
  //     }, function(res) {
  //       if(res.success) {
  //         jsBridge.toast('绑定成功');
  //         jsBridge.popWindow({
  //           phone,
  //         });
  //       }
  //       else {
  //         jsBridge.toast(res.message);
  //       }
  //       self.loading = false;
  //     }, function(res) {
  //       jsBridge.toast(res.message || $util.ERROR_MESSAGE);
  //       self.loading = false;
  //     });
  //   });
  // }
  // clickCancel() {
  //   this.confirm = false;
  // }
  render() {
    return <div class="phone">
      <div class="c">
        <h5>绑定信息</h5>
        <div class="line">
          <input type="tel" class="phone" placeholder="请输入手机号" maxlength="11" value={ this.phone }/>
          <b class={ 'clear' + (this.phone ? '' : ' fn-hide') } onClick={ function() { this.phone = ''; } }/>
        </div>
        <div class="line">
          <input type={ this.visible ? 'text' : 'password' } class="password" placeholder="请输入密码（至少6位）" maxlength="16" value={ this.password }/>
          <b class={ 'clear' + (this.password ? '' : ' fn-hide') } onClick={ function() { this.password = ''; } }/>
          <b class={ 'visible' + (this.visible ? '' : ' invisible') } onClick={ function() { this.visible = !this.visible; } }/>
        </div>
        <div class="line2">
          <input type="tel" class="code" placeholder="请输入验证码" maxlength="6" value={ this.code }/>
          <button class={ this.count ? 'dis' : '' } onClick={ this.clickCode }>{ this.count ? ('还剩' + this.count + '秒') : '发送验证码' }</button>
        </div>
        <button class={ this.loading ? 'dis' : '' } onClick={ this.clickOk }>确定</button>
      </div>
      {/*<div class={ 'confirm' + (this.confirm ? '' : ' fn-hide') }>*/}
        {/*<div class="c">*/}
          {/*<p>{ this.message }</p>*/}
          {/*<strong>请问这是您之前的账号吗？</strong>*/}
          {/*<button onClick={ this.clickMerge }>是的，我想要合并两个账号</button>*/}
          {/*<button onClick={ this.clickBind }>不是的，我只要绑定手机就可以了</button>*/}
          {/*<button onClick={ this.clickCancel }>算了，还是维持现状吧</button>*/}
        {/*</div>*/}
      {/*</div>*/}
    </div>;
  }
}

export default Phone;
