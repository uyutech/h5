/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

const MAX_TEXT_LENGTH = 2048;
let ajax;

class SubComment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu('发布');
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
  @bind placeholder
  @bind value = ''
  @bind num = 0
  @bind invalid = true
  @bind warnLength
  @bind sending
  @bind sid
  @bind type
  @bind rid
  @bind cid
  @bind isAuthor
  @bind userName
  @bind userHead
  @bind authorName
  @bind authorHead
  @bind isPublic
  init() {
    let self = this;
    net.postJSON('/h5/my/identity', function(res) {
      if(res.success) {
        let data = res.data;
        self.userName = data.uname;
        self.userHead = data.head;
        self.isPublic = data.isPublic;
        self.authorName = data.authorName;
        self.authorHead = data.authorHead;
        self.isAuthor = !!data.authorId;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  getContentKey() {
    return '_subcmt_content';
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
    let self = this;
    if(!self.sending && !self.invalid) {
      self.sending = true;
      net.postJSON('/h5/comment/sub', {
        content: self.value,
        id: self.sid,
        type: self.type,
        cid: self.cid,
        rid: self.rid
      }, function(res) {
        if(res.success) {
          jsBridge.setPreference(self.getContentKey(), null);
          jsBridge.popWindow({ type: 'subComment', data: res.data });
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.sending = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.sending = false;
      });
    }
  }
  clickAlt() {
    let self = this;
    let old = self.isPublic;
    self.isPublic = !old;
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/my/altIdentity', { public: self.isPublic }, function(res) {
      if(!res.success) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.isPublic = old;
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <form class="sub-cmt" ref="form" onSubmit={ this.submit }>
      <div class="c">
        <textarea class="text" ref="input" placeholder={ this.placeholder || '请输入评论' }
                  onInput={ this.input } maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
        <div class={ 'limit' + (this.warnLength ? ' warn' : '') }>
          <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
          <div class={ 'alt' + (this.isAuthor ? '' : ' fn-hide') }
               onClick={ this.clickAlt }>
            <b/>
            <img src={ util.img48_48_80((this.isPublic ? this.authorHead : this.userHead) || '/src/common/head.png') }/>
            <span>{ this.isPublic ? this.authorName : this.userName }</span>
          </div>
        </div>
      </div>
    </form>;
  }
}

export default SubComment;
