/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPlayList from '../component/hotplaylist/HotPlayList.jsx';
import HotPic from '../component/hotpic/HotPic.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';

let take = 20;
let take2 = 10;
let take3 = 10;
let skip = take;
let skip2 = take2;
let skip3 = take3;
let loading;
let loading2;
let loading3;
let loadEnd;
let loadEnd2;
let loadEnd3;
let tag;

class MyFavor extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(data) {
    let self = this;

    self.favorMV = data.favorMV;
    self.favorPic = data.favorPic;
    self.favorPost = data.favorPost;

    loadEnd = self.favorMV.Size <= take;
    loadEnd2 = self.favorPic.Size <= take2;
    loadEnd3 = self.favorPost.Size <= take3;

    self.hasData = true;

    let $window = $(window);
    if(!loadEnd || !loadEnd2 || !loadEnd3) {
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      self.checkMore($window);
    }
  }
  checkMore($window) {
    let self = this;
    if(tag === 'pic') {
      if(loading2 || loadEnd2) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load2();
      }
    }
    else if(tag === 'post') {
      if(loading3 || loadEnd3) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load3();
      }
    }
    else {
      if(loading || loadEnd) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load();
      }
    }
  }
  load() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    let hotPlayList = self.ref.hotPlayList;
    loading = true;
    hotPlayList.message = '正在加载...';
    net.postJSON('/h5/my/favor', { skip, take }, function(res) {
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
    let hotPic = self.ref.hotPic;
    loading2 = true;
    hotPic.message = '正在加载...';
    net.postJSON('/h5/my/favorPic', { skip: skip2, take: take2 }, function(res) {
      if(res.success) {
        let data = res.data;
        skip2 += take2;
        hotPic.appendData(data.data);
        if(skip2 >= data.Size) {
          loadEnd2 = true;
          hotPic.message = '已经到底了';
        }
        else {
          hotPic.message = '正在渲染图片';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading2 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading2 = false;
    });
  }
  load3() {
    let self = this;
    if(loading3) {
      return;
    }
    loading = true;
    let hotPost = self.ref.hotPost;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/my/favorPost', { skip: skip3, take: take3 }, function(res) {
      if(res.success) {
        let data = res.data;
        skip3 += take3;
        hotPost.appendData(data.data);
        if(skip3 >= data.Size) {
          loadEnd3 = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading3 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading3 = false;
    });
  }
  click(e, vd, tvd) {
    let $t = $(tvd.element);
    if(!$t.hasClass('cur')) {
      let self = this;
      $(vd.element).find('.cur').removeClass('cur');
      $t.addClass('cur');
      let type = tag = tvd.props.rel;
      let hotPlayList = self.ref.hotPlayList;
      let hotPic = self.ref.hotPic;
      let hotPost = self.ref.hotPost;
      if(type === 'mv') {
        hotPic && hotPic.hide();
        hotPost && hotPost.hide();
        hotPlayList && hotPlayList.show();
      }
      else if(type === 'pic') {
        self.addPic();
        hotPlayList && hotPlayList.hide();
        hotPost && hotPost.hide();
        hotPic && hotPic.show();
      }
      else if(type === 'post') {
        self.addPost();
        hotPlayList && hotPlayList.hide();
        hotPic && hotPic.hide();
        hotPost && hotPost.show();
      }
    }
  }
  addPic() {
    let self = this;
    if(!self.ref.hotPic) {
      let hotPic = self.ref.hotPic = migi.render(
        <HotPic ref="hotPic"
                dataList={ self.favorPic.data }
                message={ self.favorPic.Size ? '正在渲染图片' : '暂无数据' }/>
      );
      self.ref.hotPic.after(self.ref.type.element);
      hotPic.on('poolEnd', function() {
        if(self.favorPic.Size > 2) {
          hotPic.message = skip2 >= self.favorPic.Size ? '已经到底了' : '';
        }
        else {
          hotPic.message = '';
        }
      });
    }
  }
  addPost() {
    let self = this;
    if(!self.ref.hotPost) {
      let message = '';
      if(!self.favorPost.Size) {
        message = '暂无数据';
      }
      else if(self.favorPost.Size <= take3 && self.favorPost.Size > 3) {
        message = '已经到底了';
      }
      let hotPost = self.ref.hotPost = migi.render(
        <HotPost ref="hotPost"
                 message={ message }
                 dataList={ self.favorPost.data }/>
      );
      hotPost.after(self.ref.type.element);
    }
  }
  genDom() {
    let self = this;
    return <div>
      <ul class="type" ref="type" onClick={ { span: this.click } }>
        <li><span class="cur" rel="mv">我收藏的音乐</span></li>
        <li><span rel="pic">我收藏的图片</span></li>
        <li><span rel="post">我收藏的画圈</span></li>
      </ul>
      <HotPlayList ref="hotPlayList"
                   message={ self.favorMV.Size ? '' : '暂无数据' }
                   dataList={ self.favorMV.data }/>
    </div>;
  }
  render() {
    return <div class="myfavor">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default MyFavor;
