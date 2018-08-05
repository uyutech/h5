/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import Nav from './Nav.jsx';
import SkillWorks from './SkillWorks.jsx';
import Cooperation from './Cooperation.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';
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
  @bind showWorks
  @bind showCooperation
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
    $net.postJSON('/h5/author/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
        self.ref.comments.listenScroll();
        self.ref.dynamics.listenScroll();
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
    let skillWorks = self.ref.skillWorks;
    let cooperation = self.ref.cooperation;

    nav.setData(data.info, data.aliases, data.outside, data.isFollow);

    let showHome;
    if(data.skillWorks && data.skillWorks.length) {
      skillWorks.authorId = self.id;
      skillWorks.list = data.skillWorks;
      showHome = true;
      self.showWorks = true;
    }
    else {
      skillWorks.list = null;
      self.showWorks = false;
    }
    if(data.cooperationList && data.cooperationList.count) {
      cooperation.list = data.cooperationList.data;
      self.showCooperation = true;
      showHome = true;
    }
    else {
      cooperation.list = null;
      self.showCooperation = false;
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
            jsBridge.pushWindow('/sub_post.html?content=' + encodeURIComponent('@/author/' + self.id), {
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
            $util.setClipboard(window.ROOT_DOMAIN + '/author/' + self.id);
            botPanel.cancel();
          },
        }
      ]
    ];
    migi.eventBus.emit('BOT_PANEL', list);
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
        <SkillWorks ref="skillWorks"
                    @visible={ this.showWorks }/>
        <Cooperation ref="cooperation"
                     @visible={ this.showCooperation }/>
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
      <BotPanel ref="botPanel"/>
    </div>;
  }
}

export default Author;
