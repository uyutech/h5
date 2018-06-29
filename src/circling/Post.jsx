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

let timeout;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.worksList = [];
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
              self.checkRead();
            }
          });
          self.checkRead();
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
    data.recommendWorks.forEach((item) => {
      list.push(self.genItem(item));
    });
    if(list.length) {
      self.worksList = list;
    }

    let postList = self.ref.postList;
    postList.setData(data.recommendPost.concat(data.postList.data));
    offset = data.postList.limit;
  }
  genItem(item) {
    let work = item.collection[0];
    let txt = item.describe || '';
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
    work.author.forEach((item) => {
      item.list.forEach((at) => {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    if(work.kind === 2) {
      return <li class="audio"
                 rel={ item.contentId }>
        <div class="pic first"
             worksId={ item.id }
             workId={ work.id }
             title={ item.title || work.title }
             cover={ item.cover || work.cover }
             url={ work.url }
             rel={ item }>
          <img src={ $util.img(item.cover || work.cover, 250, 250, 80)
          || '/src/common/blank.png' }/>
          <span class="type">{ item.label || item.typeName }</span>
          <div class="btn">
            <b class={ 'like' + (work.isLike ? ' liked' : '') }
               worksId={ item.id }
               workId={ work.id }>{ $util.abbrNum(work.likeCount) || '' }</b>
            <b class="comment"
               title={ item.title || work.title }
               rel={ item.id }>{ $util.abbrNum(item.commentCount) || '' }</b>
            <b class="fn"
               worksId={ item.id }
               workId={ work.id }
               title={ item.title || work.title }
               cover={ item.cover || work.cover }/>
          </div>
        </div>
        <div class="txt">
          <a href={ url }
             title={ item.title || work.title }
             class="name">{ item.title || work.title }</a>
          <div class="author"
               title={ author }>
            {
              work.author.map((item) => {
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
             title={ item.title || work.title }
             class="intro">
            <pre>{ txt }</pre>
          </a>
          {
            item.tag
              ? <ul class="tag">
                {
                  item.tag.map((tag) => {
                    return <li>{ tag.name }</li>;
                  })
                }
              </ul>
              : ''
          }
        </div>
      </li>;
    }
    return <li class="video"
               rel={ item.contentId }>
      <div class="pic"
           worksId={ item.id }
           workId={ work.id }
           rel={ item }>
        <img src={ $util.img(item.cover || work.cover, 750, 0, 80) || '/src/common/blank.png' }/>
        <video class="fn-hide"
               poster="/src/common/blank.png"
               src={ work.url }
               preload="none"
               playsinline="true"
               webkit-playsinline="true"/>
        <a class="name"
           href={ url }
           title={ item.title || work.title }>{ item.title || work.title }</a>
        <div class="num">
          <span class="play">{ $util.abbrNum(work.views) }次播放</span>
        </div>
        <span class="type">{ item.label || item.typeName }</span>
        <div class="btn">
          <b class={ 'like' + (work.isLike ? ' liked' : '') }
             worksId={ item.id }
             workId={ work.id }>{ $util.abbrNum(work.likeCount) || '' }</b>
          <b class="comment"
             title={ item.title || work.title }
             rel={ item.id }>{ $util.abbrNum(item.commentCount) || '' }</b>
          <b class="fn"
             worksId={ item.id }
             workId={ work.id }
             title={ item.title || work.title }
             cover={ item.cover || work.cover }/>
        </div>
      </div>
      <div class="info">
        <div class="author"
             title={ author }>
          {
            work.author.map((item) => {
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
        <pre>{ txt }</pre>
        {
          item.tag
            ? <ul class="tag">
              {
                item.tag.map((tag) => {
                  return <li>{ tag.name }</li>;
                })
              }
              </ul>
            : ''
        }
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
  clickPic(e, vd, tvd, evd) {
    if(evd.name === 'b' || evd.name === 'a') {
      return;
    }
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
      let works = tvd.props.rel;
      let work = works.collection[0];
      work.worksId = works.id;
      work.worksCover = works.cover;
      work.worksTitle = work.title;
      $util.recordPlay(work);
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
    migi.eventBus.emit('PLAY_INLINE');
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
  clickPic2(e, vd, tvd, evd) {
    if(evd.name === 'b') {
      return;
    }
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
      let works = tvd.props.rel;
      let work = works.collection[0];
      work.worksId = works.id;
      work.worksCover = works.cover;
      work.worksTitle = work.title;
      $util.recordPlay(work);
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
  checkRead() {
    if(timeout) {
      clearTimeout(timeout);
    }
    let self = this;
    timeout = setTimeout(function() {
      let lis = self.ref.works.element.querySelectorAll('li.video,li.audio');
      let height = document.documentElement.clientHeight;
      let list = [];
      for(let i = 0; i < lis.length; i++) {
        let item = lis[i];
        let rect = item.getBoundingClientRect();
        if(rect.top >= 0 && rect.top <= height) {
          if(!item.classList.contains('read')) {
            list.push(item);
          }
          for(let j = i + 1; j < lis.length; j++) {
            let item = lis[j];
            let rect = item.getBoundingClientRect();
            if(rect.top >= 0 && rect.top <= height) {
              if(!item.classList.contains('read')) {
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
      lis = self.ref.postList.element.querySelectorAll('.list>li');
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
            if(rect.top >= 0 && rect.top <= height) {
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
        $net.postJSON('/h5/circling/read', { idList }, function(res) {
          if(res.success) {
            list.forEach((item) => {
              item.classList.add('read');
            });
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
  render() {
    return <div class={ 'mod-post2' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <ul class="works"
          ref="works"
          onClick={ {
            '.video .pic': this.clickPic,
            '.like': this.clickLike,
            '.comment': this.clickComment,
            '.video .name': this.clickName,
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
