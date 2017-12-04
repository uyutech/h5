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

let take = 10;
let skip = take;

let type;
let hotPlayList;
let hotPic;

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
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
  }
  hide() {
    $(this.element).addClass('fn-hide');
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
    let show;
    $window.on('scroll', onScroll);
    function onScroll() {
      if(show) {
        return;
      }
      let HEIGHT = $(document.body).height();
      let bool = $window.scrollTop() + WIN_HEIGHT + 20 > HEIGHT;
      if(bool) {
        show = true;
        $window.off('scroll', onScroll);
        let p1 = self.ref.p1;
        type = migi.render(
          <ul class="type fn-clear" ref="type" onClick={ { li: self.clickType.bind(self) } }>
            <li class="ma cur" rel="ma">音乐</li>
            <li class="pic" rel="pic">美图</li>
          </ul>
        );
        type.before(p1.element);
        hotPlayList = migi.render(
          <HotPlayList ref="hotPlayList" dataList={ self.hotPlayList.data }/>
        );
        hotPlayList.before(p1.element);
        p1.clean();
        self.ref.p2.clean();
      }
    }
  }
  clickChangeWork() {
    let self = this;
    net.postJSON('/h5/find/hotWorkList', function(res) {
      if(res.success) {
        self.ref.hotWork.dataList = res.data;
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
    });
  }
  clickType(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      let self = this;
      $(vd.element).find('li').toggleClass('cur');
      let rel = tvd.props.rel;
      if(rel === 'ma') {
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
            hotPic.message = '';
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
      <HotCircle ref="hotCircle" dataList={ self.hotCircleList }/>
      <h4>热门作品<small ref="changeWork" onClick={ self.clickChangeWork }>换一换</small></h4>
      <HotWork ref="hotWork" dataList={ self.hotWorkList }/>
      <h4>热门专辑</h4>
      <HotMusicAlbum ref="hotMusicAlbum" dataList={ self.hotMusicAlbumList }/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor" dataList={ self.hotAuthorList }/>
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
