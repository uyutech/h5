/**
 * Created by army8735 on 2017/11/28.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Banner from './Banner.jsx';
import HotCircle from '../component/hotcircle/HotCircle.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotMusiceAlbum from '../component/hotmusicalbum/HotMusicAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import HotPlayList from '../component/hotplaylist/HotPlayList.jsx';

let take = 10;
let skip = take;

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

    self.hasData = true;
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
  genDom() {
    let self = this;
    return <div>
      <Banner ref="banner" dataList={ self.bannerList }/>
      <h4>热门圈子</h4>
      <HotCircle ref="hotCircle" dataList={ self.hotCircleList }/>
      <h4>热门作品<small ref="changeWork" onClick={ self.clickChangeWork }>换一换</small></h4>
      <HotWork ref="hotWork" dataList={ self.hotWorkList }/>
      <h4>热门专辑</h4>
      <HotMusiceAlbum ref="hotMusiceAlbum" dataList={ self.hotMusicAlbumList }/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor" dataList={ self.hotAuthorList }/>
      <ul class="type fn-clear" ref="type" onClick={ { li: self.clickType } }>
        <li class="ma cur">音乐</li>
        <li class="pic">美图</li>
      </ul>
      <HotPlayList ref="hotPlayList" dataList={ self.hotPlayList.data }/>
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
