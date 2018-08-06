/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import Playlist from '../component/playlist/Playlist.jsx';
import VideoList from '../component/videolist/VideoList.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import SkillWorks from './SkillWorks.jsx';

const CACHE = {};

class Work extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.kind = 0;
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
  @bind showAll
  // @bind id
  setData(kindList, skillWorksData, authorId) {
    let self = this;
    if(kindList[0] && kindList[0].kind === 0) {
      kindList.splice(0, 1);
    }
    self.kindList = kindList;
    kindList.forEach(function(item) {
      CACHE[item.kind] = {
        offset: 0,
      };
    });
    if(skillWorksData && skillWorksData.length) {
      this.showAll = true;
    }
    else {
      this.showAll = false;
      this.kind = kindList[0].kind;
      this.id = authorId;
      this.load();
    }
    let skillWorks = self.ref.skillWorks;
    if(skillWorksData && skillWorksData.length) {
      skillWorks.authorId = authorId;
      skillWorks.list = skillWorksData;
    }
    else {
      skillWorks.list = null;
    }
  }
  clickClass(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.kind) {
      return;
    }
    self.kind = tvd.props.rel;
    let cache = CACHE[self.kind];
    if(cache && cache.offset === 0) {
      self.load();
    }
  }
  checkMore() {
    let self = this;
    let cache = CACHE[self.kind];
    if(!self.visible || cache.loading || cache.loadEnd) {
      return;
    }
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let kind = self.kind;
    let cache = CACHE[kind];
    cache.loading = true;
    if(cache.ajax) {
      cache.ajax.abort();
    }
    cache.ajax = $net.postJSON('/h5/author/kindWorkList', {
      id: self.id,
      kind,
      offset: cache.offset,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        cache.limit = data.limit;
        cache.offset += data.limit;
        switch(kind) {
          case 1:
            if(cache.offset >= data.count) {
              cache.loadEnd = true;
              self.ref.videoList.message = '已经到底了';
            }
            self.ref.videoList.appendData(data.data);
            break;
          case 2:
            if(cache.offset >= data.count) {
              cache.loadEnd = true;
              self.ref.playlist.message = '已经到底了';
            }
            self.ref.playlist.appendData(data.data);
            break;
          case 3:
            if(cache.offset >= data.count) {
              cache.loadEnd = true;
              self.ref.waterFall.message = '已经到底了';
            }
            self.ref.waterFall.appendData(data.data);
            break;
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      cache.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      cache.loading = false;
    });
  }
  change(data) {
    let work = data.work;
    work.worksId = data.id;
    work.worksCover = data.cover;
    work.worksTitle = data.title;
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
    return <div class={ 'mod-work' + (this.visible ? '' : ' fn-hide') }>
      <ul class="group"
          onClick={ { li: this.clickClass } }>
        <li class={ (this.showAll ? '' : 'fn-hide ') + (0 === this.kind ? 'cur' : '') }
            rel={ 0 }>全部</li>
        {
          (this.kind, this.kindList || []).map(function(item) {
            return <li class={ item.kind === this.kind ? 'cur' : '' }
                       rel={ item.kind }>{ item.name }</li>;
          }.bind(this))
        }
      </ul>
      <SkillWorks ref="skillWorks"
                  @visible={ this.kind === 0 }/>
      <VideoList ref="videoList"
                 profession={ true }
                 message="正在加载..."
                 @visible={ this.kind === 1 }/>
      <Playlist ref="playlist"
                profession={ true }
                message="正在加载..."
                on-change={ this.change }
                @visible={ this.kind === 2 }/>
      <WaterFall ref="waterFall"
                 profession={ true }
                 message="正在加载..."
                 @visible={ this.kind === 3 }/>
    </div>;
  }
}

export default Work;
