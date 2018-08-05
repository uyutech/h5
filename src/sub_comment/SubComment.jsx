/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

const MAX_TEXT_LENGTH = 2048;

class sub_comment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.value = '';
    self.invalid = true;
    self.num = 0;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu('发布');
      if(!jsBridge.isInApp) {
        document.querySelector('input.submit.fn-hide').classList.remove('fn-hide');
      }
      jsBridge.getPreference('my', function(my) {
        if(my) {
          self.myInfo = my;
          self.isAuthor = my.author && my.author.length;
          if(self.isAuthor) {
            if(my.author[0].settle === 1) {
              self.headUrl = my.user.headUrl;
              self.name = my.user.name;
              self.useAuthor = false;
              self.isAuthor = false;
              return;
            }
            jsBridge.getPreference('useAuthor', function(useAuthor) {
              self.useAuthor = useAuthor;
              if(useAuthor) {
                self.headUrl = my.author[0].headUrl;
                self.name = my.author[0].name;
              }
              else {
                self.headUrl = my.user.headUrl;
                self.name = my.user.nickname;
              }
            });
          }
        }
      });
      jsBridge.getPreference(self.getContentKey(), function(cache) {
        if(cache) {
          self.value = cache.trim();
          self.input(null, self.ref.input);
          let length = self.value.trim().length;
          self.invalid = length < 3 || length > MAX_TEXT_LENGTH;
        }
      });
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
  @bind name
  @bind headUrl
  @bind isAuthor
  @bind useAuthor
  init(data) {
    let self = this;
    self.id = data.id;
    self.type = data.type;
    self.pid = data.pid;
  }
  clickAlt() {
    let self = this;
    if(self.myInfo) {
      self.useAuthor = !self.useAuthor;
      if(self.useAuthor) {
        self.headUrl = self.myInfo.author[0].headUrl;
        self.name = self.myInfo.author[0].name;
      }
      else {
        self.headUrl = self.myInfo.user.headUrl;
        self.name = self.myInfo.user.nickname;
      }
      jsBridge.setPreference('useAuthor', self.useAuthor);
    }
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
    jsBridge.setPreference(self.getContentKey(), content);
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
      let authorId;
      if(self.useAuthor && self.myInfo && self.myInfo.author && self.myInfo.author.length) {
        authorId = self.myInfo.author[0].id;
      }
      $net.postJSON('/h5/comment/sub', {
        content: self.value,
        id: self.id,
        type: self.type,
        pid: self.pid,
        authorId,
      }, function(res) {
        jsBridge.hideLoading();
        if(res.success) {
          jsBridge.setPreference(self.getContentKey(), null);
          jsBridge.popWindow({ type: 'subComment', data: res.data });
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
        self.sending = false;
      }, function(res) {
        jsBridge.hideLoading();
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.sending = false;
      });
    }
  }
  getContentKey() {
    return '_subcmt_content';
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
        <div class={ 'alt' + (this.isAuthor ? '' : ' fn-hide') + (this.useAuthor ? ' author' : '') }
             onClick={ this.clickAlt }>
          <img src={ $util.img(this.headUrl, 48, 48, 80) || '/src/common/head.png' }/>
          <span>{ this.name }</span>
        </div>
      </div>
      <div class="c">
        <textarea class="text"
                  ref="input"
                  placeholder="请输入评论"
                  onInput={ this.input }
                  maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
      </div>
    </form>;
  }
}

export default sub_comment;
