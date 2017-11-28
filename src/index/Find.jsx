/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import util from '../common/util';
import HotCircle from '../component/hotcircle/HotCircle.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotMusiceAlbum from '../component/hotmusicalbum/HotMusicAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';

let take = 10;
let skip = take;

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind loading
  @bind loadEnd
  setData(data) {
    let self = this;

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

    self.ref.hotPost.hasData = true;
    self.ref.hotPost.data = !!data.hotPostList.length;
    self.ref.hotPost.setData(data.hotPostList);

    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
  }
  checkMore($window) {
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(!self.loading && !self.loadEnd && bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let hotPost = self.ref.hotPost;
    self.loading = true;
    hotPost.message = '正在加载...';
    util.postJSON('/api/find/hotPostList', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.setData(data.data);
        if(!data.data.length || data.data.length < take) {
          self.loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
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
  render() {
    return <div class="find">
      <h4>热门圈子</h4>
      <HotCircle ref="hotCircle"/>
      <h4>热门作品</h4>
      <HotWork ref="hotWork"/>
      <h4>热门专辑</h4>
      <HotMusiceAlbum ref="hotMusiceAlbum"/>
      <h4>入驻作者</h4>
      <HotAuthor ref="hotAuthor"/>
      <h4>转圈</h4>
      <HotPost ref="hotPost"/>
    </div>;
  }
}

export default Find;
