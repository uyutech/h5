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
          let $window = $(window);
          let $type = $(self.ref.type.element);
          let WIN_HEIGHT = $window.height();
          let show;
          $window.on('scroll', function() {
            if(show) {
              return;
            }
            let HEIGHT = $(document.body).height();
            let bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
            if(bool) {
              $type.removeClass('fn-hide');
              show = true;
              self.ref.hotPlayList.hasData = true;
            }
          });
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

    self.ref.banner.dataList = data.banner;
    self.ref.banner.hasData = true;

    self.ref.hotCircle.dataList = data.hotCircleList;
    self.ref.hotCircle.hasData = true;

    self.ref.hotWork.dataList = data.hotWorkList;
    self.ref.hotWork.hasData = true;
    $(self.ref.changeWork.element).removeClass('fn-hide');

    self.ref.hotMusiceAlbum.dataList = data.hotMusicAlbumList;
    self.ref.hotMusiceAlbum.hasData = true;

    self.ref.hotAuthor.dataList = data.hotAuthorList;
    self.ref.hotAuthor.hasData = true;

    self.ref.hotPlayList.dataList = data.hotPlayList.data;

    self.hasData = true;
  }
  clickChangeWork() {
    let self = this;
    net.postJSON('/h5/find/hotWorkList', function(res) {
      if(res.success) {
        self.ref.hotWork.dataList = (res.data);
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class={ 'find' + (this.hasData ? ' hasData' : '') }>
      <Banner ref="banner"/>
      <h4>热门圈子</h4>
      <HotCircle ref="hotCircle"/>
      <h4>热门作品<small ref="changeWork" onClick={ this.clickChangeWork }>换一换</small></h4>
      <HotWork ref="hotWork"/>
      <h4>热门专辑</h4>
      <HotMusiceAlbum ref="hotMusiceAlbum"/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor"/>
      <ul class="type fn-clear fn-hide" ref="type" onClick={ { li: this.clickType } }>
        <li class="ma cur">音乐</li>
        <li class="pic">美图</li>
      </ul>
      <HotPlayList ref="hotPlayList"/>
    </div>;
  }
}

export default Find;
