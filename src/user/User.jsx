/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import Nav from './Nav.jsx';
import Background from '../component/background/Background.jsx';
import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Work from '../author/Work.jsx';
import Comments from '../author/Comments.jsx';

let offset = 0;
let ajax;
let loading;
let loadEnd;

let currentPriority = 0;
let cacheKey;

class User extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind id
  @bind curColumn
  @bind showWork
  @bind showDynamic
  @bind showWorks
  @bind showComment
  init(id) {
    let self = this;
    self.id = id;
    cacheKey = 'userData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/user/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        let cache = {};
        Object.keys(data).forEach(function(k) {
          if(k !== 'comment') {
            cache[k] = data[k];
          }
        });
        jsBridge.setPreference(cacheKey, cache);
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
    let nav = self.ref.nav;
    let work = self.ref.work;
    let postList = self.ref.postList;
    let comments = self.ref.comments;

    nav.setData(data.info, data.followPersonCount, data.fansCount, data.isFollow, data.isFans);

    if(data.postList && data.postList.count) {
      self.showDynamic = true;
      offset = data.postList.limit;
      postList.setData(data.postList.data);
      if(offset >= data.postList.count) {
        loadEnd = true;
        postList.message = '已经到底了';
      }
      else {
        loadEnd = false;
        postList.message = '正在加载...';
      }
      if(self.curColumn === undefined) {
        self.curColumn = 2;
      }
    }
    else {
      loadEnd = true;
      postList.message = '暂无动态';
    }
    if(data.workKindList && data.workKindList.length) {
      self.showWork = true;
      work.setData(data.workKindList, data.skillWorks, data.author[0].id);
      if(self.curColumn === undefined) {
        self.curColumn = 1;
      }
    }
    if(data.author && data.author[0] && data.author[0].type === 1 && data.author[0].settle <= 1) {
      self.showComment = true;
      work.id = data.author[0].id;
      comments.setData(data.author[0].id, data.commentList);
      if(self.curColumn === undefined) {
        self.curColumn = 3;
      }
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
    ajax = $net.postJSON('/h5/user/postList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        offset += data.limit;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
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
  clickType(e, vd ,tvd) {
    let rel = tvd.props.rel;
    if(rel !== this.curColumn) {
      this.curColumn = rel;
    }
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
            jsBridge.pushWindow('/sub_post.html?content=' + encodeURIComponent('@/user/' + self.id), {
              title: '画圈',
            });
          },
        },
        {
          class: 'wb',
          name: '微博',
          click: function(botPanel) {
            if(!self.data) {
              return;
            }
            let url = window.ROOT_DOMAIN + '/user/' + self.id;
            let text = '来欣赏【' + self.data.info.nickname + '】的作品吧~ ';
            text += '#转圈circling# ';
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
            if(!self.data) {
              return;
            }
            $util.setClipboard(window.ROOT_DOMAIN + '/user/' + self.id);
            botPanel.cancel();
          },
        }
      ]
    ];
    migi.eventBus.emit('BOT_PANEL', list);
  }
  comment() {
    let self = this;console.log(self.data);
    let authorId = self.data.author[0].id;
    jsBridge.pushWindow('/sub_comment.html?type=1&id=' + authorId, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class="user">
      <Background/>
      <Nav ref="nav"
           on-follow={ this.follow }/>
      <ul class="index"
          onClick={ { li: this.clickType } }>
        <li class={ (this.showDynamic ? '' : 'fn-hide ') + (this.curColumn === 2 ? 'cur' : '') }
            rel={ 2 }>画圈</li>
        <li class={ (this.showWork ? '' : 'fn-hide ') + (this.curColumn === 1 ? 'cur' : '') }
            rel={ 1 }>作品</li>
        <li class={ (this.showComment ? '' : 'fn-hide ') + (this.curColumn === 3 ? 'cur' : '') }
            rel={ 3 }>留言</li>
      </ul>
      <Work ref="work"
            @visible={ this.curColumn === 1 }/>
      <PostList ref="postList"
                disabledClickPerson={ true }
                visible={ true }
                message={ '正在加载...' }
                @visible={ this.curColumn === 2 }/>
      <Comments ref="comments"
                @visible={ this.showComment && this.curColumn === 3 }/>
      <ImageView ref="imageView"/>
      {
        this.showComment
          ? <InputCmt ref="inputCmt"
                      placeholder={ '发表评论...' }
                      readOnly={ true }
                      on-share={ this.share }
                      on-click={ this.comment }/>
          : ''
      }
      <BotPanel/>
    </div>;
  }
}

export default User;
