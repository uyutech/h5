/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

let offset = 0;
let loading;
let loadEnd;

let currentPriority = 0;
let cacheKey = 'allCircles';

class AllCircles extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = '正在加载...';
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', 'a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
    });
  }
  @bind message
  init() {
    let self = this;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/circle2/popularList', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.ref.list.element.innerHTML = '';
    offset = data.limit;
    self.appendData(data.data);

    if(offset >= data.count) {
      loadEnd = true;
      self.message = '已经到底了';
    }
    else {
      loadEnd = false;
      self.message = '';
    }
  }
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  genItem(item) {
    let url = `/circle.html?id=${item.id}`;
    return <li>
      <a href={url}
         class="pic"
         title={ item.name + '圈' }>
        <img src={$util.img(item.cover, 288, 288, 80) || '/src/common/blank.png'}/>
      </a>
      <a href={url}
         class="txt"
         title={ item.name + '圈' }>
        <span class="name">{ item.name }</span>
        <span class="fans">成员{ $util.abbrNum(item.fansCount) }</span>
        <span class="comment">画圈{ $util.abbrNum(item.postCount) }</span>
      </a>
    </li>;
  }
  checkMore() {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    $net.postJSON('/h5/circle2/popularList', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        self.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          self.message = '已经到底了';
        }
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
  render() {
    return <div class="all-circles">
      <ul ref="list"/>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default AllCircles;
