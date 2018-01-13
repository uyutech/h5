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

let visible;
let scrollY = 0;
let take = 10;
let skip = take;
let groupID;
let typeID;
let sort;
let loading;
let loadEnd;
let ajax;

class ItemList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.first = true;
  }
  @bind hasData
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
    if(this.first) {
      this.first = false;
      this.load();
    }
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
    return this;
  }
  load() {
    let self = this;
    let tag = self.props.tag;
    let id = tag.ID;
    net.postJSON('/h5/find/typeList', { id }, function(res) {
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
    if(loading || loadEnd) {
      return;
    }
    loading = true;
    let self = this;
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
      case 5:
        waterFall = self.ref.waterFall;
        waterFall.message = '正在加载...';
        break;
    }
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/find/itemList', { groupID, typeID, sort, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
        }
        switch(tag.ID) {
          case 2:
            videoList.appendData(data.data);
            videoList.message = loadEnd ? '已经到底了' : '';
            break;
          case 3:
            playlist.appendData(data.data);
            playlist.message = loadEnd ? '已经到底了' : '';
            break;
          case 5:
            waterFall.appendData(data.data);
            waterFall.message = loadEnd ? '已经到底了' : '';
            break;
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  reset() {
    skip = 0;
    loadEnd = false;
    loading = false;
    let self = this;
    let tag = self.props.tag;
    switch(tag.ID) {
      case 2:
        self.ref.videoList.clearData();
        break;
      case 3:
        self.ref.playlist.clearData();
        break;
      case 5:
        self.ref.waterFall.clearData();
        break;
    }
  }
  setData(data) {
    let self = this;
    self.bannerList = data.bannerList;
    self.dataList = data.dataList;
    self.typeList = data.typeList;
    self.itemList = data.itemList;
    self.hasData = true;

    let list = self.ref.list;
    let arr = (data.dataList.data || []);
    let length = arr.length;
    arr.forEach(function(item, i) {
      let cp = self.genItem(item, i === length - 1);
      if(cp) {
        cp.appendTo(list.element);
      }
    });

    if(self.typeList && self.typeList.length) {
      groupID = self.typeList[0].GroupID;
    }

    let tagList = self.ref.tagList;
    if(tagList) {
      tagList.on('change', function(v) {console.log(v);
        typeID = null;
        groupID = v.GroupID;
        fn.dataList = v.itemsTypeList;
        self.reset();
        self.loadMore();
      });
    }

    let fn = self.ref.fn;
    if(fn) {
      fn.on('sort', function(v) {
        sort = v;
        self.reset();
        self.loadMore();
      });
      fn.on('type', function(v) {
        typeID = v;
        self.reset();
        self.loadMore();
      });
    }

    if(!self.itemList.Size || self.itemList.Size <= take) {
      return;
    }
    let $window = $(window);
    let WIN_HEIGHT = $window.height();
    $window.on('scroll', function() {
      if(!visible) {
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
  genItem(item, last) {
    let type = item.Level + ',' + item.urltype;
    switch(type) {
      case '1,1':
        if(item.worklist.length) {
          return <Works data={ item } last={ last }/>;
        }
        break;
      case '1,2':
        if(item.commentlist.length) {
          return <Post data={ item } last={ last }/>;
        }
        break;
      case '2,1':
        if(item.worklist.length) {
          return <WorksList data={ item } last={ last }/>;
        }
        break;
      case '2,3':
        if(item.authorlist.length) {
          return <AuthorList data={ item } last={ last }/>;
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
        self.typeList.length
          ? <TagList ref="tagList" dataList={ self.typeList }/>
          : ''
      }
      <Fn ref="fn" dataList={ (self.typeList[0] || {}).itemsTypeList }/>
      {
        self.itemList.data.length
          ? {
              2: <VideoList ref="videoList" dataList={ self.itemList.data }/>,
              3: <Playlist ref="playlist" dataList={ self.itemList.data }/>,
              5: <WaterFall ref="waterFall" dataList={ self.itemList.data }/>
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
