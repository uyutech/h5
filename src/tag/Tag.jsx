/**
 * Created by army8735 on 2017/12/24.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import ImageView from '../post/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;

class Tag extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu({
        icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
      });
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canShare: true,
          canShareWb: true,
          canShareLink: true,
          clickShareWb: function() {
            let url = window.ROOT_DOMAIN + '/tag/' + encodeURIComponent(self.tag);
            let text = '聊一聊【' + self.tag + '】吧~ 每天转转圈，玩转每个圈~';
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
            util.setClipboard(window.ROOT_DOMAIN + '/tag/' + encodeURIComponent(self.tag));
          },
        });
      });
    });
  }
  @bind tag
  setData(tag, data) {
    let self = this;
    self.tag = tag;

    let hotPost = self.ref.hotPost;
    hotPost.setData(data.data || []);
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
  comment() {
    jsBridge.pushWindow('/subpost.html?tag=' + encodeURIComponent(this.tag), {
      title: '画个圈',
      showOptionMenu: 'true',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class="tag">
      <h3>#{ this.tag }#</h3>
      <HotPost ref="hotPost" message="正在加载..."/>
      <ImageView ref="imageView"/>
      <InputCmt ref="inputCmt"
                placeholder={ '画个圈吧！' }
                readOnly={ true }
                on-click={ this.comment }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Tag;
