/**
 * Created by army8735 on 2017/12/5.
 */


'use strict';

import VideoList from '../component/videolist/VideoList.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import PostList from '../component/postlist/PostList.jsx';

let currentPriority = 0;
let cacheKey;

let videoOffset = 0;
let videoLimit = 0;
let videoLoading;
let videoLoadEnd;
let audioOffset = 0;
let audioLoading;
let audioLoadEnd;
let imageOffset = 0;
let imageLoading;
let imageLoadEnd;
let postOffset = 0;
let postLoading;
let postLoadEnd;

class MyFavor extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.kind = 1;
    self.on(migi.Event.DOM, function() {
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    });
  }
  @bind kind
  init() {
    let self = this;
    cacheKey = 'myFavor';
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/my/favorList', { kind: 1 }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let videoList = self.ref.videoList;
    let playlist = self.ref.playlist;
    let waterFall = self.ref.waterFall;
    let postList = self.ref.postList;

    if(data.count) {
      videoOffset = videoLimit = data.limit;
      videoList.setData(data.data);
      if(videoOffset >= data.count) {
        videoLoadEnd = true;
        videoList.message = '已经到底了';
      }
    }
    else {
      videoList.clearData();
      videoList.message = '暂无收藏视频';
    }
  }
  checkMore() {
    let self = this;
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let kind = self.kind;
    let url = '/h5/my/favorList';
    let offset;
    let target;
    if(kind === 1) {
      if(videoLoading || videoLoadEnd) {
        return;
      }
      videoLoading = true;
      offset = videoOffset;
      target = self.ref.videoList;
    }
    else if(kind === 2) {
      if(audioLoading || audioLoadEnd) {
        return;
      }
      audioLoading = true;
      offset = audioOffset;
      target = self.ref.playlist;
    }
    else if(kind === 3) {
      if(imageLoading || imageLoadEnd) {
        return;
      }
      imageLoading = true;
      offset = imageOffset;
      target = self.ref.waterFall;
    }
    else if(kind === 4) {
      if(postLoading || postLoadEnd) {
        return;
      }
      postLoading = true;
      url = '/h5/my/favorPostList';
      offset = postOffset;
      target = self.ref.postList;
    }
    $net.postJSON(url, { kind, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        target.appendData(data.data);
        if(kind === 1) {
          videoOffset += data.limit;
          if(videoOffset >= data.count) {
            videoLoadEnd = true;
            target.message = '已经到底了';
          }
        }
        else if(kind === 2) {
          audioOffset += data.limit;
          if(audioOffset >= data.count) {
            audioLoadEnd = true;
            target.message = '已经到底了';
          }
        }
        else if(kind === 3) {
          imageOffset += data.limit;
          if(imageOffset >= data.count) {
            imageLoadEnd = true;
            target.message = '已经到底了';
          }
        }
        else if(kind === 4) {
          postOffset += data.limit;
          if(postOffset >= data.count) {
            postLoadEnd = true;
            target.message = '已经到底了';
          }
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  click(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.kind) {
      return;
    }
    let kind = self.kind = tvd.props.rel;
    if(kind === 2 && audioOffset === 0 || kind === 3 && imageOffset === 0 || kind === 4 && postOffset === 0) {
      self.load();
    }
  }
  change(data) {
    let work = data.work;
    work.worksId = data.id;
    work.worksTitle = data.title;
    work.worksCover = data.cover;
    $util.recordPlay(work);
    $net.postJSON('/h5/work/addViews', { id: work.id });
    let author = [];
    let hash = {};
    (data.work.author || []).forEach(function(item) {
      item.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    jsBridge.media({
      key: 'play',
      value: {
        id: work.id,
        url: location.protocol + $util.autoSsl(work.url),
        title: data.title,
        author: author.join(' '),
        cover: $util.protocol($util.img(data.cover, 80, 80, 80)),
      },
    });
  }
  render() {
    return <div class="myfavor">
      <ul class="kind"
          ref="kind"
          onClick={ { li: this.click } }>
        <li class={ this.kind === 1 ? 'cur' : '' }
            rel={ 1 }>视频</li>
        <li class={ this.kind === 2 ? 'cur' : '' }
            rel={ 2 }>音乐</li>
        <li class={ this.kind === 3 ? 'cur' : '' }
            rel={ 3 }>图片</li>
        <li class={ this.kind === 4 ? 'cur' : '' }
            rel={ 4 }>画圈</li>
      </ul>
      <VideoList ref="videoList"
                 message="正在加载..."
                 @visible={ this.kind === 1 }/>
      <Playlist ref="playlist"
                message="正在加载..."
                on-change={ this.change }
                @visible={ this.kind === 2 }/>
      <WaterFall ref="waterFall"
                 message="正在加载..."
                 @visible={ this.kind === 3 }/>
      <PostList ref="postList"
                message="正在加载..."
                @visible={ this.kind === 4 }/>
    </div>;
  }
}

export default MyFavor;
