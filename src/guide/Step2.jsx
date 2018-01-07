/**
 * Created by army on 2017/4/21.
 */

import net from '../common/net';
import util from '../common/util';

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    self.on(migi.Event.DOM, function() {
      if(self.isShow) {
        self.loadMore();
      }
      let $list = $(self.ref.list.element);
      $list.on('click', 'li', function() {
        $(this).toggleClass('on');
      });
    });
  }
  @bind isShow
  @bind sending
  get list() {
    return this._list || [];
  }
  @bind
  set list(v) {
    this._list = v;
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    let tagId = tvd.props.tagId;
    if($li.hasClass('sel')) {
      this.$list2.find(`[tagId="${tagId}"]`).remove();
    }
    else {
      this.add(tagId, tvd.children[0]);
    }
    this.autoWidth();
    $li.toggleClass('sel');
  }
  next() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    let ids = [];
    $(self.ref.list.element).find('li').each(function(i, o) {
      ids.push($(o).attr('rel'));
    });
    net.postJSON('/h5/passport/guideCircle', { ids }, function(res) {
      if(res.success) {
        self.emit('next');
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
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  loadMore() {
    let self = this;
    net.postJSON('/h5/passport/guideCircleList', { skip: 0, take: 30 }, function(res) {
      if(res.success) {
        let data = res.data;
        let s = '';
        (data.data || []).forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.list.element).append(s);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  genItem(item) {
    return <li rel={ item.ID }>{ item.Tag_Name }</li>;
  }
  render() {
    return <div class={ 'step2' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>请选择你感兴趣的圈子</h2>
        <h4>以便我们呈现更适合你的内容</h4>
        <ul class="list fn-clear" ref="list"/>
      </div>
      <button class={ 'sub' + (this.sending ? ' dis' : '') } onClick={ this.next }>我选好啦！</button>
    </div>;
  }
}

export default Step2;
