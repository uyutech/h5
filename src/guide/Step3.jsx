/**
 * Created by army on 2017/4/22.
 */

let loading;
let loadEnd;

class Step3 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    self.on(migi.Event.DOM, function() {
      if(self.isShow) {
        self.loadMore();
      }
      let $list = $(self.ref.list.element);
      let $sel = $(self.ref.sel.element);
      $list.on('click', 'li', function() {
        let $this = $(this);
        $this.toggleClass('on');
        let authorId = $this.attr('rel');
        if($this.hasClass('on')) {
          $sel.prepend(self.genItem2({
            id: authorId,
            headUrl: $this.find('img').attr('src'),
          }).toString());
        }
        else {
          $sel.find('li[rel="' + authorId + '"]').remove();
        }
      });
      $sel.on('click', 'li', function() {
        let $this = $(this);
        let authorId = $this.attr('rel');
        $this.remove();
        $list.find('li[rel="' + authorId + '"]').removeClass('on');
      });
    });
  }
  @bind isShow
  @bind sending
  @bind message
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  next() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    let ids = [];
    $(self.ref.sel.element).find('li').each(function(i, o) {
      ids.push($(o).attr('rel'));
    });
    ids = ids.join(',');
    $net.postJSON('/h5/my2/guideAuthor', { ids }, function(res) {
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
  loadMore() {
    let self = this;
    if(loading || loadEnd || !self.isShow) {
      return;
    }
    loading = true;
    self.message = '正在加载...';
    $net.postJSON('/h5/author2/all', function(res) {
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
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  genItem(item) {
    return <li rel={ item.id }>
      <img src={ $util.img120_120_80(item.headUrl) || '/src/common/head.png' }/>
      <span>{ item.name }</span>
    </li>;
  }
  genItem2(item) {
    return <li rel={ item.id }>
      <img src={ $util.img120_120_80(item.headUrl) || '/src/common/head.png' }/>
    </li>;
  }
  render() {
    return <div class={ 'step3' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>这里有你喜欢的作者吗？</h2>
        <h4>没有也没关系，之后随时可以添加</h4>
        <ul class="list"
            ref="list"/>
        <p class="cp-message">{ this.message }</p>
      </div>
      <ul class="sel" ref="sel"/>
      <button class={ 'sub' + (this.sending ? ' dis' : '') }
              onClick={ this.next }>我选好啦!</button>
    </div>;
  }
}

export default Step3;
