/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import WorksList from '../component/workslist/WorksList.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotAlbum from '../component/hotalbum/HotAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import Work from './Work.jsx';
import Dynamics from './Dynamics.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind authorId
  @bind index
  @bind rid
  @bind cid
  @bind showHome
  @bind showWork
  @bind showDynamic
  init(authorId) {
    let self = this;
    self.authorId = authorId;
    jsBridge.getPreference('authorInfo_' + self.authorId, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/author2/index', { authorId }, function(res) {
      if(res.success) {
        self.setData(res.data, 1);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    let self = this;
    let nav = self.ref.nav;

    nav.setData(data.info, data.aliases, data.outsides, priority);

    let showHome;
    if(data.worksList) {
      self.ref.worksList.list = data.worksList;
      showHome = true;
    }

    if(showHome) {
      self.showHome = true;
      self.index = 0;
    }
    // self.authorName = data.authorDetail.AuthorName;
    // self.ref.nav.setData(data.authorDetail, 1);
    // if(data.authorDetail.ISSettled && data.homeDetail.Hot_Works_Items && data.homeDetail.Hot_Works_Items.length) {
    //   self.showHome = true;
    //   self.index = 0;
    //   self.ref.hotAlbum.list = data.album;
    //   self.ref.hotAuthor.list = data.homeDetail.AuthorToAuthor;
    // }
    // if(data.authorDetail.ISSettled && (data.itemList && data.itemList.data && data.itemList.data.length || data.type && data.type.length)) {
    //   self.showWork = true;
    //   if(self.index === undefined) {
    //     self.index = 1;
    //   }
    //   self.ref.work.setData(data.type, data.itemList);
    // }
    // if(data.dynamic && data.dynamic.data && data.dynamic.data.length) {
    //   self.showDynamic = true;
    //   self.ref.dynamics.authorId = self.authorId;
    //   self.ref.dynamics.setData(data.dynamic);
    //   if(self.index === undefined) {
    //     self.index = 2;
    //   }
    // }
    // self.ref.comments.authorId = self.authorId;
    // self.ref.comments.setData(data.commentData);
    // if(self.index === undefined) {
    //   self.index = 3;
    // }
  }
  clickType(e, vd ,tvd) {
    let rel = tvd.props.rel;
    if(rel !== this.index) {
      this.index = rel;
    }
  }
  chooseSubComment(rid, cid, name, n) {
    let self = this;
    if(rid === '-1') {
      rid = cid;
    }
    self.rid = rid;
    self.cid = cid;
    if(!n || n === '0') {
      jsBridge.pushWindow('/subcomment.html?type=2&id='
        + self.authorId + '&cid=' + cid + '&rid=' + rid, {
        title: '评论',
        optionMenu: '发布',
      });
    }
  }
  closeSubComment() {
    let self = this;
    self.rid = self.cid = null;
  }
  clickInput() {
    let self = this;
    if(self.cid) {
      jsBridge.pushWindow('/subcomment.html?type=2&id='
        + self.authorId + '&cid=' + self.cid + '&rid=' + self.rid, {
        title: '评论',
        optionMenu: '发布',
      });
    }
    else {
      jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.authorId, {
        title: '评论',
        optionMenu: '发布',
      });
    }
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
  render() {
    return <div class="author">
      <Background ref="background"/>
      <Nav ref="nav"/>
      <ul class="index" onClick={ { li: this.clickType } }>
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
        <HotAlbum ref="hotAlbum"/>
        <h4>合作关系</h4>
        <HotAuthor ref="hotAuthor"/>
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
                on-click={ this.clickInput }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Author;
