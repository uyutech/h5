/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Playlist from '../component/playlist/Playlist.jsx';
import VideoList from '../find/VideoList.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import Fn from '../find/Fn.jsx';

const CACHE = {};
let take = 10;
let image;

class Work extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.on(migi.Event.DATA, function(k) {
      if(k === 'visible') {
        self.ref.waterFall.pause = !self.visible || self.typeId !== 3;
        self.ref.waterFall.checkPool();
      }
    });
  }
  @bind visible
  @bind type
  @bind typeId
  @bind authorId
  setData(type, itemList) {
    let self = this;
    self.type = type;
    if(type.length) {
      type.forEach(function(item) {
        CACHE[item.GroupID] = {
          loading: false,
          loadEnd: false,
          skip: 0,
          sort: 0,
          type: item.itemsTypeList,
        };
      });
      let first = type[0];
      self.typeId = first.GroupID;
      let cache = CACHE[self.typeId];
      cache.skip += take;
      cache.loadEnd = itemList.Size <= take;
      self.ref.fn.list = first.itemsTypeList;
      switch(self.typeId) {
        // 音频
        case 1:
          self.ref.playlist.setData(itemList.data);
          if(cache.loadEnd) {
            self.ref.playlist.message = '已经到底了';
          }
          break;
        // 视频
        case 2:
          self.ref.videoList.setData(itemList.data);
          if(cache.loadEnd) {
            self.ref.videoList.message = '已经到底了';
          }
          break;
        // 图片
        case 3:
          self.ref.waterFall.setData(itemList.data);
          if(cache.loadEnd) {
            self.ref.waterFall.message = '已经到底了';
          }
          break;
      }
      let $window = $(window);
      $window.on('scroll', function() {
        if(!self.visible) {
          return;
        }
        self.checkMore($window);
      });
      self.ref.fn.on('sort', function(sort) {
        let cache = CACHE[self.typeId];
        cache.sort = sort;
      });
    }
  }
  clickType(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.typeId) {
      return;
    }
    self.typeId = tvd.props.rel;
    let cache = CACHE[self.typeId];
    if(cache.skip === 0) {
      self.load();
    }
    self.ref.fn.list = cache.type;
    self.ref.fn.sort = cache.sort;
    self.ref.waterFall.pause = !self.visible || self.typeId !== 3;
    self.ref.waterFall.checkPool();
  }
  checkMore($window) {
    let self = this;
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
    let typeId = self.typeId;
    let cache = CACHE[typeId];
    if(cache.loading || cache.loadEnd) {
      return;
    }
    cache.loading = true;
    switch(typeId) {
      case 1:
        self.ref.playlist.message = '正在加载...';
        break;
      case 2:
        self.ref.videoList.message = '正在加载...';
        break;
      case 3:
        self.ref.waterFall.message = '正在加载...';
        break;
    }
    net.postJSON('/h5/author/itemList', { authorId: self.authorId, groupId: typeId, sort: cache.sort, skip: cache.skip, take, }, function(res) {
      if(res.success) {
        let data = res.data;
        cache.skip += take;
        cache.loadEnd = cache.skip >= data.Size;
        switch(typeId) {
          case 1:
            self.ref.playlist.appendData(data.data);
            self.ref.playlist.message = cache.loadEnd ? '已经到底了' : '';
            break;
          case 2:
            self.ref.videoList.appendData(data.data);
            self.ref.videoList.message = cache.loadEnd ? '已经到底了' : '';
            break;
          case 3:
            self.ref.waterFall.appendData(data.data);
            self.ref.waterFall.message = cache.loadEnd ? '已经到底了' : '';
            break;
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      cache.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      cache.loading = false;
    });
  }
  render() {
    return <div class={ 'work' + (this.visible ? '' : ' fn-hide') }>
      <ul class={ 'type' + (this.type && this.type.length > 1 ? '' : ' fn-hide') }
          onClick={ { li: this.clickType } }>
        {
          (this.typeId, this.type || []).map(function(item) {
            return <li class={ item.GroupID === this.typeId ? 'cur' : '' }
                       rel={ item.GroupID }>{ item.GroupName }</li>;
          }.bind(this))
        }
      </ul>
      <Fn ref="fn"/>
      <Playlist ref="playlist"
                @visible={ this.typeId === 1 }/>
      <VideoList ref="videoList"
                 @visible={ this.typeId === 2 }/>
      <WaterFall ref="waterFall"
                 pause={ !this.visible }
                 @visible={ this.typeId === 3 }/>
    </div>;
  }
}

export default Work;
