/**
 * Created by army8735 on 2017/12/24.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class Tag extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(tag, data) {
    let self = this;
    self.tag = tag;
    self.data = data;
    self.hasData = true;

    let hotPost = self.ref.hotPost;
    let imageView = self.ref.imageView;
    imageView.on('clickLike', function(sid) {
      hotPost.like(sid, function(res) {
        imageView.isLike = res.ISLike || res.State === 'likeWordsUser';
      });
    });
    jsBridge.on('back', function(e) {
      if(!imageView.isHide()) {
        e.preventDefault();
        imageView.hide();
      }
    });

    if(data.Size > take) {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }
  }
  checkMore($window) {
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(!loading && !loadEnd && bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/tag/list', { skip, take, tag: self.tag }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.appendData(data.data);
        if(!data.data.length || data.data.length < take) {
          loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
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
  genDom() {
    let self = this;
    return <div>
      <h3>#{ self.tag }#</h3>
      <HotPost ref="hotPost" dataList={ self.data.data }/>
      <ImageView ref="imageView"/>
    </div>;
  }
  render() {
    return <div class="tag">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Tag;
