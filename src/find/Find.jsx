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
  @bind loading
  @bind loadEnd
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  setData(data) {
    let self = this;

    self.ref.banner.dataList = data.banner;
    self.ref.banner.hasData = true;

    self.ref.hotCircle.dataList = data.hotCircleList;
    self.ref.hotCircle.hasData = true;
    self.ref.hotCircle.autoWidth();

    self.ref.hotWork.dataList = data.hotWorkList;
    self.ref.hotWork.hasData = true;
    self.ref.hotWork.autoWidth();

    self.ref.hotMusiceAlbum.dataList = data.hotMusicAlbumList;
    self.ref.hotMusiceAlbum.hasData = true;
    self.ref.hotMusiceAlbum.autoWidth();

    self.ref.hotAuthor.dataList = data.hotAuthorList;
    self.ref.hotAuthor.hasData = true;
    self.ref.hotAuthor.autoWidth();

    self.ref.hotPlayList.dataList = data.hotPlayList.data;
    self.ref.hotPlayList.hasData = true;
  }
  clickChangeWork() {
    let self = this;
    net.postJSON('/h5/find/hotWorkList', function(res) {
      if(res.success) {
        self.ref.hotWork.setData(res.data);
        self.ref.hotWork.hasData = true;
        self.ref.hotWork.autoWidth();
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="find">
      <Banner ref="banner"/>
      <h4>热门圈子</h4>
      <HotCircle ref="hotCircle"/>
      <h4>热门作品<small onClick={ this.clickChangeWork }>换一换</small></h4>
      <HotWork ref="hotWork"/>
      <h4>热门专辑</h4>
      <HotMusiceAlbum ref="hotMusiceAlbum"/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor"/>
      <ul class="type fn-clear" ref="type" onClick={ { li: this.clickType } }>
        <li class="ma cur">音乐</li>
        <li class="pic">美图</li>
      </ul>
      <HotPlayList ref="hotPlayList"/>
    </div>;
  }
}

export default Find;
