/**
 * Created by army8735 on 2018/7/25.
 */

'use strict';

import PostList from '../component/postlist/PostList.jsx';

let scrollY = 0;

let ajax;
let loading;
let loadEnd;
let offset = 0;

let currentPriority = 0;
let cacheKey = 'circlingNewest';
let scroll;

let lastVideo;
let lastAudio;

let timeout;

class Newest extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('PLAY_INLINE', function() {
        if(lastVideo && lastVideo.element) {
          lastVideo.parent.element.classList.add('pause');
          lastVideo.element.pause();
          lastVideo = null;
        }
        if(lastAudio && lastAudio.element) {
          lastAudio.element.classList.remove('pause');
          lastAudio = null;
        }
      });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    $util.scrollY(scrollY);
  }
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
    ajax = $net.postJSON('/h5/circling/all', function(res) {
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
    let postList = self.ref.postList;
    postList.setData(data.data);
    offset = data.limit;
    if(offset >= data.count) {
      loadEnd = true;
      postList.message = '已经到底了';
    }
    else {
      loadEnd = false;
      postList.message = '正在加载...';
    }
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
    ajax = $net.postJSON('/h5/circling/all', { offset }, function(res) {
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
  refresh() {
    this.init();
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
  clickLike(e, vd, tvd) {
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let el = tvd.element;
    if(el.classList.contains('loading')) {
      return;
    }
    el.classList.add('loading');
    let id = tvd.props.worksId;
    let workId = tvd.props.workId;
    let url = el.classList.contains('liked') ? 'unLike' : 'like';
    $net.postJSON('/h5/works/' + url, { id, workId }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.state) {
          el.classList.add('liked');
        }
        else {
          el.classList.remove('liked');
        }
        el.textContent = data.count || '';
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      el.classList.remove('loading');
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      el.classList.remove('loading');
    });
  }
  clickComment(e, vd, tvd) {
    let title = tvd.props.title;
    let id = tvd.props.rel;
    migi.eventBus.emit('PLAY_INLINE');
    if(tvd.element.textContent) {
      jsBridge.pushWindow('/works.html?id=' + id + '&comment=1', {
        title,
        transparentTitle: true,
      });
    }
    else {
      jsBridge.pushWindow('/sub_comment.html?type=2&id=' + id, {
        title: '评论',
        optionMenu: '发布',
      });
    }
  }
  render() {
    return <div class={ 'mod-post2' + (this.visible ? '' : ' fn-hide') }>
      <PostList ref="postList"
                visible={ true }
                message='正在加载...'
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

export default Newest;
