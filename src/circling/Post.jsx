/**
 * Created by army8735 on 2018/6/8.
 */

'use strict';

import Banner from '../find/Banner.jsx';
import PostList from '../component/postlist/PostList.jsx';

let scrollY = 0;

let ajax;
let loading;
let loadEnd;
let offset = 0;

let currentPriority = 0;
let cacheKey = 'circling3';
let scroll;
let first = true;

let lastVideo;
let lastAudio;

let timeout;

class Post extends migi.Component {
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
    if(v) {
      if(first) {
        first = false;
        this.init();
      }
    }
  }
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    first = false;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/circling/index3', function(res) {
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
              self.checkRead();
            }
          });
        }
        self.checkRead();
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
    banner.setData(data.bannerList);

    let postList = self.ref.postList;
    data.recommendPost.forEach((item) => {
      item.recommend = true;
    });
    data.postList.data.forEach((item) => {
      item.recommend = true;
    });
    postList.setData(data.recommendPost.concat(data.postList.data));
    offset = data.postList.limit;
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
    ajax = $net.postJSON('/h5/circling/postList3', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        data.data.forEach((item) => {
          item.recommend = true;
        });
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
  checkRead() {
    if(timeout) {
      clearTimeout(timeout);
    }
    let self = this;
    timeout = setTimeout(function() {
      let height = document.documentElement.clientHeight;
      let list = [];
      let lis = self.ref.postList.element.querySelectorAll('.list>li');
      for(let i = 0; i < lis.length; i++) {
        let item = lis[i];
        let rect = item.getBoundingClientRect();
        if(rect.top >= 0 && rect.top <= height) {
          if(!item.classList.contains('read') && item.getAttribute('rel')) {
            list.push(item);
          }
          for(let j = i + 1; j < lis.length; j++) {
            let item = lis[j];
            let rect = item.getBoundingClientRect();
            if(rect.top >= 0 && rect.top <= height && rect.top + rect.height <= height) {
              if(!item.classList.contains('read') && item.getAttribute('rel')) {
                list.push(item);
              }
            }
            else {
              break;
            }
          }
          break;
        }
      }
      if(list.length && $util.isLogin()) {
        let idList = list.map((item) => {
          return item.getAttribute('rel');
        });
        $net.postJSON('/h5/circling/read2', { idList }, function(res) {
          if(res.success) {
            list.forEach((item) => {
              item.classList.add('read');
            });
          }
          else if(res.code === 1000) {
            $.cookie('isLogin', null);
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        });
      }
    }, 500);
  }
  clickCircle(e, vd, tvd) {
    let title = tvd.find('span').element.textContent;
    jsBridge.pushWindow('/circle.html?id=' + tvd.props.rel, {
      title,
    });
  }
  render() {
    return <div class={ 'mod-post2' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <ul class="circle"
          onClick={ { li: this.clickCircle } }>
        <li rel={ 2019000000008345 }>
          <img src="//zhuanquan.xyz/temp/52241cc1e454f0a49ff4506443149302.png-160_160_80"/>
          <span>合作圈</span>
        </li>
        <li rel={ 2019000000000001 }>
          <img src="//zhuanquan.xyz/temp/4ec79947e068b21fbef207a825cb53c0.jpg-160_160_80"/>
          <span>音乐圈</span>
        </li>
        <li rel={ 2019000000000015 }>
          <img src="//zhuanquan.xyz/temp/a90520ad2270e08c943f1089c2ddbad3.jpg-160_160_80"/>
          <span>美图圈</span>
        </li>
        <li rel={ 2019000000000072 }>
          <img src="//zhuanquan.xyz/temp/206944362384abfed762ab94c1975fa1.jpg-160_160_80"/>
          <span>古风圈</span>
        </li>
      </ul>
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

export default Post;
