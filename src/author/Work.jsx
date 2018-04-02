/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
// import Playlist from '../component/playlist/Playlist.jsx';
import VideoList from './VideoList.jsx';
import AudioList from './AudioList.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import Select from '../component/select/Select.jsx';

const CACHE = {};

class Work extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.on(migi.Event.DATA, function(k) {
      if(k === 'visible') {
        self.ref.waterFall.pause = !self.visible || self.groupId !== 3;
        self.ref.waterFall.checkPool();
      }
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    });
  }
  @bind visible
  @bind kind
  @bind kindList
  // @bind authorId
  setData(kindList, kindWork) {
    let self = this;
    self.kindList = kindList;
    kindList.forEach(function(item) {
      CACHE[item.kind] = {
        offset: 0,
      };
    });
    self.kind = kindList[0].kind;
    self.ref.select.list = kindList[0].professionList.map(function(item) {
      return {
        id: item.id,
        name: item.name,
      }
    });
    let cache = CACHE[self.kind];
    switch(self.kind) {
      case 1:
        cache.limit = kindWork.limit;
        cache.offset += kindWork.limit;
        self.ref.videoList.setData(kindWork.data);
        if(kindWork.size <= kindWork.limit) {
          cache.loadEnd = true;
          self.ref.videoList.message = '已经到底了';
        }
        break;
      case 2:
        cache.limit = kindWork.limit;
        cache.offset += kindWork.limit;
        self.ref.audioList.setData(kindWork.data);
        if(cache.offset >= kindWork.size) {
          cache.loadEnd = true;
          self.ref.videoList.message = '已经到底了';
        }
        break;
    }
  }
  clickClass(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.kind) {
      return;
    }
    self.kind = tvd.props.rel;
    let cache = CACHE[self.kind];
    if(cache.offset === 0) {
      self.load();
    }
    // self.ref.fn.list = cache.type;
    // self.ref.fn.sort = cache.sort;
    // self.ref.waterFall.pause = !self.visible || self.groupId !== 3;
    // self.ref.waterFall.checkPool();
  }
  checkMore() {
    let self = this;
    let cache = CACHE[self.kind];
    if(!self.visible || cache.loading || cache.loadEnd) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let kind = self.kind;
    let cache = CACHE[kind];
    if(cache.loading || cache.loadEnd) {
      return;
    }
    cache.loading = true;
    switch(kind) {
      case 1:
        self.ref.videoList.message = '正在加载...';
        break;
      case 2:
        self.ref.audioList.message = '正在加载...';
        break;
    }
    if(cache.ajax) {
      cache.ajax.abort();
    }
    cache.ajax = net.postJSON('/h5/author2/kindWork', {
      authorId: self.authorId,
      kind,
      offset: cache.offset,
      limit: cache.limit }, function(res) {
      if(res.success) {
        let data = res.data;
        cache.limit = data.limit;
        cache.offset += data.limit;
        switch(kind) {
          case 1:
            if(cache.offset >= data.size) {
              cache.loadEnd = true;
              self.ref.videoList.message = '已经到底了';
            }
            self.ref.videoList.appendData(data.data);
            break;
          case 2:
            if(cache.offset >= data.size) {
              cache.loadEnd = true;
              self.ref.audioList.message = '已经到底了';
            }
            self.ref.audioList.appendData(data.data);
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
  fnSort(sort) {
    let self = this;
    let cache = CACHE[self.groupId];
    cache.offset = 0;
    cache.loading = false;
    cache.loadEnd = false;
    cache.sort = sort;
    if(cache.ajax) {
      cache.ajax.abort();
    }
    self.clear();
    self.load();
  }
  fnType(typeId) {
    let self = this;
    let cache = CACHE[self.groupId];
    cache.offset = 0;
    cache.loading = false;
    cache.loadEnd = false;
    cache.typeId = typeId;
    if(cache.ajax) {
      cache.ajax.abort();
    }
    self.clear();
    self.load();
  }
  clear() {
    let self = this;
    switch(self.groupId) {
      case 1:
        self.ref.playlist.clearData();
        break;
      case 2:
        self.ref.videoList.clearData();
        break;
      case 3:
        self.ref.waterFall.clearData();
        break;
    }
  }
  render() {
    return <div class={ 'work' + (this.visible ? '' : ' fn-hide') }>
      <ul class={ 'group' + (this.kind ? '' : ' fn-hide') }
          onClick={ { li: this.clickClass } }>
        {
          (this.kind, this.kindList || []).map(function(item) {
            return <li class={ item.kind === this.kind ? 'cur' : '' }
                       rel={ item.kind }>{ item.name }</li>;
          }.bind(this))
        }
      </ul>
      <Select ref="select"
          on-sort={ this.fnSort }
          on-type={ this.fnType }/>
      <VideoList ref="videoList"
                 @visible={ this.kind === 1 }/>
      <AudioList ref="audioList"
                 @visible={ this.kind === 2 }/>
      <WaterFall ref="waterFall"
                 profession={ true }
                 pause={ !this.visible }
                 @visible={ this.kind === 3 }/>
    </div>;
  }
}

export default Work;
