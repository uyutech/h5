/**
 * Created by army8735 on 2017/11/28.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Banner from './Banner.jsx';
import HotCircle from '../component/hotcircle/HotCircle.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotMusicAlbum from '../component/hotmusicalbum/HotMusicAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import HotPlayList from '../component/hotplaylist/HotPlayList.jsx';
import HotPic from '../component/hotpic/HotPic.jsx';

let take = 30;
let skip = 10;
let take2 = 10;
let skip2 = 0;
let size2 = 0;
let loading;
let loadEnd;
let loading2;
let loadEnd2;
let cur = 'ma';
let type;
let hotPlayList;
let hotPic;
let visible;
let scrollY = 0;

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      net.postJSON('/h5/find/index', function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
  }
  setData(data) {
    let self = this;

    self.bannerList = data.banner;
    self.hotCircleList = data.hotCircleList;
    self.hotWorkList = data.hotWorkList;
    self.hotMusicAlbumList = data.hotMusicAlbumList;
    self.hotAuthorList = data.hotAuthorList;
    self.hotPlayList = data.hotPlayList;
    self.hotPhotoAlbumList = data.hotPhotoAlbumList;
    self.hotPicList = data.hotPicList;

    self.hasData = true;

    let $window = $(window);
    let WIN_HEIGHT = $window.height();
    let showType;
    $window.on('scroll', function() {
      if(showType) {
        if(!visible) {
          return;
        }
        if(cur === 'ma' && (loading || loadEnd)) {
          return;
        }
        if(cur === 'pic' && (loading2 || loadEnd2)) {
          return;
        }
        let WIN_HEIGHT = $window.height();
        let HEIGHT = $(document.body).height();
        scrollY = $window.scrollTop();
        let bool;
        bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
        if(bool) {
          if(cur === 'ma') {
            self.load();
          }
          else if(cur === 'pic') {
            self.load2();
          }
        }
      }
      else {
        let HEIGHT = $(document.body).height();
        scrollY = $window.scrollTop();
        let bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
        if(bool) {
          showType = true;
          let p1 = self.ref.p1;
          type = <ul class="type fn-clear" ref="type" onClick={ { li: self.clickType.bind(self) } }>
            <li class="ma cur" rel="ma">音乐</li>
            <li class="pic" rel="pic">美图</li>
          </ul>;
          type.before(p1.element);
          hotPlayList = <HotPlayList ref="hotPlayList"
                                     dataList={ self.hotPlayList.data }/>;
          hotPlayList.before(p1.element);
          p1.clean();
          self.ref.p2.clean();
        }
      }
    });
  }
  load() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    loading = true;
    hotPlayList.message = '正在加载...';
    net.postJSON('/h5/find/hotPlayList', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPlayList.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          hotPlayList.message = '已经到底了';
        }
        else {
          hotPlayList.message = '';
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
  load2() {
    let self = this;
    if(loading2 || loadEnd2) {
      return;
    }
    loading2 = true;
    hotPic.message = '正在加载...';
    net.postJSON('/h5/find/hotPicList', { skip: skip2, take: take2 }, function(res) {
      if(res.success) {
        let data = res.data;
        skip2 += take2;
        size2 = data.Size;
        if(data.data.length) {
          hotPic.appendData(data.data);
          hotPic.message = '正在渲染图片';
        }
        else {
          hotPic.message = skip2 >= data.Size ? '已经到底了' : '';
        }
        if(skip2 >= data.Size) {
          loadEnd2 = true;
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  clickChangeWork() {
    let self = this;
    net.postJSON('/h5/find/hotWorkList', { skip: 0, take: 10 }, function(res) {
      if(res.success) {
        self.ref.hotWork.dataList = res.data;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  clickType(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      let self = this;
      $(vd.element).find('li').toggleClass('cur');
      cur = tvd.props.rel;
      if(cur === 'ma') {
        hotPic.hide();
        hotPlayList.show();
      }
      else {
        if(!hotPic) {
          hotPic = migi.render(
            <HotPic ref="hotPic"
                    message="正在渲染图片..."
                    dataList={ self.hotPicList.data }/>
          );
          hotPic.on('poolEnd', function() {
            loading2 = false;
            hotPic.message = skip2 >= size2 ? '已经到底了' : '';
          });
          hotPic.after(hotPlayList.element);
        }
        hotPic.show();
        hotPlayList.hide();
      }
    }
  }
  genDom() {
    let self = this;
    return <div ref="root">
      <Banner ref="banner" dataList={ self.bannerList }/>
      <h4>热门圈子</h4>
      <HotCircle ref="hotCircle" dataList={ self.hotCircleList } more="/allcircles.html"/>
      <h4>热门作品<small ref="changeWork" onClick={ self.clickChangeWork.bind(self) }>换一换</small></h4>
      <HotWork ref="hotWork" dataList={ self.hotWorkList } more="/allworks.html"/>
      <h4>热门专辑</h4>
      <HotMusicAlbum ref="hotMusicAlbum" dataList={ self.hotMusicAlbumList.data } more="/allalbums.html"/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor" dataList={ self.hotAuthorList.data } more="/allauthors.html"/>
      <div class="fn-placeholder-tags" ref="p1"/>
      <div class="fn-placeholder" ref="p2"/>
    </div>;
  }
  render() {
    return <div class="find">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-circles"/>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-squares"/>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Find;
