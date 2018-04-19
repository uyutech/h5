/**
 * Created by army on 2017/4/21.
 */

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    self.message = '正在加载...';
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
  @bind message
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
    ids = ids.join(',');
    $net.postJSON('/h5/my2/guideCircle', { ids }, function(res) {
      if(res.success) {
        self.emit('next');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      self.sending = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
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
    if(!self.isShow) {
      return;
    }
    $net.postJSON('/h5/circle2/all', function(res) {
      if(res.success) {
        let data = res.data;
        let s = '';
        (data.data || []).forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.list.element).append(s);
        self.message = '';
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  genItem(item) {
    return <li rel={ item.id }>{ item.name }</li>;
  }
  render() {
    return <div class={ 'step2' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>请选择你感兴趣的圈子</h2>
        <h4>以便我们呈现更适合你的内容</h4>
        <ul class="list"
            ref="list"/>
        <p class="cp-message">{ this.message }</p>
      </div>
      <button class={ 'sub' + (this.sending ? ' dis' : '') }
              onClick={ this.next }>我选好啦！</button>
    </div>;
  }
}

export default Step2;
