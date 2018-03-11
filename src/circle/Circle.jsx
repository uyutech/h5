/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Title from './Title.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class Circle extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu({
        icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
      });
      jsBridge.on('optionMenu1', function() {console.log(1)
        migi.eventBus.emit('BOT_FN', {
          canBlock: true,
          clickBlock: function(botFn) {
            self.block(self.circleID, function() {
              jsBridge.toast('屏蔽成功');
              botFn.cancel();
            });
          },
        });
      });
    });
  }
  @bind hasData
  @bind circleID
  setData(circleID, data) {
    let self = this;
    self.circleID = circleID;

    self.circleDetail = data.circleDetail;
    self.stick = data.stick;
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
        imageView.isLike = res.ISLike || res.State === 'likeWordsUser';
      });
    });
    jsBridge.on('back', function(e) {
      if(!imageView.isHide()) {
        e.preventDefault();
        imageView.hide();
      }
    });
    jsBridge.on('resume', function(e) {
      if(e.data) {
        self.ref.hotPost.prependData(e.data);
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
  share() {
    migi.eventBus.emit('SHARE', '/circle/' + this.circleID);
  }
  comment() {
    let self = this;
    if(!self.circleID) {
      return;
    }
    jsBridge.pushWindow('/subpost.html?circleID=' + self.circleID, {
      title: '画个圈',
      optionMenu: '发布',
    });
  }
  block(id, cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    jsBridge.confirm('确认屏蔽吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/circle/shield', { circleID: id }, function(res) {
        if(res.success) {
          cb && cb();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  genDom() {
    let self = this;
    return <div>
      <Title ref="title"
             circleDetail={ self.circleDetail }/>
      {
        self.stick && self.stick.Size
          ? <HotPost dataList={ self.stick.data }/>
          : ''
      }
      <HotPost ref="hotPost"
               dataList={ self.postList.data }
               message={ self.postList.Size > take ? '' : '已经到底了' }/>
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
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <ImageView ref="imageView"/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Circle;
