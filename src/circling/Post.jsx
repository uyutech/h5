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
let cacheKey = 'circling2';
let scroll;

let lastVideo;
let lastAudio;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.worksList = [];
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('PLAY_INLINE', function() {
        if(lastVideo) {
          lastVideo.parent.element.classList.add('pause');
          lastVideo.element.pause();
          lastVideo = null;
        }
        if(lastAudio) {
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
  @bind worksList
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
    ajax = $net.postJSON('/h5/circling/index2', function(res) {
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
    banner.setData(data.bannerList);

    let list = [];
    data.newest.forEach((item) => {
      list.push(self.genItem(item));
    });
    data.hottest.forEach((item) => {
      list.push(self.genItem(item));
    });
    if(list.length) {
      self.worksList = list;
    }

    let postList = self.ref.postList;
    postList.setData(data.recommendComment.concat(data.postList.data));
    offset = data.postList.limit;
  }
  genItem(item) {
    let work = item.collection[0];
    let txt = item.describe;
    if(!txt) {
      for(let i = 1; i < item.collection.length; i++) {
        let o = item.collection[i];
        if(o.kind === 4) {
          txt = o.content;
          break;
        }
      }
    }
    let url = '/works.html?id=' + item.id + '&workId=' + work.id;
    let author = [];
    let hash = {};
    item.author = item.author[0];
    item.author.forEach((item) => {
      item.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    if(work.kind === 2) {
      return <li class="audio">
        <div class="pic first"
             worksId={ item.id }
             workId={ work.id }
             title={ work.title }
             cover={ work.cover || item.cover }
             url={ work.url }>
          <img src={ $util.img(item.cover || work.cover, 250, 250, 80)
          || '/src/common/blank.png' }/>
          <div>
            <span>{ item.typeName }</span>
          </div>
        </div>
        <div class="txt">
          <a href={ url }
             title={ item.title }
             class="name">{ item.title }</a>
          <div class="author"
               title={ author }>
            {
              item.author.map((item) => {
                return <dl>
                  <dt>{ item.name }</dt>
                  {
                    item.list.map((item) => {
                      return <dd>
                        <a href={ '/author.html?id=' + item.id }
                           title={ item.name }>
                          <img src={ $util.img(item.headUrl, 60, 60, 80) || '/src/common/head.png' }/>
                          <span>{ item.name }</span>
                        </a>
                      </dd>;
                    })
                  }
                </dl>
              })
            }
          </div>
          <a href={ url }
             title={ item.title }
             class="intro">
            <pre>{ txt }</pre>
          </a>
        </div>
      </li>;
    }
    return <li class="video">
      <div class="pic"
           worksId={ item.id }
           workId={ work.id }>
        <img src={ $util.img(work.cover || item.cover, 750, 0, 80) || '/src/common/blank.png' }/>
        <div class="num">
          <span class="play">{ $util.abbrNum(work.views) }次播放</span>
        </div>
        <span class="type">{ item.typeName }</span>
        <video class="fn-hide"
               poster="/src/common/blank.png"
               src={ work.url }
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
      </div>
      <a class="name"
         href={ url }
         title={ item.title }>{ work.title }</a>
      <div class="info">
        <p class="author">{ author.join(' ') }</p>
        <b class={ 'like' + (work.isLike ? ' liked' : '') }
           worksId={ item.id }
           workId={ work.id }>{ work.likeCount || '' }</b>
        <b class="comment"
           title={ item.title }
           rel={ item.id }>{ item.commentCount || '' }</b>
        <b class="fn"
           worksId={ item.id }
           workId={ work.id }
           title={ work.title }
           cover={ work.cover || item.cover }/>
      </div>
    </li>;
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
    ajax = $net.postJSON('/h5/circling/postList2', { offset }, function(res) {
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
  clickPic(e, vd, tvd, cvd) {
    let el = tvd.element;
    let video = tvd.find('video');
    let videoEl = video.element;
    if(videoEl.classList.contains('fn-hide')) {
      migi.eventBus.emit('PLAY_INLINE');
      videoEl.classList.remove('fn-hide');
      videoEl.play();
      $net.postJSON('/h5/work/addViews', { id: tvd.props.workId });
      lastVideo = video;
      jsBridge.media({
        key: 'pause',
      });
    }
    else if(el.classList.contains('pause')) {
      migi.eventBus.emit('PLAY_INLINE');
      el.classList.remove('pause');
      videoEl.play();
      lastVideo = video;
      jsBridge.media({
        key: 'pause',
      });
    }
    else {
      el.classList.add('pause');
      videoEl.pause();
      lastVideo = null;
    }
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
  clickName(e, vd, tvd) {
    e.preventDefault();
    let title = tvd.props.title;
    jsBridge.pushWindow(tvd.props.href, {
      title,
      transparentTitle: true,
    });
  }
  clickFn(e, vd, tvd) {
    let id = tvd.props.worksId;
    let workId = tvd.props.workId;
    let title = tvd.props.title;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareIn: true,
      canShareWb: true,
      canShareLink: true,
      clickShareIn: function(botFn) {
        jsBridge.pushWindow('/sub_post.html?worksId=' + id
          + '&workId=' + workId
          + '&cover=' + encodeURIComponent(tvd.props.cover || ''), {
          title: '画个圈',
          optionMenu: '发布',
        });
        botFn.cancel();
      },
      clickShareWb: function(botFn) {
        let author = tvd.parent.find('.author').element.textContent;
        let url = window.ROOT_DOMAIN + '/works/' + id + '/' + workId;
        let text = '【' + title + '】';
        text += author;
        text += ' #转圈circling# ';
        text += url;
        jsBridge.shareWb({
          text,
        }, function(res) {
          if(res.success) {
            jsBridge.toast("分享成功");
          }
          else if(res.cancel) {
            jsBridge.toast("取消分享");
          }
          else {
            jsBridge.toast("分享失败");
          }
        });
        botFn.cancel();
      },
      clickShareLink: function(botFn) {
        let url = window.ROOT_DOMAIN + '/works/' + id + '/' + workId;
        $util.setClipboard(url);
        botFn.cancel();
      },
    });
  }
  clickA(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickPic2(e, vd, tvd) {
    let el = tvd.element;
    let id = tvd.props.worksId;
    let workId = tvd.props.workId;
    if(el.classList.contains('first')) {
      migi.eventBus.emit('PLAY_INLINE');
      let author = tvd.parent.find('.txt').find('.author').props.title;
      jsBridge.media({
        key: 'play',
        value: {
          id: workId,
          url: location.protocol + $util.autoSsl(tvd.props.url),
          title: tvd.props.titile,
          author,
          cover: $util.protocol($util.img(tvd.props.cover, 80, 80, 80)),
        },
      });
      $net.postJSON('/h5/work/addViews', { id });
      el.classList.remove('first');
      el.classList.add('pause');
      lastAudio = tvd;
    }
    else if(el.classList.contains('pause')) {
      jsBridge.media({
        key: 'pause',
      });
      el.classList.remove('pause');
      lastAudio = null;
    }
    else {
      migi.eventBus.emit('PLAY_INLINE');
      jsBridge.media({
        key: 'play',
      });
      el.classList.add('pause');
      lastAudio = tvd;
    }
  }
  render() {
    return <div class={ 'mod-post2' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <ul class="works"
          onClick={ {
            '.video .pic': this.clickPic,
            '.like': this.clickLike,
            '.comment': this.clickComment,
            '.name': this.clickName,
            '.fn': this.clickFn,
            '.audio a': this.clickA,
            '.audio .pic': this.clickPic2,
          } }>{ this.worksList }</ul>
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
