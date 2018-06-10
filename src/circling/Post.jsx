/**
 * Created by army8735 on 2018/6/8.
 */

'use strict';

import Banner from '../find/Banner.jsx';
import PostList from '../component/postlist/PostList.jsx';

let scrollY = 0;

let circleOffset = 0;
let loadingCircle;
let loadCircleEnd;

let ajax;
let loading;
let loadEnd;
let elStack = [];
let idStack = [];
let offset = 0;

let currentPriority = 0;
let cacheKey = 'circling';
let scroll;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    $util.scrollY(scrollY);
  }
  @bind circleList
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/circling/index', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        if(!scroll) {
          scroll = true;
          window.addEventListener('scroll', function() {
            if(self.visible) {
              self.checkMore();
              scrollY = $util.scrollY();
            }
          });
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let banner = self.ref.banner;
    let postList = self.ref.postList;

    banner.setData(data.bannerList);
    self.circleList = data.circleList.data;
    circleOffset = data.circleList.limit;
    postList.setData(data.recommendComment.concat(data.postList.data));
    offset = data.postList.limit;
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if($util.isBottom()) {
      self.load();
      $net.statsAction(1);
    }
  }
  load() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if(ajax) {
      ajax.abort();
    }
    let postList = self.ref.postList;
    loading = true;
    ajax = $net.postJSON('/h5/circling/postList', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        postList.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
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
  scroll(e, vd) {
    let self = this;
    let el = vd.element;
    if(loadingCircle || loadCircleEnd) {
      return;
    }
    if(el.scrollLeft + el.offsetWidth + 30 > el.scrollWidth) {
      loadingCircle = true;
      $net.postJSON('/h5/circling/circleList', { offset: circleOffset }, function(res) {
        if(res.success) {
          let data = res.data;
          self.circleList = self.circleList.concat(data.data);
          circleOffset += data.limit;
          if(circleOffset >= data.count) {
            loadCircleEnd = true;
          }
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
        loadingCircle = false;
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        loadingCircle = false;
      });
    }
  }
  refresh() {
    this.init();
  }
  clickCircle() {
    jsBridge.pushWindow('/all_circles.html', {
      title: '全部圈子',
    });
  }
  clickTag(e, vd, tvd) {
    let self = this;
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
    self.ref.postList.clearData();
    self.ref.postList.message = '正在加载...';
    offset = 0;
    loadEnd = false;
    loading = false;
    self.load();
    $net.statsAction(4);
  }
  favor(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.postList.data.forEach(function(item) {
          if(item.id === id) {
            item.isFavor = data.state;
            item.favorCount = data.count;
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  like(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.postList.data.forEach(function(item) {
          if(item.id === id) {
            item.isLike = data.state;
            item.likeCount = data.count;
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  del(id) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.postList.data.forEach(function(item, i) {
          if(item.id === id) {
            cache.postList.data.splice(i, 1);
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  render() {
    return <div class={ 'mod-post2' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <div class="circle">
        <label onClick={ this.clickCircle }>圈子</label>
        <ul onScroll={ this.scroll }
            onClick={ this.clickTag }>
          {
            (this.circleList || []).map(function(item) {
              return <li rel={ item.id }>{ item.name }</li>;
            })
          }
        </ul>
      </div>
      <PostList ref="postList"
                visible={ true }
                message="正在加载..."
                on-favor={ this.favor }
                on-like={ this.like }
                on-del={ this.del }
                on-clickPlay={ function() { $net.statsAction(2); } }
                on-clickShare={ function() { $net.statsAction(5); } }
                on-clickLike={ function() { $net.statsAction(6); } }
                on-clickFavor={ function() { $net.statsAction(7); } }
                on-clickComment={ function() { $net.statsAction(8); } }
                on-clickMore={ function() { $net.statsAction(9); } }/>
    </div>;
  }
}

export default Post;
