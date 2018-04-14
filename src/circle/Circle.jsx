/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let offset = 0;
let ajax;
let loading;
let loadEnd;

let currentPriority = 0;
let cacheKey;

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
    cacheKey = 'circleData_' + circleId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    ajax = net.postJSON('/h5/circle2/index', { circleId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
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
    let nav = self.ref.nav;
    let postList = self.ref.postList;

    nav.setData(data.info, data.isFollow, data.fansCount);

    offset = data.postList.limit;
    postList.setData(data.postList.data);
    loadEnd = offset >= data.postList.count;
    if(data.postList.count === 0) {
      postList.message = '暂无画圈';
    }
    else if(loadEnd) {
      postList.message = '已经到底了';
    }

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
    ajax = net.postJSON('/h5/circle2/postList', { circleId: self.circleId, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
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
  favor(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.postList.data.forEach(function(item) {
          if(item.id === id) {
            item.isFavor = data.state;
            item.favorCount = data.count;
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  like(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.postList.data.forEach(function(item) {
          if(item.id === id) {
            item.isLike = data.state;
            item.likeCount = data.count;
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  follow(data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.isFollow = data.state;
        cache.fansCount = data.count;
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  render() {
    return <div class="circle">
      <Nav ref="nav"
           on-follow={ this.follow }/>
      <PostList ref="postList"
                visible={ true }
                message={ '正在加载...' }
                on-favor={ this.favor }
                on-like={ this.like }/>
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
