/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';

let take = 10;
let skip = take;
let ajax;
let loading;
let loadEnd;
let circleID;
let visible;
let scrollY = 0;

class Circling extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      net.postJSON('/h5/circling/index', function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
  }
  refresh() {
    let self = this;
    if(self.hasData && visible) {
      self.ref.hotPost.setData();
      skip = 0;
      self.load();
    }
  }
  setData(data) {
    let self = this;

    self.hotCircle = data.hotCircle;
    self.postList = data.postList;
    loadEnd = self.postList.Size <= take;

    self.hasData = true;

    let $window = $(window);
    $window.on('scroll', function() {
      if(!visible) {
        return;
      }
      self.checkMore($window);
    });
    if(loadEnd) {
      self.ref.hotPost.message = '已经到底了';
    }
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    scrollY = $window.scrollTop();
    let bool;
    bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON(circleID ? '/h5/circle/postList' : '/h5/circling/postList', { skip, take, circleID }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
        }
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
  clickTag(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      $(vd.element).find('.cur').removeClass('cur');
      $li.addClass('cur');
      circleID = tvd.props.rel;
      this.ref.hotPost.setData();
      skip = 0;
      loadEnd = false;
      loading = false;
      this.load();
    }
  }
  genDom() {
    let self = this;
    return <div>
      <ul class="circles" onClick={ { li: self.clickTag.bind(self) } }>
        <li class="cur">全部</li>
        {
          (self.hotCircle.data || []).map(function(item) {
            return <li rel={ item.TagID }>{ item.TagName }</li>;
          })
        }
      </ul>
      <p class="cinfo">↑未来，这里将可以复选多个圈子一起逛哦↑</p>
      <HotPost ref="hotPost" dataList={ self.postList.data }/>
    </div>;
  }
  render() {
    return <div class="circling">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Circling;
