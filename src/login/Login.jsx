/**
 * Created by army8735 on 2017/8/3.
 */

let timeout;
let sendDelay = 0;

class Login extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      let $ul = $li.parent();
      $ul.find('.cur').removeClass('cur');
      $li.addClass('cur');
      let rel = tvd.props.rel;
      if(rel == 0) {
        $(this.ref.reg.element).addClass('fn-hide');
        $(this.ref.lgn.element).removeClass('fn-hide');
      }
      else {
        $(this.ref.lgn.element).addClass('fn-hide');
        $(this.ref.reg.element).removeClass('fn-hide');
      }
      this.emit('change', rel);
    }
  }
  clear(e, vd) {
    let $vd = $(vd.element);
    if(!$vd.hasClass('fn-hidden')) {
      let $input = $vd.parent().find('input');
      $input.val('');
    }
  }
  eye(e, vd) {
    let $eye = $(vd.element);
    let $input = $eye.parent().find('input');
    if($eye.hasClass('alt')) {
      $input.attr('type', 'password');
    }
    else {
      $input.attr('type', 'text');
    }
    $eye.toggleClass('alt');
  }
  keyDown(e) {
    let keyCode = e.keyCode;
    if(keyCode == 8 || keyCode == 9 || keyCode == 46 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105) {
      // console.log('in');
    }
    else {
      // console.log('out');
      e.preventDefault();
    }
  }
  inputName(e, vd) {
    let $input = $(vd.element);
    let s = $input.val();
    if(s.length > 11) {
      $input.val(s.slice(0, 11));
    }
    let $clear = $input.parent().find('.clear');
    if(s.length) {
      $clear.removeClass('fn-hidden');
    }
    else {
      $clear.addClass('fn-hidden');
    }
    if(vd.props.ref == 'name') {
      this.checkLoginButton();
    }
    else {
      this.checkRegisterButton();
    }
  }
  inputPass(e, vd) {
    let $input = $(vd.element);
    let s = $input.val();
    let $clear = $input.parent().find('.clear');
    if(s.length) {
      $clear.removeClass('fn-hidden');
    }
    else {
      $clear.addClass('fn-hidden');
    }
    if(vd.props.ref == 'pass') {
      this.checkLoginButton();
    }
    else {
      this.checkRegisterButton();
    }
  }
  inputValid(e, vd) {
    let $input = $(vd.element);
    let s = $input.val();
    if(s.length > 6) {
      $input.val(s.slice(0, 6));
    }
    this.checkRegisterButton();
  }
  checkLoginButton() {
    let self = this;
    self.clearDelayShow();
    let userNameText = $(self.ref.name.element).val();
    let userPassText = $(self.ref.pass.element).val();
    let valid = true;
    // 空则提示需要用户名
    if(userNameText == '') {
      timeout = setTimeout(function() {
        self.emit('tip', false, '请输入<span>用户名</span>');
      }, 500);
      valid = false;
    }
    else if(!/^1[356789]\d{9}$/.test(userNameText)) {
      timeout = setTimeout(function() {
        self.emit('tip', false, '<span>用户名</span>格式不正确哟');
      }, 500);
      valid = false;
    }
    // 用户名如果正确合法，则判断密码输入状态
    if(valid) {
      // 空则提示需要密码
      if(userPassText == '') {
        timeout = setTimeout(function() {
          self.emit('tip', false, '请输入<span>密码</span>');
        }, 500);
        valid = false;
      }
      else if(userPassText.length < 8) {
        timeout = setTimeout(function() {
          self.emit('tip', false, '密码至少<span>8</span>位哟');
        }, 500);
        valid = false;
      }
    }
    // 设置按钮禁用状态
    let $loginButton = $(this.ref.loginButton.element);
    if(valid) {
      $loginButton.removeClass('dis');
      self.emit('tip', true);
    }
    else {
      $loginButton.addClass('dis');
    }
  }
  checkRegisterButton() {
    let self = this;
    self.clearDelayShow();
    let userNameText = $(self.ref.name2.element).val();
    let userPassText = $(self.ref.pass2.element).val();
    let valid = true;
    // 空则提示需要用户名
    if(userNameText == '') {
      timeout = setTimeout(function() {
        self.emit('tip', false, '请输入<span>用户名</span>');
      }, 500);
      valid = false;
    }
    else if(!/^1[356789]\d{9}$/.test(userNameText)) {
      timeout = setTimeout(function() {
        self.emit('tip', false, '<span>用户名</span>格式不正确哟');
      }, 500);
      valid = false;
    }
    // 用户名如果正确合法，则判断密码输入状态
    if(valid) {
      // 空则提示需要密码
      if(userPassText == '') {
        timeout = setTimeout(function() {
          self.emit('tip', false, '请输入<span>密码</span>');
        }, 500);
        valid = false;
      }
      else if(userPassText.length < 8) {
        timeout = setTimeout(function() {
          self.emit('tip', false, '密码至少<span>8</span>位哟');
        }, 500);
        valid = false;
      }
    }
    // 密码也正确，放开发送验证码按钮
    let $sendValid = $(this.ref.sendValid.element);
    if(valid) {
      // 可能上次发送没结束，判断是否倒计时到0秒
      if(sendDelay == 0) {
        $sendValid.removeClass('dis');
      }
      else {
        $sendValid.addClass('dis');
      }
    }
    else {
      $sendValid.addClass('dis');
    }
    // 判断输入验证码里的内容
    let $valid = $(this.ref.valid.element);
    if(valid) {
      // 是否可用
      if($valid.hasClass('dis')) {
        timeout = setTimeout(function() {
          self.emit('tip', false, '请先发送<span>验证码</span>');
        }, 500);
        valid = false;
      }
      else {
        let userValidText = $(self.ref.valid.element).val();
        if(userValidText == '') {
          timeout = setTimeout(function() {
            self.emit('tip', false, '请输入<span>验证码</span>');
          }, 500);
          valid = false;
        }
        else if(userValidText.length != 6) {
          timeout = setTimeout(function() {
            self.emit('tip', false, '验证码是<span>6</span>位哟');
          }, 500);
          valid = false;
        }
      }
    }
    // 设置按钮禁用状态
    let $registerButton = $(this.ref.registerButton.element);
    if(valid) {
      $registerButton.removeClass('dis');
      self.emit('tip', true);
    }
    else {
      $registerButton.addClass('dis');
    }
  }
  clearDelayShow() {
    if(timeout) {
      clearTimeout(timeout);
    }
  }
  clickLogin(e, vd) {
    let $button = $(vd.element);
    if(!$button.hasClass('dis')) {
      let User_Phone = $(this.ref.name.element).val();
      let User_Pwd = $(this.ref.pass.element).val();
      util.postJSON('api/Users/Login', { User_Phone, User_Pwd }, function(res) {
        if(res.success) {
          let sessionid = res.data.sessionid;
          jsBridge.setPreference('sessionid', sessionid);
        }
        else {
          jsBridge.toast(res.message || '人气大爆发，请稍后再试。');
        }
      }, function() {
        jsBridge.toast('人气大爆发，请稍后再试。');
      });
    }
  }
  clickSend(e, vd) {
    let $sendValid = $(vd.element);
    $sendValid.addClass('dis');
    let $validGroup = $(this.ref.validGroup.element);
    $validGroup.removeClass('dis');
    let $valid = $(this.ref.valid.element);
    $valid.removeAttr('readOnly');
    $valid.removeClass('dis');
    sendDelay = 60;
    $sendValid.text(sendDelay + '秒后刷新');
    this.checkRegisterButton();
    let self = this;
    let interval = setInterval(function() {
      sendDelay--;
      if(sendDelay == 0) {
        $sendValid.text('重新发送');
        $sendValid.removeClass('dis');
        clearInterval(interval);
        self.checkRegisterButton();
      }
      else {
        $sendValid.text(sendDelay + '秒后刷新');
      }
    }, 1000);
    let User_Phone = $(this.ref.name2.element).val();
    util.postJSON('api/Users/SendCode', { User_Phone, SendSource: 'Regist' }, function(res) {
      if(res.success) {
        jsBridge.toast('发送成功');
      }
      else {
        jsBridge.toast(res.message || '人气大爆发，请稍后再试。');
      }
    }, function() {
      jsBridge.toast('人气大爆发，请稍后再试。');
    });
  }
  clickRegister(e, vd) {
    let $button = $(vd.element);
    if(!$button.hasClass('dis')) {
      jsBridge.showLoading();
      let User_Phone = $(this.ref.name2.element).val();
      let User_Pwd = $(this.ref.pass2.element).val();
      let YZMCode = $(this.ref.valid.element).val();
      util.postJSON('api/Users/Regist', { User_Phone, User_Pwd, YZMCode }, function(res, state, xhr) {
        jsBridge.hideLoading();
        if(res.success) {
          console.log(213);
        }
        else {
          jsBridge.toast(res.message || '人气大爆发，请稍后再试。');
        }
      }, function() {
        jsBridge.hideLoading();
        jsBridge.toast('人气大爆发，请稍后再试。');
      });
    }
  }
  clickForget(e) {
    e.preventDefault();
  }
  render() {
    return <div class="login_forget">
      <div ref="login_panel">
        <ul class="tab" onClick={ { li: this.click } }>
          <li class="cur" rel="0">登录</li>
          <li rel="1">注册</li>
        </ul>
        <div class="lgn fn-hide1" ref="lgn">
          <div class="line phone">
            <b class="icon"></b>
            <input type="number" ref="name" maxlength="11" placeholder="请输入手机号" onKeyDown={ this.keyDown } onInput={ this.inputName } value="15921858411"/>
            <b class="clear fn-hidden" onClick={ this.clear }></b>
          </div>
          <div class="line pass">
            <b class="icon"></b>
            <input type="password" ref="pass" maxlength="16" placeholder="请输入密码" onInput={ this.inputPass } value="1111111"/>
            <b class="clear fn-hidden" onClick={ this.clear }></b>
            <b class="eye" onClick={ this.eye }></b>
          </div>
          <div class="forget">
            <a href="#" onClick={ this.clickForget }>忘记密码</a>
          </div>
          <button class="ok dis" ref="loginButton" onClick={ this.clickLogin }>登录</button>
        </div>
        <div class="reg fn-hide" ref="reg">
          <div class="line phone">
            <b class="icon"></b>
            <input type="number" ref="name2" maxlength="11" placeholder="请输入手机号" onKeyDown={ this.keyDown } onInput={ this.inputName }/>
            <b class="clear fn-hidden" onClick={ this.clear }></b>
          </div>
          <div class="line pass">
            <b class="icon"></b>
            <input type="password" ref="pass2" maxlength="16" placeholder="请输入密码" onInput={ this.inputPass }/>
            <b class="clear fn-hidden" onClick={ this.clear }></b>
            <b class="eye" onClick={ this.eye }></b>
          </div>
          <div class="line2">
            <div class="valid dis" ref="validGroup">
              <b class="icon"></b>
              <input type="number" class="dis" ref="valid" maxlength="6" placeholder="请输入验证码" readOnly="readOnly" onInput={ this.inputValid }/>
            </div>
            <button class="send dis" ref="sendValid" onClick={ this.clickSend }>发送验证码</button>
          </div>
          <button class="ok dis" ref="registerButton" onClick={ this.clickRegister }>注册</button>
        </div>
      </div>
      <div class="forget_panel fn-hide"></div>
    </div>;
  }
}

export default Login;
