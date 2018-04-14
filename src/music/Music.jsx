/**
 * Created by army8735 on 2018/2/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

import Media from '../works/Media.jsx';
import Info from '../works/Info.jsx';
import Column from '../works/Column.jsx';
import List from './List.jsx';
import Author from '../works/Author.jsx';
import Comments from '../works/Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let avList = [];
let avHash = {};
let loadingLike;
let loadingFavor;
let ajaxLike;
let ajaxFavor;

let currentPriority = 0;
let cacheKey;

class Music extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind albumId
  // @bind workId
  @bind curColumn
  init(albumId, workId) {
    let self = this;
    self.albumId = albumId;
    self.workId = workId;
    cacheKey = 'musicAlbumData_' + albumId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    net.postJSON('/h5/musicAlbum/index', { albumId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        self.ref.comments.listenScroll();
        jsBridge.setPreference(cacheKey, data);
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
    let info = self.ref.info;
    let list = self.ref.list;
    let author = self.ref.author;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 2) {
      return;
    }
    info.setData(data.info);

    let index = 0;
    if(self.workId) {
      for(let i = 0, len = data.collection.length; i < len; i++) {
        if(data.collection[i].id === self.workId) {
          index = i;
          break;
        }
      }
    }
    self.setMedia(data.collection[index]);

    self.setColumn(data.commentList);

    list.workId = data.collection[index].id;
    list.list = data.collection;

    author.list = data.author;

    comments.setData(self.albumId, data.commentList);
  }
  setMedia(item) {
    let self = this;
    let temp = {};
    Object.keys(item).forEach((k) => {
      if(k !== 'works') {
        temp[k] = item[k];
      }
    });
    temp.worksId = item.works.id;
    temp.worksTitle = item.works.title;
    temp.worksSubTitle = item.works.subTitle;
    temp.worksCover = item.works.cover;
    self.ref.media.setData(temp);
  }
  setColumn(commentList) {
    let self = this;
    let column = self.ref.column;
    let list = [
      {
        id: 0,
        name: '曲目',
      },
      {
        id: 1,
        name: '简介',
      },
      {
        id: 2,
        name: '评论' + (commentList ? commentList.count || '' : ''),
      }
    ];
    self.curColumn = 0;
    column.list = list;
  }
  mediaLike(data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        let collection = cache.collection;
        for(let i = 0, len = collection.length; i < len; i++) {
          let item = collection[i];
          if(item.id === data.id) {
            item.isLike = data.isLike;
            item.likeCount = data.likeCount;
            jsBridge.setPreference(cacheKey, cache);
            return;
          }
        }
      }
    });
  }
  mediaFavor(data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        let collection = cache.collection;
        for(let i = 0, len = collection.length; i < len; i++) {
          let item = collection[i];
          if(item.id === data.id) {
            item.isFavor = data.isFavor;
            item.favorCount = data.favorCount;
            jsBridge.setPreference(cacheKey, cache);
            return;
          }
        }
      }
    });
  }
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
  }
  change(workId) {
    let self = this;
    let work = avHash[workId];
    // jsBridge.setTitle(work.ItemName);
    let authorList = ((work.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let s = (authorList.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    });
    jsBridge.setSubTitle(s.join('、'));
    self.setMedia(work);
    history.replaceState(null, '', '/works.html?worksId=' + self.worksId + '&workId=' + workId);
  }
  fn(workId) {
    let o = avHash[workId];
    let media = this.ref.media;
    if(o) {
      migi.eventBus.emit('BOT_FN', {
        canFn: true,
        canLike: true,
        canFavor: true,
        isLike: o.ISLike,
        isFavor: o.ISFavor,
        clickLike: function(botFn) {
          if(!util.isLogin()) {
            migi.eventBus.emit('NEED_LOGIN');
            return;
          }
          if(loadingLike) {
            return;
          }
          loadingLike = true;
          ajaxLike = net.postJSON('/h5/works/likeWork', { workID: o.ItemID }, function(res) {
            if(res.success) {
              botFn.isLike = o.ISLike = res.data.State === 'likeWordsUser';
              if(media.data && media.data.workId === o.ItemID) {
                media.isLike = media.data.isLike = o.ISLike;
                media.likeNum = media.data.likeNum = res.data.LikeCount;
              }
            }
            else if(res.code === 1000) {
              migi.eventBus.emit('NEED_LOGIN');
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
            loadingLike = false;
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
            loadingLike = false;
          });
        },
        clickFavor: function(botFn) {
          if(!util.isLogin()) {
            migi.eventBus.emit('NEED_LOGIN');
            return;
          }
          if(loadingFavor) {
            return;
          }
          loadingFavor = true;
          if(o.ISFavor) {
            ajaxFavor = net.postJSON('/h5/works/unFavorWork', { workID: o.ItemID }, function (res) {
              if(res.success) {
                botFn.isFavor = o.ISFavor = false;
                if(media.data && media.data.workId === o.ItemID) {
                  media.isFavor = media.data.isFavor = o.ISFavor;
                }
              }
              else if(res.code === 1000) {
                migi.eventBus.emit('NEED_LOGIN');
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
          else {
            ajaxFavor = net.postJSON('/h5/works/favorWork', { workID: o.ItemID }, function (res) {
              if(res.success) {
                botFn.isFavor = o.ISFavor = true;
                if(media.data && media.data.workId === o.ItemID) {
                  media.isFavor = media.data.isFavor = o.ISFavor;
                }
              }
              else if(res.code === 1000) {
                migi.eventBus.emit('NEED_LOGIN');
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
        },
        clickCancel: function() {
          loadingLike = loadingFavor = false;
          if(ajaxLike) {
            ajaxLike.abort();
          }
          if(ajaxFavor) {
            ajaxFavor.abort();
          }
        },
      });
    }
  }
  mediaPlay(data) {
    this.ref.botPlayBar.isPlaying = true;
    if(data.workType.toString().charAt(0) === '1') {
      jsBridge.getPreference('playlist', function(res) {
        res = jsBridge.android ? (res || []) : JSON.parse(res || '[]');
        for (let i = 0, len = res.length; i < len; i++) {
          if(res[i] === data.workId) {
            res.splice(i, 1);
            break;
          }
        }
        res.unshift(data.workId);
        jsBridge.setPreference('playlist', jsBridge.android ? res : JSON.parse(res));
      });
      jsBridge.setPreference('playlistCur', data.workId);
    }
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.albumId, {
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
        let url = window.ROOT_DOMAIN + '/works/' + self.worksId;
        let text = '【';
        if(self.worksDetail.Title) {
          text += self.worksDetail.Title;
        }
        if(self.worksDetail.sub_Title) {
          if(self.worksDetail.Title) {
            text += ' ';
          }
          text += self.worksDetail.sub_Title;
        }
        text += '】';
        if(self.worksDetail.GroupAuthorTypeHash
          && self.worksDetail.GroupAuthorTypeHash[0]
          && self.worksDetail.GroupAuthorTypeHash[0].AuthorTypeHashlist
          && self.worksDetail.GroupAuthorTypeHash[0].AuthorTypeHashlist[0].AuthorInfo
          && self.worksDetail.GroupAuthorTypeHash[0].AuthorTypeHashlist[0].AuthorInfo[0]) {
          text += self.worksDetail.GroupAuthorTypeHash[0].AuthorTypeHashlist[0].AuthorInfo[0].AuthorName;
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
      clickShareLink: function(botFn) {
        if(!self.data) {
          return;
        }
        let url = window.ROOT_DOMAIN + '/works/' + self.data.worksId;
        if(self.data.workId) {
          url += '/' + self.data.workId;
        }
        util.setClipboard(url);
      },
    });
  }
  render() {
    return <div class="music">
      <Media ref="media"
             on-play={ this.mediaPlay }
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }/>
      <Info ref="info"/>
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'list' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <List ref="list"
              on-change={ this.change }
              on-fn={ this.fn }/>
      </div>
      <div class={ 'intro' + (this.curColumn === 1 ? '' : ' fn-hide') }>
        <Author ref="author"/>
      </div>
      <Comments ref="comments"
                @visible={ this.curColumn === 2 }/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Music;
