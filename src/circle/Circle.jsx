/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';


import Nav from './Nav.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';

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
        let id = self.id;
        let list = [
          [
            {
              class: 'block',
              name: '屏蔽',
              click: function(botPanel) {
                if(!$util.isLogin()) {
                  migi.eventBus.emit('NEED_LOGIN');
                  return;
                }
                jsBridge.confirm('确认屏蔽吗？', function(res) {
                  if(!res) {
                    return;
                  }
                  $net.postJSON('/h5/circle/block', { id }, function(res) {
                    if(res.success) {
                      jsBridge.toast('屏蔽成功');
                    }
                    else if(res.code === 1000) {
                      migi.eventBus.emit('NEED_LOGIN');
                    }
                    else {
                      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    }
                    botPanel.cancel();
                  }, function(res) {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    botPanel.cancel();
                  });
                });
              },
            }
          ]
        ];
        migi.eventBus.emit('BOT_PANEL', list);
      });
    });
  }
  // @bind id
  // @bind name
  init(id) {
    let self = this;
    self.id = id;
    cacheKey = 'circleData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/circle/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
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

    postList.setData(data.top.concat(data.postList.data));
    offset = data.postList.limit;
    if(data.postList.count === 0) {
      postList.message = '暂无画圈';
      loadEnd = true;
    }
    else if(offset >= data.postList.count) {
      postList.message = '已经到底了';
      loadEnd = true;
    }
    else {
      postList.message = '正在加载...';
      loadEnd = false;
    }
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if($util.isBottom()) {
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
    ajax = $net.postJSON('/h5/circle/postList', { id: self.id, offset }, function(res) {
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
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  share() {
    let self = this;
    let list = [
      [
        {
          class: 'wb',
          name: '微博',
          click: function(botPanel) {
            let url = window.ROOT_DOMAIN + '/circle/' + self.id;
            let text = '来转转【' + self.name + '】圈吧~ 每天转转圈，玩转每个圈~';
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
            botPanel.cancel();
          },
        },
        {
          class: 'link',
          name: '复制链接',
          click: function(botPanel) {
            $util.setClipboard(window.ROOT_DOMAIN + '/circle/' + self.id);
            botPanel.cancel();
          },
        }
      ]
    ];
    migi.eventBus.emit('BOT_PANEL', list);
  }
  comment() {
    let self = this;
    if(!self.id) {
      return;
    }
    jsBridge.pushWindow('/sub_post.html?circleId=' + self.id, {
      title: '画个圈',
      optionMenu: '发布',
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
      <Background ref="background"/>
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
      <ImageView/>
      <BotPanel ref="botPanel"/>
    </div>;
  }
}

export default Circle;
