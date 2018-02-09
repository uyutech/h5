/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import People from './People.jsx';
import Circles from './Circles.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;
let ajax;
let visible;
let scrollY = 0;

class Follow extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      self.init();
      migi.eventBus.on('LOGIN_OUT', function() {
        let people = self.ref.people;
        people.list = [];

        let circles = self.ref.circles;
        circles.dataList = [];

        let hotPost = self.ref.hotPost;
        hotPost.clearData();

        self.type = '0';
      });
      migi.eventBus.on('LOGIN', function() {
        if(visible) {
          self.init();
        }
      });
    });
  }
  @bind type = '0'
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
    if(visible) {
      if(ajax) {
        ajax.abort();
      }
      loadEnd = loading = false;
      skip = 0;
      self.ref.hotPost.clearData();
      self.load();
    }
  }
  init() {
    let self = this;
    self.ref.hotPost.message = '正在加载...';
    net.postJSON('/h5/follow/index', { type: self.type }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;

    let people = self.ref.people;
    people.list = data.follows || [];

    let circles = self.ref.circles;
    circles.dataList = data.hotCircle || [];

    let hotPost = self.ref.hotPost;
    if(data.postList && data.postList.Size > 0) {
      hotPost.setData(data.postList.data);
    }

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
    if(loading) {
      return;
    }
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/follow/postList', { skip, take, type: self.type }, function(res) {
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
  clickType(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.type) {
      return;
    }
    self.type = tvd.props.rel;
    skip = 0;
    loading = loadEnd = false;
    self.ref.hotPost.clearData();
    self.load();
  }
  render() {
    return <div class="follow">
      <div class="author">
        <h4>关注作者</h4>
        <People ref="people"
                more="/relation.html"/>
      </div>
      <Circles ref="circles"
               empty={ '你还没有关注话题哦，快去发现页看看有没有喜欢的话题吧！' }/>
      <ul class="type"
          onClick={ { li: this.clickType } }>
        <li class={ this.type === '0' ? 'cur': '' } rel="0">全部</li>
        <li class={ this.type === '1' ? 'cur': '' } rel="1">圈友</li>
      </ul>
      <HotPost ref="hotPost"/>
    </div>;
  }
}

export default Follow;
