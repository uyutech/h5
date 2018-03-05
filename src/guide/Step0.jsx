/**
 * Created by army on 2017/5/18.
 */

import net from '../common/net';
import util from '../common/util';

let authorId;

class Step0 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    authorId = self.props.authorId;
    if(self.isShow) {
      self.on(migi.Event.DOM, function() {
        net.postJSON('/h5/my/authorRelevant', function(res) {
          if(res.success) {
            let s = '';
            let data = res.data;
            if(data.Hot_Works_Items.length) {
              s += '作为一只立志成为创作圈百科全书的兔，圈儿欣赏过您参与创作的';
              data.Hot_Works_Items.forEach(function(item) {
                s += <span>{ item.Title }</span>;
              });
              s += '等作品！<br/>';
            }
            if(data.Hot_Works_Items.length || data.AuthorToAuthor.length) {
              s += '您合作过的';
              data.AuthorToAuthor.forEach(function(item) {
                s += <span>{ item.AuthorName }</span>;
              });
              s += '等作者也入驻了转圈哦。';
            }
          }
        });
      });
    }
  }
  @bind isShow
  @bind sending
  @bind relevant;
  click(e, vd, tvd) {
    var $o = $(tvd.element);
    if(!$o.hasClass('cur')) {
      this.isMale = !this.isMale;
    }
  }
  next(e, vd) {
    var $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      this.emit('next');
    }
  }
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  clickEnterPublic() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    net.postJSON('h5/my/settle', {
      authorId,
      settle: true,
      public: true,
      step: self.props.step,
    }, function(res) {
      if(res.success) {
        self.emit('next', 1);
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
  clickEnterShadow() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    net.postJSON('h5/my/settle', {
      authorId,
      settle: true,
      step: self.props.step,
    }, function(res) {
      if(res.success) {
        self.emit('next', 2);
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
  clickNotEnter() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    net.postJSON('h5/my/settle', {
      authorId,
      settle: false,
      step: self.props.step,
    }, function(res) {
      if(res.success) {
        self.emit('next', 3);
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
  render() {
    return <div class={ 'step0' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>啊……圈儿眼拙，<br/>才发现您就是传说中的</h2>
        <h4>{ this.props.authorName }</h4>
        <p dangerouslySetInnerHTML={ this.relevant }/>
        <p>不知您是否愿意在转圈入驻？</p>
        <button class={ 'sub' + (this.sending ? ' dis' : '') } onClick={ this.clickEnterPublic }>我要公开入驻！</button>
        <button class={ 'sub' + (this.sending ? ' dis' : '') } onClick={ this.clickEnterShadow }>我要入驻，但是我想披个马甲</button>
        <small>（您依然可以进行作者相关的操作，但将以普通用户的身份进行评论等互动，别人不会知道你就是{ this.props.authorName }）</small>
        <button class={ 'sub' + (this.sending ? ' dis' : '') }onClick={ this.clickNotEnter }>我放弃入驻</button>
      </div>
    </div>;
  }
}

export default Step0;
