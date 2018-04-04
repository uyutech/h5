/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import VideoList from '../component/videolist/VideoList.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';

let take = 20;
let take2 = 10;
let take3 = 10;
let take4 = 10;
let skip = take;
let skip2 = take2;
let skip3 = take3;
let skip4 = take4;
let loading = true;
let loading2 = true;
let loading3 = true;
let loading4 = true;
let loadEnd;
let loadEnd2;
let loadEnd3;
let loadEnd4;


let currentPriority = 0;
let cacheKey;

let videoOffset = 0;
let videoLimit = 0;
let videoLoading;
let videoLoadEnd;
let audioOffset = 0;
let audioLimit = 0;
let audioLoading;
let audioLoadEnd;
let imageOffset = 0;
let imageLimit = 0;
let imageLoading;
let imageLoadEnd;

class MyFavor extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.kind = 1;
    self.on(migi.Event.DOM, function() {
      self.ref.waterFall.WIDTH = (screen.availWidth - 30) >> 1;
    });
  }
  @bind kind
  init() {
    let self = this;
    cacheKey = 'myFavor';
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/my2/favor', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = loading2 = loading3 = loading4 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = loading2 = loading3 = loading4 = false;
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.data = data;
    let videoList = self.ref.videoList;
    let playlist = self.ref.playlist;
    let waterFall = self.ref.waterFall;

    let video = data.video;
    if(video.count) {
      videoOffset = videoLimit = video.limit;
      videoList.setData(video.data);
      if(videoOffset >= video.count) {
        videoLoadEnd = true;
        videoList.message = '已经到底了';
      }
    }
    else {
      videoList.clearData();
      videoList.message = '暂无收藏视频';
    }

    let audio = data.audio;
    if(audio.count) {
      audioOffset = audioLimit = audio.limit;
      playlist.setData(audio.data);
      if(audioOffset >= audio.count) {
        audioLoadEnd = true;
        playlist.message = '已经到底了';
      }
    }
    else {
      playlist.clearData();
      playlist.message = '暂无收藏音频';
    }

    let image = data.image;
    if(image.count) {
      imageOffset = imageLimit = image.limit;
      waterFall.setData(image.data);
      if(imageOffset >= image.count) {
        imageLoadEnd = true;
        waterFall.message = '已经到底了';
      }
    }
    else {
      waterFall.clearData();
      waterFall.message = '暂无收藏图片';
    }

    return;

    self.ref.videoList.setData(data.favorVideo.data);
    self.ref.playlist.setData(data.favorAudio.data);
    self.ref.waterFall.setData(data.favorPic.data);
    self.ref.hotPost.setData(data.favorPost.data);

    let $window = $(window);
    if(!loadEnd || !loadEnd2 || !loadEnd3 || !loadEnd4) {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      self.checkMore($window);
    }
  }
  checkMore($window) {
    let self = this;
    if(self.type === 2) {
      if(loading2 || loadEnd2) {
        return;
      }
    }
    else if(self.type === 3) {
      if(loading3 || loadEnd3) {
        return;
      }
    }
    else if(self.type === 1) {
      if(loading || loadEnd) {
        return;
      }
    }
    else if(self.type === 4) {
      if(loading4 || loadEnd4) {
        return;
      }
    }
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let type = self.type;
    let s, t;
    let cp;
    switch(type) {
      case 1:
        s = skip;
        t = take;
        loading = true;
        cp = self.ref.playlist;
        break;
      case 2:
        s = skip2;
        t = take2;
        loading2 = true;
        cp = self.ref.waterFall;
        break;
      case 3:
        s = skip3;
        t = take3;
        loading3 = true;
        cp = self.ref.hotPost;
        break;
      case 4:
        s = skip4;
        t = take4;
        loading4 = true;
        cp = self.ref.videoList;
        break;
    }
    loading = true;
    cp.message = '正在加载...';
    net.postJSON('/h5/my/favorType', { skip: s, take: t, type }, function(res) {
      if(res.success) {
        let data = res.data;
        s += t;
        switch(type) {
          case 1:
            skip += take;
            break;
          case 2:
            skip2 += take2;
            break;
          case 3:
            skip3 += take3;
            break;
          case 4:
            skip4 += take4;
            break;
        }
        cp.appendData(data.data);
        if(s >= data.Size) {
          switch(type) {
            case 1:
              loadEnd = true;
              break;
            case 2:
              loadEnd2 = true;
              break;
            case 3:
              loadEnd3 = true;
              break;
            case 4:
              loadEnd4 = true;
              break;
          }
          cp.message = '已经到底了';
        }
        else {
          cp.message = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      switch(type) {
        case 1:
          loading = false;
          break;
        case 2:
          loading2 = false;
          break;
        case 3:
          loading3 = false;
          break;
        case 4:
          loading4 = false;
          break;
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      switch(type) {
        case 1:
          loading = false;
          break;
        case 2:
          loading2 = false;
          break;
        case 3:
          loading3 = false;
          break;
        case 4:
          loading4 = false;
          break;
      }
    });
  }
  click(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.kind) {
      return;
    }
    self.kind = tvd.props.rel;
    // self.ref.waterFall.pause = self.type !== 2;
    // if(self.type === 2) {
    //   self.ref.waterFall.checkPool();
    // }
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
                 @visible={ this.kind === 1 }/>
      <Playlist ref="playlist"
                @visible={ this.kind === 2 }/>
      <WaterFall ref="waterFall"
                 pause={ true }
                 @visible={ this.kind === 3 }/>
    </div>;
  }
}

export default MyFavor;
