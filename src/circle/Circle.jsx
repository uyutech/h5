/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Title from './Title.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';
import SubCmt from '../component/subcmt/SubCmt.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class Circle extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind circleID
  setData(circleID, data) {
    let self = this;
    self.circleID = circleID;

    self.circleDetail = data.circleDetail;
    self.postList = data.postList;

    self.hasData = true;

    if(self.postList.Size > take) {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }

    let hotPost = self.ref.hotPost;
    let imageView = self.ref.imageView;
    imageView.on('clickLike', function(sid) {
      hotPost.like(sid, function(res) {
        imageView.isLike = res.ISLike;
      });
    });
    let subCmt = self.ref.subCmt;
    subCmt.on('click', function() {
      jsBridge.pushWindow('/subpost.html?circleID=' + self.circleID, {
        title: '画个圈',
      });
    });
    jsBridge.on('back', function(e) {
      if(!imageView.isHide()) {
        e.preventDefault();
        imageView.hide();
      }
    });
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = !$(self.element).hasClass('fn-hide') && $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/circle/postList', { circleID: self.circleID, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(data.data.length) {
          hotPost.appendData(data.data);
        }
        if(skip >= data.Size) {
          loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
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
      <Title ref="title"
             circleDetail={ self.circleDetail }/>
      <HotPost ref="hotPost"
               dataList={ self.postList.data }
               message={ self.postList.Size > take ? '' : '已经到底了' }/>
      <SubCmt ref="subCmt"
              tipText="-${n}"
              subText="发送"
              readOnly={ true }
              placeholder={ '在' + self.circleDetail.TagName +'圈画个圈吧。小小的提示：现在可以把一个圈画在好几个圈子里哦！' }/>
      <ImageView ref="imageView"/>
    </div>;
  }
  render() {
    return <div class="circle">
      {
        this.hasData
        ? this.genDom()
        : <div>
            <div class="fn-placeholder-pic"/>
            <div class="fn-placeholder"/>
            <div class="fn-placeholder"/>
          </div>
      }
    </div>;
  }
}

export default Circle;
