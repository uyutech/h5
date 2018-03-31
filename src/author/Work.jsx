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
  @bind klass
  @bind classList
  // @bind authorId
  setData(classList, list) {
    let self = this;
    self.classList = classList;
    classList.forEach(function(item) {
      CACHE[item.klass] = {
        skip: 0,
      };
    });
    self.klass = classList[0].klass;
    self.ref.select.list = classList[0].professionList.map(function(item) {
      return {
        id: item.class,
        name: item.kindName,
      }
    });
    let cache = CACHE[self.klass];
    switch(self.klass) {
      case 1:
        cache.take = list.take;
        cache.skip += list.take;
        self.ref.videoList.setData(list.data);
        if(list.size <= list.take) {
          cache.loadEnd = true;
          self.ref.videoList.message = '已经到底了';
        }
        break;
      case 2:
        cache.take = list.take;
        cache.skip += list.take;
        self.ref.audioList.setData(list.data);
        if(cache.skip >= list.size) {
          cache.loadEnd = true;
          self.ref.videoList.message = '已经到底了';
        }
        break;
    }
  }
  clickClass(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.klass) {
      return;
    }
    self.klass = tvd.props.rel;
    let cache = CACHE[self.klass];
    if(cache.skip === 0) {
      self.load();
    }
    // self.ref.fn.list = cache.type;
    // self.ref.fn.sort = cache.sort;
    // self.ref.waterFall.pause = !self.visible || self.groupId !== 3;
    // self.ref.waterFall.checkPool();
  }
  checkMore() {
    let self = this;
    let cache = CACHE[self.klass];
    if(!self.visible || cache.loading || cache.loadEnd) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let klass = self.klass;
    let cache = CACHE[klass];
    if(cache.loading || cache.loadEnd) {
      return;
    }
    cache.loading = true;
    switch(klass) {
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
    cache.ajax = net.postJSON('/h5/author2/classWork', {
      authorId: self.authorId,
      klass,
      skip: cache.skip,
      take: cache.take }, function(res) {
      if(res.success) {
        let data = res.data;
        cache.take = data.take;
        cache.skip += data.take;
        switch(klass) {
          case 1:
            if(cache.skip >= data.size) {
              cache.loadEnd = true;
              self.ref.videoList.message = '已经到底了';
            }
            self.ref.videoList.appendData(data.data);
            break;
          case 2:
            if(cache.skip >= data.size) {
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
    cache.skip = 0;
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
    cache.skip = 0;
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
      <ul class={ 'group' + (this.klass ? '' : ' fn-hide') }
          onClick={ { li: this.clickClass } }>
        {
          (this.klass, this.classList || []).map(function(item) {
            return <li class={ item.klass === this.klass ? 'cur' : '' }
                       rel={ item.klass }>{ item.name }</li>;
          }.bind(this))
        }
      </ul>
      <Select ref="select"
          on-sort={ this.fnSort }
          on-type={ this.fnType }/>
      <VideoList ref="videoList"
                 @visible={ this.klass === 1 }/>
      <AudioList ref="audioList"
                 @visible={ this.klass === 2 }/>
      <WaterFall ref="waterFall"
                 profession={ true }
                 pause={ !this.visible }
                 @visible={ this.klass === 3 }/>
    </div>;
  }
}

export default Work;
