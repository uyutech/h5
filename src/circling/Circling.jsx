/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
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

class Circling extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      self.init();
      // jsBridge.on('resume', function(e) {
      //   if(e.data && e.data.type === 'subPost') {
      //     self.ref.hotPost.prependData(e.data.data);
      //   }
      // });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    util.scrollY(scrollY);
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
    ajax = net.postJSON('/h5/circling2/index', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          if(self.visible) {
            self.checkMore();
            scrollY = util.scrollY();
          }
        });
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
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

    postList.setData(data.postList.data);
    offset = data.postList.limit;
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if(util.isBottom()) {
      self.load();
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
    ajax = net.postJSON('/h5/circling2/postList', { circleId: idStack.join(','), offset }, function(res) {
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
      net.postJSON('/h5/circling2/circle', { offset: circleOffset }, function(res) {
        if(res.success) {
          let data = res.data;
          self.circleList = self.circleList.concat(data.data);
          circleOffset += data.limit;
          if(circleOffset >= data.count) {
            loadCircleEnd = true;
          }
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
    jsBridge.pushWindow('/all_circles.html', {
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
    this.ref.postList.clearData();
    this.ref.postList.message = '正在加载...';
    offset = 0;
    loadEnd = false;
    loading = false;
    this.load();
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
    return <div class={ 'circling' + (this.visible ? '' : ' fn-hide') }>
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
                on-del={ this.del }/>
    </div>;
  }
}

export default Circling;
