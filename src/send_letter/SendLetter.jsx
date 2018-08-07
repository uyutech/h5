/**
 * Created by army8735 on 2018/8/7.
 */

'use strict';

const MAX_TEXT_LENGTH = 2048;

class SendLetter extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.value = '';
    self.invalid = true;
    self.num = 0;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu('发送');
      if(!jsBridge.isInApp) {
        document.querySelector('input.submit.fn-hide').classList.remove('fn-hide');
      }
      jsBridge.on('optionMenu', function() {
        if(self.value.trim().length < 3) {
          jsBridge.toast('字数不能少于3个字~');
          return;
        }
        self.submit();
      });
      jsBridge.on('back', function() {
        self.ref.input.element.blur();
      });
    });
  }
  @bind value
  @bind num
  @bind invalid
  @bind warnLength
  @bind sending
  init(id) {
    let self = this;
    self.id = id;
  }
  input(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    self.num = $vd.val().length;
    self.num = $vd.val().trim().length;
    let content = $vd.val().trim();
    let oldInvalid = self.invalid;
    self.invalid = content.length < 3 || content.length > MAX_TEXT_LENGTH;
    self.warnLength = content.length > MAX_TEXT_LENGTH;
    if(oldInvalid !== self.invalid) {
      if(self.invalid) {
        jsBridge.setOptionMenu({
          text: '发布',
          textColor: '#333333',
        });
      }
      else {
        jsBridge.setOptionMenu({
          text: '发布',
          textColor: '#8BBDE1',
        });
      }
    }
  }
  submit(e) {
    e && e.preventDefault();
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(!self.sending && !self.invalid) {
      self.sending = true;
      jsBridge.showLoading();
      $net.postJSON('/h5/letter/sub', {
        content: self.value,
        id: self.id,
      }, function(res) {
        jsBridge.hideLoading();
        if(res.success) {
          jsBridge.toast('发送私信成功');
          jsBridge.popWindow({
            sendLetter: true,
            data: res.data,
          });
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          self.sending = false;
        }
      }, function(res) {
        jsBridge.hideLoading();
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.sending = false;
      });
    }
  }
  render() {
    return <form class="mod-sub"
                 ref="form"
                 onSubmit={ this.submit }>
      <div class={ 'limit' + (this.warnLength ? ' warn' : '') }>
        <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
        <input type="submit"
               class="submit fn-hide"
               disabled={ this.invalid }/>
      </div>
      <div class="c">
        <textarea class="text"
                  ref="input"
                  placeholder="请输入内容"
                  onInput={ this.input }
                  maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
      </div>
    </form>;
  }
}

export default SendLetter;
