/**
 * Created by army8735 on 2017/12/4.
 */


'use strict';

import PostList from '../component/postlist/PostList.jsx';
import CommentBar from '../component/commentbar/CommentBar.jsx';
import Comment from '../component/comment/Comment.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';
import ImageView from '../component/imageview/ImageView.jsx';

let offset;
let ajax;
let loading;
let loadEnd;
let currentPriority = 0;
let cacheKey;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        let id = self.id;
        let list = [
          [
            {
              class: 'share',
              name: '分享',
              click: function(botPanel) {
                if(!$util.isLogin()) {
                  migi.eventBus.emit('NEED_LOGIN');
                  return;
                }
                botPanel.cancel();
                jsBridge.pushWindow('/sub_post.html?content=' + encodeURIComponent('@/post/' + id), {
                  title: '画圈',
                });
              },
            },
            {
              class: 'link',
              name: '复制链接',
              click: function(botPanel) {
                let url = window.ROOT_DOMAIN + '/post/' + self.id;
                $util.setClipboard(url);
                botPanel.cancel();
              },
            }
          ],
          [
            {
              class: 'report',
              name: '举报',
              click: function(botPanel) {
                jsBridge.confirm('确认举报吗？', function(res) {
                  if(res) {
                    $net.postJSON('/h5/comment/report', { id }, function(res) {
                      if(res) {
                        jsBridge.toast('举报成功');
                      }
                      else {
                        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                      }
                      botPanel.cancel();
                    }, function(res) {
                      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                      botPanel.cancel();
                    });
                  }
                });
              },
            }
          ]
        ];
        if(self.data.info.isOwn) {
          list[1].push({
            class: 'delete',
            name: '删除',
            click: function(botPanel) {
              jsBridge.confirm('确认删除吗？', function(res) {
                if(res) {
                  $net.postJSON('/h5/comment/del', { id }, function(res) {
                    if(res) {
                      jsBridge.toast('删除成功');
                    }
                    else {
                      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    }
                    botPanel.cancel();
                  }, function(res) {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    botPanel.cancel();
                  });
                }
              });
            },
          });
        }
        migi.eventBus.emit('BOT_PANEL', list);
      });
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.type && data.type === 'subComment') {
          self.ref.comment.prependData(data.data);
        }
      });
    });
  }
  init(id) {
    let self = this;
    self.id = id;
    cacheKey = 'postData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/post/index', { id }, function(res) {
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
    self.data = data;
    self.ref.postList.setData(data.info);

    if(data.commentList) {
      offset = data.commentList.limit;
      self.ref.comment.setData(data.commentList.data);
      if(data.commentList.count === 0) {
        loadEnd = true;
        self.ref.comment.message = '';
      }
      else if(offset >= data.commentList.count) {
        loadEnd = true;
        self.ref.comment.message = '已经到底了';
      }
      else {
        loadEnd = false;
        self.ref.comment.message = '正在加载...';
      }
    }
    else {
      self.ref.comment.message = '暂无评论';
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
    if(ajax) {
      ajax.abort();
    }
    let comment = self.ref.comment;
    loading = true;
    ajax = $net.postJSON('/h5/post/commentList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.data.length) {
          comment.appendData(data.data);
        }
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          comment.message = '已经到底了';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        comment.message = res.message || $util.ERROR_MESSAGE;
      }
      loading = false;
    }, function(res) {
      comment.message = res.message || $util.ERROR_MESSAGE;
      loading = false;
    });
  }
  like(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.info.isLike = data.state;
        cache.info.likeCount = data.count;
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  favor(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.info.isFavor = data.state;
        cache.info.favorCount = data.count;
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  clickDel(e) {
    let id = this.id;
    jsBridge.confirm('确认删除吗？', function(res) {
      if(!res) {
        return;
      }
      $net.postJSON('/h5/post/del', { id }, function(res) {
        if(res.success) {
          location.reload(true);
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      });
    });
  }
  comment() {
    let self = this;
    if(!self.id) {
      return;
    }
    jsBridge.pushWindow('/sub_comment.html?type=3&id=' + self.id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  commentLike(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        cache.commentList.data.forEach(function(item) {
          if(item.id === id) {
            item.isLike = data.state;
            item.likeCount = data.count;
          }
        });
        jsBridge.setPreference(cacheKey, cache);
      }
    });
  }
  reply(id) {
    jsBridge.pushWindow('/sub_comment.html?type=3&id=' + this.id + '&pid=' + id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  share() {
    let self = this;
    let list = [
      [
        {
          class: 'share',
          name: '分享',
          click: function(botPanel) {
            if(!$util.isLogin()) {
              migi.eventBus.emit('NEED_LOGIN');
              return;
            }
            botPanel.cancel();
            jsBridge.pushWindow('/sub_post.html?content=' + encodeURIComponent('@/post/' + self.id), {
              title: '画圈',
            });
          },
        },
        {
          class: 'link',
          name: '复制链接',
          click: function(botPanel) {
            let url = window.ROOT_DOMAIN + '/post/' + self.id;
            $util.setClipboard(url);
            botPanel.cancel();
          },
        }
      ]
    ];
    migi.eventBus.emit('BOT_PANEL', list);
  }
  render() {
    return <div class="post">
      <PostList ref="postList"
                visible={ true }
                single={ true }
                on-like={ this.like }
                on-favor={ this.favor }/>
      <CommentBar ref="commentBar"/>
      <Comment ref="comment"
               message="正在加载..."
               on-like={ this.commentLike }
               on-reply={ this.reply }/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotPanel ref="botPanel"/>
      <ImageView/>
    </div>;
  }
}

export default Post;
