/**
 * Created by army8735 on 2018/1/12.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';

import Banner from './Banner.jsx';
import Works from './Works.jsx';
import Post from './Post.jsx';
import WorksList from './WorksList.jsx';
import AuthorList from './AuthorList.jsx';
import TagList from './TagList.jsx';
import Fn from './Fn.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import VideoList from './VideoList.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';

class ItemList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.first = true;
    self.take = 20;
    self.skip = 0;
  }
  @bind hasData
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(this.scrollY);
    this.visible = true;
    if(this.first) {
      this.first = false;
      this.load();
    }
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    this.visible = false;
    return this;
  }
  load() {
    let self = this;
    let tag = self.props.tag;
    let id = tag.ID;
    let skip = self.skip;
    let take = self.take;
    net.postJSON('/h5/find/typeList', { id, skip, take }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  loadMore() {
    let self = this;
    if(self.loading || self.loadEnd) {
      return;
    }
    self.loading = true;
    let tag = self.props.tag;
    let videoList;
    let playlist;
    let waterFall;
    switch(tag.ID) {
      case 2:
        videoList = self.ref.videoList;
        videoList.message = '正在加载...';
        break;
      case 3:
        playlist = self.ref.playlist;
        playlist.message = '正在加载...';
        break;
      case 4:
        waterFall = self.ref.waterFall;
        waterFall.message = '正在加载...';
        break;
    }
    if(self.ajax) {
      self.ajax.abort();
    }
    let groupID = self.groupID;
    let typeID = self.typeID;
    let sort = self.sort;
    let skip = self.skip;
    let take = self.take;
    self.ajax = net.postJSON('/h5/find/itemList', { groupID, typeID, sort, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        self.skip += self.take;
        if(self.skip >= data.Size) {
          self.loadEnd = true;
        }
        switch(tag.ID) {
          case 2:
            videoList.appendData(data.data);
            videoList.message = self.loadEnd ? '已经到底了' : '';
            break;
          case 3:
            playlist.appendData(data.data);
            playlist.message = self.loadEnd ? '已经到底了' : '';
            break;
          case 4:
            waterFall.appendData(data.data);
            waterFall.message = self.loadEnd ? '已经到底了' : '';
            break;
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      self.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  reset() {
    let self = this;
    self.skip = 0;
    self.loadEnd = false;
    self.loading = false;
    let tag = self.props.tag;
    switch(tag.ID) {
      case 2:
        self.ref.videoList.clearData();
        break;
      case 3:
        self.ref.playlist.clearData();
        break;
      case 4:
        self.ref.waterFall.clearData();
        break;
    }
  }
  reload() {
    this.reset();
    this.loadMore();
  }
  setData(data) {
    let self = this;
    self.bannerList = data.bannerList;
    self.dataList = data.dataList;
    self.typeList = data.typeList;
    self.itemList = data.itemList || {};
    self.hasData = true;

    let list = self.ref.list;
    let arr = (data.dataList.data || []);
    arr.forEach(function(item) {
      let cp = self.genItem(item);
      if(cp) {
        cp.appendTo(list.element);
      }
    });

    if(self.typeList && self.typeList.length) {
      self.groupID = self.typeList[0].GroupID;
    }

    let tagList = self.ref.tagList;
    if(tagList) {
      tagList.on('change', function(v) {
        self.typeID = null;
        self.groupID = v.GroupID;
        fn.list = v.itemsTypeList;
        self.reset();
        self.loadMore();
      });
    }

    let fn = self.ref.fn;
    if(fn) {
      fn.on('sort', function(v) {
        self.sort = v;
        self.reset();
        self.loadMore();
      });
      fn.on('type', function(v) {
        self.typeID = v;
        self.reset();
        self.loadMore();
      });
    }

    let $window = $(window);
    let WIN_HEIGHT = $window.height();
    $window.on('scroll', function() {
      if(!self.visible) {
        return;
      }
      self.scrollY = $window.scrollTop();
      if(!self.itemList.Size || self.itemList.Size <= self.take) {
        return;
      }
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.loadMore();
      }
    });
  }
  genItem(item) {
    let type = item.Level + ',' + item.urltype;
    switch(type) {
      case '1,1':
        if(item.worklist.length) {
          return <Works data={ item }/>;
        }
        break;
      case '1,2':
        if(item.commentlist.length) {
          return <Post data={ item }/>;
        }
        break;
      case '2,1':
        if(item.worklist.length) {
          return <WorksList data={ item }/>;
        }
        break;
      case '2,3':
        if(item.authorlist.length) {
          return <AuthorList data={ item }/>;
        }
        break;
    }
  }
  genDom() {
    let self = this;
    let tag = self.props.tag;
    return <div>
      {
        self.bannerList.length
          ? <Banner dataList={ self.bannerList }/>
          : ''
      }
      <div ref="list"/>
      {
        self.typeList.length && self.typeList.length > 1
          ? <TagList ref="tagList" dataList={ self.typeList }/>
          : ''
      }
      {
        self.typeList.length || (self.typeList[0] || {}).itemsTypeList
          ? <Fn ref="fn" list={ (self.typeList[0] || {}).itemsTypeList }/>
          : ''
      }
      {
        self.itemList.data && self.itemList.data.length
          ? {
              2: <VideoList ref="videoList" dataList={ self.itemList.data }/>,
              3: <Playlist ref="playlist" dataList={ self.itemList.data }/>,
              4: <WaterFall ref="waterFall"
                            dataList={ self.itemList.data }
                            visible={ true }/>
            }[tag.ID]
          : ''
      }
    </div>;
  }
  render() {
    return <div class="fn-hide">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder-pic"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-squares"/>
            </div>
      }
    </div>;
  }
}

export default ItemList;
