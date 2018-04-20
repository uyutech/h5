/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import Nav from './Nav.jsx';
import WorksList from './WorksList.jsx';
import MusicAlbum from './MusicAlbumList.jsx';
import Cooperation from './Cooperation.jsx';
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
  // @bind id
  @bind curColumn
  @bind showHome
  @bind showWork
  @bind showDynamic
  init(id) {
    let self = this;
    self.id = id;
    self.ref.work.id = id;
    self.ref.comments.id = id;
    cacheKey = 'authorData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
        self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/author2/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
        self.ref.comments.listenScroll();
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
    let dynamics = self.ref.dynamics;
    let comments = self.ref.comments;
    let worksList = self.ref.worksList;
    let musicAlbumList = self.ref.musicAlbumList;
    let cooperation = self.ref.cooperation;

    nav.setData(data.info, data.aliases, data.skill, data.outside, data.isFollow);

    let showHome = true;
    if(data.mainWorksList && data.mainWorksList.count) {
      worksList.list = data.mainWorksList.data;
      showHome = true;
    }
    else {
      worksList.list = null;
    }
    if(data.mainMusicAlbumList && data.mainMusicAlbumList.count) {
      musicAlbumList.list = data.mainMusicAlbumList.data;
      showHome = true;
    }
    else {
      musicAlbumList.list = null;
    }
    if(data.cooperationList) {
      cooperation.list = data.cooperationList.data;
    }
    else {
      cooperation.list = null;
    }

    if(showHome) {
      self.showHome = true;
      if(self.curColumn === undefined) {
        self.curColumn = 0;
      }
    }

    if(data.workKindList && data.workKindList.length) {
      self.showWork = true;
      work.setData(data.workKindList, data.kindWorkList);
      if(self.curColumn === undefined) {
        self.curColumn = 1;
      }
    }

    if(data.dynamicList && data.dynamicList.count) {
      self.showDynamic = true;
      dynamics.setData(self.id, data.dynamicList);
      if(self.curColumn === undefined) {
        self.curColumn = 2;
      }
    }

    comments.setData(self.id, data.commentList);
    if(self.curColumn === undefined) {
      self.curColumn = 3;
    }
  }
  clickType(e, vd ,tvd) {
    let rel = tvd.props.rel;
    if(rel !== this.curColumn) {
      this.curColumn = rel;
    }
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/sub_comment.html?type=1&id=' + self.id, {
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
      clickShareWb: function(botFn) {
        if(!self.data) {
          return;
        }
        let url = window.ROOT_DOMAIN + '/author/' + self.id;
        let text = '来欣赏【' + self.data.info.name + '】的作品吧~ ';
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
        botFn.cancel();
      },
      clickShareLink: function(botFn) {
        if(!self.data) {
          return;
        }
        $util.setClipboard(window.ROOT_DOMAIN + '/author/' + self.id);
        botFn.cancel();
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
        <li class={ (this.showHome ? '' : 'fn-hide ') + (this.curColumn === 0 ? 'cur' : '') }
            rel={ 0 }>主页</li>
        <li class={ (this.showWork ? '' : 'fn-hide ') + (this.curColumn === 1 ? 'cur' : '') }
            rel={ 1 }>作品</li>
        <li class={ (this.showDynamic ? '' : 'fn-hide ') + (this.curColumn === 2 ? 'cur' : '') }
            rel={ 2 }>动态</li>
        <li class={ (this.curColumn === 3 ? 'cur' : '') }
            rel={ 3 }>留言</li>
      </ul>
      <div class={ 'home' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <h4>主打作品</h4>
        <WorksList ref="worksList"/>
        <h4>相关专辑</h4>
        <MusicAlbum ref="musicAlbumList"/>
        <h4>合作关系</h4>
        <Cooperation ref="cooperation"/>
      </div>
      <Work ref="work"
            @visible={ this.curColumn === 1 }/>
      <Dynamics ref="dynamics"
                @visible={ this.curColumn === 2 }/>
      <Comments ref="comments"
                @visible={ this.curColumn === 3 }/>
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
