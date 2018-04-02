/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import HotPost from '../component/hotpost/HotPost.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../post/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let take = 0;
let skip = 0;
let ajax;
let loading;
let loadEnd;
let currentPriority = 0;

class Circle extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
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
  // @bind circleId
  // @bind circleName
  init(circleId) {
    let self = this;
    self.circleId = circleId;
    jsBridge.getPreference('circleData_' + circleId, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/circle2/index', { circleId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        let cache = {};
        Object.keys(data).forEach(function(k) {
          if(k !== 'comment') {
            cache[k] = data[k];
          }
        });
        jsBridge.setPreference('circleData_' + circleId, cache);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.ref.nav.setData(data.info);

    if(data.comment && data.comment.size) {
      take = data.comment.take;
      skip = take;
      self.ref.postList.setData(data.comment.data);
      if(data.comment.size > take) {
        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
    }

    // self.circleName = data.circleDetail.TagName;
    //
    // let title = self.ref.title;
    // title.cover = data.circleDetail.TagCover;
    // title.sname = data.circleDetail.TagName;
    // title.id = data.circleDetail.TagID;
    // title.desc = data.circleDetail.Describe;
    // title.joined = data.circleDetail.ISLike;
    // title.count = data.circleDetail.Popular;
    //
    // if(data.postList.Size > take) {
    //   let $window = $(window);
    //   $window.on('scroll', function() {
    //     self.checkMore($window);
    //   });
    // }
    //
    // let hotPost = self.ref.hotPost;
    // hotPost.setData(data.postList.data);
    // let imageView = self.ref.imageView;
    // imageView.on('clickLike', function(sid) {
    //   hotPost.like(sid, function(res) {
    //     imageView.isLike = res.ISLike || res.State === 'likeWordsUser';
    //   });
    // });
    // jsBridge.on('back', function(e) {
    //   if(!imageView.isHide()) {
    //     e.preventDefault();
    //     imageView.hide();
    //   }
    // });
    // jsBridge.on('resume', function(e) {
    //   if(e.data && e.data.type === 'subPost') {
    //     self.ref.hotPost.prependData(e.data.data);
    //   }
    // });
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let postList = self.ref.postList;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    postList.message = '正在加载...';
    ajax = net.postJSON('/h5/circle2/comment', { circleId: self.circleId, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        if(skip >= data.size) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
        else {
          postList.message = '';
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
      <Nav ref="nav"/>
      <PostList ref="postList"
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
