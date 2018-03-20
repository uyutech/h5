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
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canBlock: true,
          canShare: true,
          canShareWb: true,
          canShareLink: true,
          clickBlock: function(botFn) {
            self.block(self.circleId, function() {
              jsBridge.toast('屏蔽成功');
              botFn.cancel();
            });
          },
          clickShareWb: function() {
            let url = window.ROOT_DOMAIN + '/circle/' + self.circleId;
            let text = '来转转【' + self.circleName + '】圈吧~ 每天转转圈，玩转每个圈~';
            text += ' #转圈circling# ';
            text += url;
            jsBridge.shareWb({
              text,
            }, function(res) {
              if(res.success) {
                jsBridge.toast("分享成功");
              }
              else if(res.cancel) {
                jsBridge.toast("取消分享");
              }
              else {
                jsBridge.toast("分享失败");
              }
            });
          },
          clickShareLink: function() {
            util.setClipboard(window.ROOT_DOMAIN + '/circle/' + self.circleId);
          },
        });
      });
    });
  }
  @bind circleId
  @bind circleName
  setData(circleId, data) {
    let self = this;
    self.circleId = circleId;
    self.circleName = data.circleDetail.TagName;

    let title = self.ref.title;
    title.cover = data.circleDetail.TagCover;
    title.sname = data.circleDetail.TagName;
    title.id = data.circleDetail.TagID;
    title.desc = data.circleDetail.Describe;
    title.joined = data.circleDetail.ISLike;
    title.count = data.circleDetail.Popular;

    if(data.postList.Size > take) {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
    }

    let hotPost = self.ref.hotPost;
    hotPost.setData(data.postList.data);
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
      if(e.data && e.data.type === 'subPost') {
        self.ref.hotPost.prependData(e.data.data);
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
    net.postJSON('/h5/circle/postList', { circleID: self.circleId, skip, take }, function(res) {
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
    let self = this;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      clickBlock: function(botFn) {
        self.block(self.circleId, function() {
          jsBridge.toast('屏蔽成功');
          botFn.cancel();
        });
      },
      clickShareWb: function() {
        let url = window.ROOT_DOMAIN + '/circle/' + self.circleId;
        let text = '来转转【' + self.circleName + '】圈吧~ 每天转转圈，玩转每个圈~';
        text += ' #转圈circling# ';
        text += url;
        jsBridge.shareWb({
          text,
        }, function(res) {
          if(res.success) {
            jsBridge.toast("分享成功");
          }
          else if(res.cancel) {
            jsBridge.toast("取消分享");
          }
          else {
            jsBridge.toast("分享失败");
          }
        });
      },
      clickShareLink: function() {
        util.setClipboard(window.ROOT_DOMAIN + '/circle/' + self.circleId);
      },
    });
  }
  comment() {
    let self = this;
    if(!self.circleId) {
      return;
    }
    jsBridge.pushWindow('/subpost.html?circleId=' + self.circleId, {
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
  render() {
    return <div class="circle">
      <Title ref="title"/>
      <HotPost ref="hotPost"
               message={ '正在加载...' }/>
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
