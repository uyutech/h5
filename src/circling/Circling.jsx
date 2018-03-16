/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import Banner from './Banner.jsx';

let take = 10;
let skip = 0;
let ajax;
let loading;
let loadEnd;
let visible;
let scrollY = 0;
let circleSkip = 0;
let circleTake = 10;
let loadingCircle;
let loadCircleEnd;
let elStack = [];
let idStack = [];

class Circling extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      self.init();
      jsBridge.on('resume', function(e) {
        if(e.data && e.data.type === 'subPost') {
          self.ref.hotPost.prependData(e.data.data);
        }
      });
    });
  }
  @bind circles
  init() {
    let self = this;
    net.postJSON('/h5/circling/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
  }
  hide() {
    let self = this;
    $(self.element).addClass('fn-hide');
    visible = false;
    self.ref.hotPost.pauseLast();
  }
  refresh() {
    let self = this;
    if(visible && !loading) {
      loadEnd = false;
      self.ref.hotPost.setData();
      skip = 0;
      self.load();
    }
  }
  setData(data) {
    let self = this;

    circleTake = data.circleTake || circleTake;
    circleSkip += circleTake;
    loadCircleEnd = circleSkip >= data.hotCircleList.Size;
    self.circles = data.hotCircleList.data;

    take = data.take || take;
    skip += take;
    loadEnd = skip >= data.postList.Size;

    let hotPost = self.ref.hotPost;
    let postList = [];
    if(data.top1 && data.top1.data) {
      postList = data.top1.data || [];
    }
    if(data.top2 && data.top2.data) {
      postList = postList.concat(data.top2.data || []);
    }
    postList = postList.concat(data.postList.data || []);
    hotPost.setData(postList);
    hotPost.message = '';

    let banner = self.ref.banner;
    banner.dataList = data.bannerList || [];
    banner.visible = data.bannerList && data.bannerList.length;

    let $window = $(window);
    $window.on('scroll', function() {
      if(!visible) {
        return;
      }
      self.checkMore($window);
    });
    if(loadEnd) {
      hotPost.message = '已经到底了';
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
    ajax = net.postJSON('/h5/circling/postList', { skip, take, circleId: idStack.join(',') }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        let postList = [];
        if(data.top1 && data.top1.data) {
          postList = data.top1.data || [];
        }
        if(data.top2 && data.top2.data) {
          postList = postList.concat(data.top2.data || []);
        }
        postList = postList.concat(data.postList.data || []);
        hotPost.appendData(postList);
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
  scroll(e, vd) {
    let self = this;
    let el = vd.element;
    if(loadingCircle || loadCircleEnd) {
      return;
    }
    if(el.scrollLeft + el.offsetWidth + 30 > el.scrollWidth) {
      loadingCircle = true;
      net.postJSON('/h5/circling/circleList', { skip: circleSkip, take: circleTake }, function(res) {
        if(res.success) {
          let data = res.data;
          self.circles = self.circles.concat(data.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingCircle = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingCircle = false;
      });
    }
  }
  clickCircle() {
    jsBridge.pushWindow('/allcircles.html', {
      title: '全部圈子',
    });
  }
  clickTag(e, vd, tvd) {
    let el = tvd.element;
    let id = tvd.props.rel;
    let add = false;
    if(el.classList.contains('on')) {
      el.classList.remove('on');
    }
    else {
      el.classList.add('on');
      add = true;
    }
    if(add) {
      elStack.push(el);
      idStack.push(id);
    }
    else {
      for(let i = 0; i < idStack.length; i++) {
        if(idStack[i] === id) {
          idStack.splice(i, 1);
          elStack.splice(i, 1);
          break;
        }
      }
    }
    if(elStack.length > 3) {
      let el = elStack.shift();
      el.classList.remove('on');
    }
    if(idStack.length > 3) {
      idStack.shift();
    }
    this.ref.hotPost.setData();
    skip = 0;
    loadEnd = false;
    loading = false;
    this.load();
  }
  render() {
    return <div class="circling">
      <Banner ref="banner"
              dataList={ this.bannerList }/>
      <div class="circle">
        <label onClick={ this.clickCircle }>圈子</label>
        <ul onScroll={ this.scroll } onClick={ this.clickTag }>
        {
          (this.circles || []).map(function(item) {
            return <li rel={ item.TagID }>{ item.TagName }</li>;
          })
        }
        </ul>
      </div>
      <HotPost ref="hotPost" message="正在加载..."/>
    </div>;
  }
}

export default Circling;
