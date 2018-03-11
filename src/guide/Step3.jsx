import util from "../common/util";
import net from "../common/net";

/**
 * Created by army on 2017/4/22.
 */

let loading;
let loadEnd;
let skip = 0;
let take = 20;

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
        let authorID = $this.attr('rel');
        if($this.hasClass('on')) {
          $sel.prepend(self.genItem2({
            AuthorID: authorID,
            Head_url: $this.find('img').attr('src'),
          }).toString());
        }
        else {
          $sel.find('li[rel="' + authorID + '"]').remove();
        }
      });
      $sel.on('click', 'li', function() {
        let $this = $(this);
        let authorID = $this.attr('rel');
        $this.remove();
        $list.find('li[rel="' + authorID + '"]').removeClass('on');
      });
    });
  }
  @bind isShow
  @bind sending
  @bind message
  get list() {
    return this._list || [];
  }
  @bind
  set list(v) {
    this._list = v;
  }
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  next(e, vd) {
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
    net.postJSON('/h5/passport/guideAuthor', { ids }, function(res) {
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
  loadMore() {
    let self = this;
    if(loading || loadEnd || !self.isShow) {
      return;
    }
    loading = true;
    self.message = '正在加载...';
    net.postJSON('/h5/passport/guideAuthorList', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
          self.message = '已经到底了';
        }
        let s = '';
        (data.data || []).forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.list.element).append(s);
        s = '';
        (data.data || []).filter(function(item) {
          return item.ISlike;
        }).forEach(function(item) {
          s += self.genItem2(item);
        });
        $(self.ref.sel.element).append(s);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  genItem(item) {
    return <li rel={ item.AuthorID } class={ item.ISlike ? 'on' : '' }>
      <img src={ util.img120_120_80(item.Head_url) || '/src/common/head.png' }/>
      <span>{ item.AuthorName }</span>
    </li>;
  }
  genItem2(item) {
    return <li rel={ item.AuthorID }>
      <img src={ util.img120_120_80(item.Head_url) || '/src/common/head.png' }/>
    </li>;
  }
  render() {
    return <div class={ 'step3' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>这里有你喜欢的作者吗？</h2>
        <h4>没有也没关系，之后随时可以添加</h4>
        <ul class="list" ref="list"/>
        <p class="cp-message">{ this.message }</p>
      </div>
      <ul class="sel" ref="sel"/>
      <button class={ 'sub' + (this.sending ? ' dis' : '') } onClick={ this.next }>我选好啦!</button>
    </div>;
  }
}

export default Step3;
