/**
 * Created by army8735 on 2017/12/4.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import CommentBar from '../component/commentbar/CommentBar.jsx';
import Comment from '../component/comment/Comment.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import QuickVideo from '../component/quickVideo/QuickVideo.jsx';
import QuickAudio from '../component/quickaudio/QuickAudio.jsx';

let limit;
let offset;
let ajax;
let loading;
let loadEnd;
let currentPriority = 0;
let cacheKey;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind hasData
  // @bind postId
  // @bind isLike
  // @bind likeCount
  // @bind isFavor
  // @bind favorCount
  init(postId) {
    let self = this;
    self.postId = postId;
    cacheKey = 'postData_' + postId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/post2/index', { postId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        let cache = {};
        Object.keys(data).forEach(function(k) {
          if(k !== 'comment') {
            cache[k] = data[k];
          }
        });
        jsBridge.setPreference(cacheKey, cache);
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

    if(data.comment) {
      limit = data.comment.limit;
      offset = limit;
      self.ref.comment.setData(data.comment.data);
      if(data.comment.count > limit) {
        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
    }
    //
    // let $root = $(self.element);
    // $root.on('click', 'a', function(e) {
    //   e.preventDefault();
    //   let $this = $(this);
    //   let url = $this.attr('href');
    //   let title = $this.attr('title');
    //   let transparentTitle = !!$this.attr('transparentTitle');
    //   jsBridge.pushWindow(url, {
    //     title,
    //     transparentTitle,
    //   });
    // });
    // $root.on('click', '.comment', function() {
    //   jsBridge.pushWindow('/subcomment.html?type=1&id=' + self.postId, {
    //     title: '评论',
    //     optionMenu: '发布',
    //   });
    // });
    //
    // $root.on('click', '.imgs img', function() {
    //   let $li = $(this);
    //   let id = $li.attr('rel');
    //   let idx = $li.attr('idx');
    //   imageView.setData(itemImg, idx);
    // });
    //
    // let imageView = self.ref.imageView;
    // imageView.on('clickLike', function() {
    //   self.clickLike();
    // });
    // jsBridge.on('back', function(e) {
    //   if(!imageView.isHide()) {
    //     e.preventDefault();
    //     imageView.hide();
    //   }
    // });
    // jsBridge.on('resume', function(e) {
    //   let data = e.data;
    //   if(data && data.type && data.type === 'subComment') {
    //     self.ref.comment.prependData(data.data);
    //   }
    // });
    //
    // jsBridge.setOptionMenu({
    //   icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
    // });
    // jsBridge.on('optionMenu1', function() {
    //   migi.eventBus.emit('BOT_FN', {
    //     canFn: true,
    //     canLike: true,
    //     canFavor: true,
    //     isLike: self.isLike,
    //     isFavor: self.isFavor,
    //     canBlock: true,
    //     canReport: true,
    //     canShare: true,
    //     canShareWb: true,
    //     canShareLink: true,
    //     clickLike: function(botFn) {
    //       self.like(function() {
    //         botFn.isLike = self.isLike;
    //       });
    //     },
    //     clickFavor: function(botFn) {
    //       self.favor(function() {
    //         botFn.isFavor = self.isFavor;
    //       });
    //     },
    //     clickBlock: function(botFn) {
    //       let id = self.postData.SendUserID;
    //       let type = self.postData.isAuthor ? 5 : 6;
    //       self.block(id, type, function() {
    //         jsBridge.toast('屏蔽成功');
    //         botFn.cancel();
    //       });
    //     },
    //     clickReport: function(botFn) {
    //       self.report(self.postId, function() {
    //         jsBridge.toast('举报成功');
    //         botFn.cancel();
    //       });
    //     },
    //     clickShareWb: function() {
    //       let url = window.ROOT_DOMAIN + '/post/' + self.postId;
    //       let text = '';
    //       if(self.postData.Content) {
    //         text += self.postData.Content.length > 30 ? (self.postData.Content.slice(0, 30) + '...') : self.postData.Content;
    //       }
    //       text += ' #转圈circling# ';
    //       text += url;
    //       jsBridge.shareWb({
    //         text,
    //       }, function(res) {
    //         if(res.success) {
    //           jsBridge.toast("分享成功");
    //         }
    //         else if(res.cancel) {
    //           jsBridge.toast("取消分享");
    //         }
    //         else {
    //           jsBridge.toast("分享失败");
    //         }
    //       });
    //     },
    //     clickShareLink: function() {
    //       util.setClipboard(window.ROOT_DOMAIN + '/post/' + self.postId);
    //     },
    //   });
    // });
    //
    // let $window = $(window);
    // $window.on('scroll', function() {
    //   self.checkMore($window);
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
    let comment = self.ref.comment;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    comment.message = '正在加载...';
    ajax = net.postJSON('/h5/post2/comment', { postId: self.postId, offset, limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += limit;
        if(data.data.length) {
          comment.appendData(data.data);
        }
        if(offset >= data.count) {
          loadEnd = true;
          comment.message = '已经到底了';
        }
        else {
          comment.message = '';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        comment.message = res.message || util.ERROR_MESSAGE;
      }
      loading = false;
    }, function(res) {
      comment.message = res.message || util.ERROR_MESSAGE;
      loading = false;
    });
  }
  clickFavor(e) {
    this.favor();
  }
  favor(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingFavor) {
      return;
    }
    loadingFavor = true;
    let postId = self.postId;
    let url = '/h5/post/favor';
    if(self.isFavor) {
      url = '/h5/post/unFavor';
    }
    net.postJSON(url, { postID: postId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isFavor = data.State === 'favorWork';
        self.favorCount = data.FavorCount || '收藏';
        let $li = $(self.element).find('li.favor');
        if(self.isFavor) {
          $li.addClass('has');
        }
        else {
          $li.removeClass('has');
        }
        $li.find('span').text(self.favorCount);
        cb && cb();
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingFavor = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingFavor = false;
    });
  }
  clickLike(e) {
    this.like();
  }
  like(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingLike) {
      return;
    }
    loadingLike = true;
    let postId = self.postId;
    net.postJSON('/h5/post/like', { postID: postId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isLike = data.State === 'likeWordsUser';
        self.likeCount = data.LikeCount || '点赞';
        let $li = $(self.element).find('li.like');
        if(self.isLike) {
          $li.addClass('has');
        }
        else {
          $li.removeClass('has');
        }
        $li.find('span').text(self.likeCount);
        cb && cb();
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingLike = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingLike = false;
    });
  }
  clickDel(e) {
    let postId = this.postId;
    jsBridge.confirm('确认删除吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/post/del', { postID: postId }, function(res) {
        if(res.success) {
          location.reload(true);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  block(id, type, cb) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    jsBridge.confirm('确认屏蔽吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: type, businessId: id }, function(res) {
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
  report(id, cb) {
    jsBridge.confirm('确认举报吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: 4, businessId: id }, function(res) {
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
  share() {
    let self = this;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      clickShareWb: function() {
        let url = window.ROOT_DOMAIN + '/post/' + self.postId;
        let text = '';
        if(self.postData.Content) {
          text += self.postData.Content.length > 30 ? (self.postData.Content.slice(0, 30) + '...') : self.postData.Content;
        }
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
        util.setClipboard(window.ROOT_DOMAIN + '/post/' + self.postId);
      },
    });
  }
  comment() {
    let self = this;
    if(!self.postId) {
      return;
    }
    jsBridge.pushWindow('/subcomment.html?type=1&id='
      + self.postId + '&cid=' + (cId || '') + '&rid=' + (rId || ''), {
      title: '评论',
      optionMenu: '发布',
    });
  }
  chooseSubComment(rid, cid, name, n) {
    let self = this;
    if(!n || n === '0') {
      jsBridge.pushWindow('/subcomment.html?type=1&id='
        + self.postId + '&cid=' + cid + '&rid=' + rid, {
        title: '评论',
        optionMenu: '发布',
      });
    }
    cId = cid;
    rId = rid;
  }
  closeSubComment() {
    cId = rId = null;
  }
  render() {
    return <div class="post">
      <Nav ref="nav"/>
      <CommentBar ref="commentBar"/>
      <Comment ref="comment"
               message="正在加载..."/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default Post;
