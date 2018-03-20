/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import VideoList from '../find/VideoList.jsx';
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

class MyFavor extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind type = 4
  init() {
    let self = this;
    net.postJSON('/h5/my/favor', function(res) {
      if(res.success) {
        self.setData(res.data);
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
  setData(data) {
    let self = this;

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
    if(tvd.props.rel === self.type) {
      return;
    }
    self.type = tvd.props.rel;
    self.ref.waterFall.pause = self.type !== 2;
    if(self.type === 2) {
      self.ref.waterFall.checkPool();
    }
  }
  render() {
    return <div class="myfavor">
      <ul class="type" ref="type" onClick={ { span: this.click } }>
        <li><span class={ this.type === 4 ? 'cur' : '' } rel={ 4 }>视频</span></li>
        <li><span class={ this.type === 1 ? 'cur' : '' } rel={ 1 }>音乐</span></li>
        <li><span class={ this.type === 2 ? 'cur' : '' } rel={ 2 }>图片</span></li>
        <li><span class={ this.type === 3 ? 'cur' : '' } rel={ 3 }>画圈</span></li>
      </ul>
      <VideoList ref="videoList"
                 @visible={ this.type === 4 }/>
      <Playlist ref="playlist"
                @visible={ this.type === 1 }/>
      <WaterFall ref="waterFall"
                 pause={ true }
                 @visible={ this.type === 2 }/>
      <HotPost ref="hotPost"
               @visible={ this.type === 3 }/>
    </div>;
  }
}

export default MyFavor;
