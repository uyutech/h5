/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

let take = 30;
let skip = 0;
let loading;
let loadEnd;

class AllCircles extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      $net.postJSON('/h5/find/allCircles', { skip, take }, function(res) {
        if(res.success) {
          skip += take;
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  @bind message
  setData(data) {
    let self = this;
    self.workList = data.data;
    loadEnd = skip >= data.Size;
    self.hasData = true;

    $(self.ref.list.element).on('click', 'a', function(e) {
      e.preventDefault();
      let $this = $(this);
      let url = $this.attr('href');
      let title = $this.attr('title');
      if(!url) {
        throw new Error('allcircles url is null');
      }
      jsBridge.pushWindow(url, {
        title,
      });
    });

    if(loadEnd) {
      self.message = '已经到底了';
      return;
    }
    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let scrollY = $window.scrollTop();
    let bool;
    bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    self.message = '正在加载...';
    $net.postJSON('/h5/find/allCircles', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        self.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          self.message = '已经到底了';
        }
        else {
          self.message = '';
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
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  genItem(item) {
    let url = `/circle.html?id=${item.TagID}`;
    return <li>
      <a href={url} class="pic" title={ item.TagName + '圈' }>
        <img src={$util.img(item.TagCover, 288, 288, 80) || '//zhuanquan.xin/img/blank.png'}/>
      </a>
      <a href={url} class="txt" title={ item.TagName + '圈' }>
        <span class="name">{ item.TagName }</span>
        <span class="fans">成员{ $util.abbrNum(item.FansNumber) }</span>
        <span class="comment">画圈{ $util.abbrNum(item.Popular) }</span>
      </a>
    </li>;
  }
  genDom() {
    let self = this;
    return <ul ref="list" class="fn-clear">
      {
        self.workList.map(function(item) {
          return self.genItem(item);
        })
      }
    </ul>;
  }
  render() {
    return <div class="all-circles">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-circles"/>
              <div class="fn-placeholder"/>
            </div>
      }
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default AllCircles;
