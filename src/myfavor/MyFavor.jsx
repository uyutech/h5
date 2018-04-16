/**
 * Created by army8735 on 2017/12/5.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
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
let audioLimit = 0;
let audioLoading;
let audioLoadEnd;
let imageOffset = 0;
let imageLimit = 0;
let imageLoading;
let imageLoadEnd;
let postOffset = 0;
let postLimit = 0;
let postLoading;
let postLoadEnd;

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
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    net.postJSON('/h5/my2/favorList', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
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
    let postList = self.ref.postList;

    let video = data.videoList;
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

    let audio = data.audioList;
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

    let image = data.imageList;
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

    let post = data.postList;
    if(post.count) {
      postOffset = postLimit = post.limit;
      postList.setData(post.data);
    }
    else {
      postList.clearData();
      postList.message = '暂无收藏画圈';
    }

    return;

    let $window = $(window);
    if(!loadEnd || !loadEnd2 || !loadEnd3 || !loadEnd4) {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      self.checkMore($window);
    }
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
                 message="正在加载..."
                 @visible={ this.kind === 1 }/>
      <Playlist ref="playlist"
                @visible={ this.kind === 2 }/>
      <WaterFall ref="waterFall"
                 @visible={ this.kind === 3 }/>
      <PostList ref="postList"
                @visible={ this.kind === 4 }/>
    </div>;
  }
}

export default MyFavor;
