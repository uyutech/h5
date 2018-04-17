/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import WorksList from './WorksList.jsx';
import MusicAlbumList from './MusicAlbumList.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import Work from './Work.jsx';
import Dynamics from './Dynamics.jsx';

let currentPriority = 0;
let cacheKey;

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind authorId
  @bind index
  @bind showHome
  @bind showWork
  @bind showDynamic
  init(authorId) {
    let self = this;
    self.authorId = authorId;
    self.ref.work.authorId = authorId;
    self.ref.comments.authorId = authorId;
    cacheKey = 'authorData_' + authorId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
        self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    net.postJSON('/h5/author2/index', { authorId }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
        self.ref.comments.listenScroll();
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
    self.data = data;
    let nav = self.ref.nav;
    let work = self.ref.work;
    let dynamics = self.ref.dynamics;
    let comments = self.ref.comments;

    nav.setData(data.info, data.aliases, data.outsides, data.isFollow);

    let showHome;
    if(data.mainWorks) {
      self.ref.worksList.list = data.mainWorks.data;
      showHome = true;
    }
    if(data.musicAlbum) {
      self.ref.musicAlbumList.list = data.musicAlbum.data;
      showHome = true;
    }

    if(showHome) {
      self.showHome = true;
      self.index = 0;
    }

    if(data.workKindList && data.workKindList.length) {
      self.showWork = true;
      work.setData(data.workKindList, data.kindWorkList);
      if(self.index === undefined) {
        self.index = 1;
      }
    }

    if(data.dynamicList && data.dynamicList.count) {
      self.showDynamic = true;
      dynamics.setData(self.authorId, data.dynamicList);
    }

    comments.setData(self.authorId, data.commentList);
    // if(data.dynamic && data.dynamic.data && data.dynamic.data.length) {
    //   self.showDynamic = true;
    //   self.ref.dynamics.authorId = self.authorId;
    //   self.ref.dynamics.setData(data.dynamic);
    //   if(self.index === undefined) {
    //     self.index = 2;
    //   }
    // }
  }
  clickType(e, vd ,tvd) {
    let rel = tvd.props.rel;
    if(rel !== this.index) {
      this.index = rel;
    }
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/subcomment.html?type=1&id=' + self.authorId, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  share() {
    let self = this;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      clickShareWb: function() {
        let url = window.ROOT_DOMAIN + '/author/' + self.authorId;
        let text = self.authorName + ' 来欣赏【' + self.authorName + '】的作品吧~ ';
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
        util.setClipboard(window.ROOT_DOMAIN + '/author/' + self.authorId);
      },
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
    return <div class="author">
      <Background ref="background"/>
      <Nav ref="nav"
           on-follow={ this.follow }/>
      <ul class="index"
          onClick={ { li: this.clickType } }>
        <li class={ (this.showHome ? '' : 'fn-hide ') + (this.index === 0 ? 'cur' : '') }
            rel={ 0 }>主页</li>
        <li class={ (this.showWork ? '' : 'fn-hide ') + (this.index === 1 ? 'cur' : '') }
            rel={ 1 }>作品</li>
        <li class={ (this.showDynamic ? '' : 'fn-hide ') + (this.index === 2 ? 'cur' : '') }
            rel={ 2 }>动态</li>
        <li class={ (this.index === 3 ? 'cur' : '') }
            rel={ 3 }>留言</li>
      </ul>
      <div class={ 'home' + (this.index === 0 ? '' : ' fn-hide') }>
        <h4>主打作品</h4>
        <WorksList ref="worksList"/>
        <h4>相关专辑</h4>
        <MusicAlbumList ref="musicAlbumList"/>
      </div>
      <Work ref="work"
            @visible={ this.index === 1 }/>
      <Dynamics ref="dynamics"
                @visible={ this.index === 2 }/>
      <Comments ref="comments"
                on-chooseSubComment={ this.chooseSubComment }
                on-closeSubComment={ this.closeSubComment }
                @visible={ this.index === 3 }/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-share={ this.share }
                on-click={ this.comment }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Author;
