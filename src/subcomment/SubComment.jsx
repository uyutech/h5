/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

const MAX_TEXT_LENGTH = 2048;

class SubComment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference(self.getContentKey(), function(cache) {
        if(cache) {
          self.value = cache.trim();
          self.input(null, self.ref.input);
          let length = self.value.trim().length;
          self.invalid = length < 3 || length > MAX_TEXT_LENGTH;
        }
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
  getContentKey() {
    return '_subcmt_content';
  }
  input(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    self.num = $vd.val().length;
    self.num = $vd.val().trim().length;
    let content = $vd.val().trim();
    self.invalid = content.length < 3 || content.length > MAX_TEXT_LENGTH;
    self.warnLength = content.length > MAX_TEXT_LENGTH;
    jsBridge.setPreference(self.getContentKey(), content);
  }
  submit(e) {
    e.preventDefault();
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
  render() {
    return <form class="sub-cmt" ref="form" onSubmit={ this.submit }>
      <div class="ti">
        <span class={ 'limit' + (this.warnLength ? ' warn' : '') }>
          <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
        </span>
        <input type="submit"
               class={ 'submit' + (this.sending || this.invalid || this.disableUpload ? ' dis' : '') }
               value={ this.value.trim().length
                 ? this.value.trim().length < 3
                   ? '-${n}'.replace('${n}', (3 - this.value.trim().length))
                   : '发送'
                 : '发送' }/>
      </div>
      <div class="c">
        <textarea class="text" ref="input" placeholder={ this.placeholder || '请输入评论' }
                  onInput={ this.input } maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
      </div>
    </form>;
  }
}

export default SubComment;
