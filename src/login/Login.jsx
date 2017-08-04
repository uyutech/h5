/**
 * Created by army8735 on 2017/8/3.
 */

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
  }
  inputValid(e, vd) {
    let $input = $(vd.element);
    let s = $input.val();
    if(s.length > 6) {
      $input.val(s.slice(0, 6));
    }
  }
  render() {
    return <div class="login_panel">
      <ul class="tab" onClick={ { li: this.click } }>
        <li class="cur" rel="0">登录</li>
        <li rel="1">注册</li>
      </ul>
      <div class="lgn" ref="lgn">
        <div class="line phone">
          <b class="icon"></b>
          <input type="number" maxlength="11" placeholder="请输入手机号" onInput={ this.inputName }/>
          <b class="clear fn-hidden" onClick={ this.clear }></b>
        </div>
        <div class="line pass">
          <b class="icon"></b>
          <input type="password" maxlength="16" placeholder="请输入密码" onInput={ this.inputPass }/>
          <b class="clear fn-hidden" onClick={ this.clear }></b>
          <b class="eye" onClick={ this.eye }></b>
        </div>
        <div class="forget">
          <a href="#">忘记密码</a>
        </div>
        <button class="ok dis">登录</button>
      </div>
      <div class="reg fn-hide" ref="reg">
        <div class="line phone">
          <b class="icon"></b>
          <input type="number" maxlength="11" placeholder="请输入手机号" onInput={ this.inputName }/>
          <b class="clear fn-hidden" onClick={ this.clear }></b>
        </div>
        <div class="line pass">
          <b class="icon"></b>
          <input type="password" maxlength="16" placeholder="请输入密码"/>
          <b class="clear fn-hidden" onClick={ this.clear }></b>
          <b class="eye" onClick={ this.eye }></b>
        </div>
        <div class="line2">
          <div class="valid">
            <b class="icon"></b>
            <input type="number" maxlength="6" placeholder="请输入验证码" onInput={ this.inputValid }/>
          </div>
          <button class="send dis">发送验证码</button>
        </div>
        <button class="ok dis">注册</button>
      </div>
    </div>;
  }
}

export default Login;
