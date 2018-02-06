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
import Text from '../works/Text.jsx';
import Poster from '../works/Poster.jsx';
import CommentWrap from '../works/CommentWrap.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let worksDetail;
let workList = [];
let avList = [];
let avHash = {};
let loadingLike;
let loadingFavor;
let ajaxLike;
let ajaxFavor;

class Music extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind worksId
  @bind workId
  @bind curColumn = 0
  init(worksId, workId) {
    let self = this;
    self.worksId = worksId;
    self.workId = workId;
    net.postJSON('/h5/works/index', { worksID: worksId, workID: workId }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    worksDetail = data.worksDetail;
    workList = worksDetail.Works_Items || [];
    let commentData = data.commentData;
    // jsBridge.setTitle(worksDetail.Title);
    // jsBridge.setSubTitle(worksDetail.sub_Title);

    let self = this;
    let list = self.ref.list;
    let info = self.ref.info;
    let author = self.ref.author;
    let comment = self.ref.comment;

    let hash = {};
    workList.forEach(function(item) {
      if(item.ItemType === 3120) {
        hash.poster = true;
      }
      if(/^[12]/.test(item.ItemType)) {
        avList.push(item);
        avHash[item.ItemID] = item;
      }
    });
    let index = 0;
    if(self.workId) {
      for(let i = 0, len = avList.length; i < len; i++) {
        if(avList[i].ItemID === self.workId) {
          index = i;
          break;
        }
      }
    }

    let work = avList[index];
    jsBridge.setTitle(work.ItemName);
    let authorList = ((work.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let s = (authorList.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    });
    jsBridge.setSubTitle(s.join('、'));

    self.setMedia(work);

    list.workId = work.ItemID;
    list.list = avList;

    info.worksType = worksDetail.WorkType;
    info.title = worksDetail.Title || '歌名待揭秘';
    info.subTitle = worksDetail.sub_Title;
    info.state = worksDetail.WorkState;

    self.setColumn(hash, commentData);

    author.list = worksDetail.GroupAuthorTypeHash;
    self.setText(workList);
    if(hash.poster) {
      self.setPoster(workList);
    }

    comment.worksId = self.worksId;
    comment.setData(commentData);
  }
  setMedia(item) {
    let self = this;
    if(item) {
      let works = (item.Works_Items_Works || [])[0] || {};
      let o = {
        worksId: self.worksId,
        workId: item.ItemID,
        workType: item.ItemType,
        worksTitle: worksDetail.Title,
        workTitle: item.ItemName,
        url: item.FileUrl,
        isFavor: item.ISFavor,
        isLike: item.ISLike,
        worksCover: works.WorksCoverPic || worksDetail.cover_Pic,
        workCover: item.ItemCoverPic,
        likeNum: item.LikeHis,
        lrc: item.lrc,
      };
      this.ref.media.setData(o);
    }
    else {
      this.ref.media.setData(null);
    }
  }
  setColumn(hash, commentData) {
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
      }
    ];
    if(hash.poster) {
      list.push({
        id: 2,
        name: '海报',
      });
    }
    list.push({
      id: 3,
      name: '评论 ' + (commentData.Count || ''),
    });
    self.curColumn = 0;
    column.list = list;
  }
  setText(list = []) {
    let res = [];
    list.forEach(function(item) {
      let hash = {
        4140: '文案',
        4120: '随笔',
        4210: '诗词',
        4211: '歌词',
        4212: '歌词',
        4310: '小说',
        4320: '剧本',
        4330: '散文',
        4340: '故事',
      };
      if(hash.hasOwnProperty(item.ItemType)) {
        res.push({
          title: hash[item.ItemType],
          data: item.Text,
        });
      }
    });
    this.ref.text.list = res;
  }
  setPoster(list = []) {
    let res = [];
    list.forEach(function(item) {
      if(item.ItemType === 3120) {
        res.push(item);
      }
    });
    this.ref.poster.list = res;
  }
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
  }
  change(workId) {
    let self = this;
    let work = avHash[workId];
    jsBridge.setTitle(work.ItemName);
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
        res = res || [];
        for (let i = 0, len = res.length; i < len; i++) {
          if(res[i] === data.workId) {
            res.splice(i, 1);
            break;
          }
        }
        res.unshift(data.workId);
        jsBridge.setPreference('playlist', res);
      });
      jsBridge.setPreference('playlistCur', data.workId);
    }
  }
  mediaPause() {
    this.ref.botPlayBar.isPlaying = false;
  }
  mediaEnd() {
    let mode = this.ref.botPlayBar.mode;
    if(mode === 'repeat') {
      this.ref.media.repeat();
    }
    else if(mode === 'loop') {}
  }
  play() {
    this.ref.media.play();
  }
  pause() {
    this.ref.media.pause();
  }
  prev() {
    if(avList.length < 2) {
      return;
    }
    let workId = this.ref.list.workId;
    let index = 0;
    for(let i = 0, len = avList.length; i < len; i++) {
      if(avList[i].ItemID === workId) {
        index = i - 1;
        break;
      }
    }
    if(index < 0) {
      index = avList.length - 1;
    }
    let newWorkId = avList[index].ItemID;
    this.change(newWorkId);
    this.ref.list.workId = newWorkId;
  }
  next() {
    if(avList.length < 2) {
      return;
    }
    let workId = this.ref.list.workId;
    let index = avList.length - 1;
    for(let i = 0, len = avList.length; i < len; i++) {
      if(avList[i].ItemID === workId) {
        index = i + 1;
        break;
      }
    }
    if(index > avList.length - 1) {
      index = 0;
    }
    let newWorkId = avList[index].ItemID;
    this.change(newWorkId);
    this.ref.list.workId = newWorkId;
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/subcomment.html?type=3&id='
      + self.worksId + '&sid=' + self.workId, {
      title: '评论',
    });
  }
  render() {
    return <div class="music">
      <Media ref="media"
             on-play={ this.mediaPlay }
             on-pause={ this.mediaPause }
             on-end={ this.mediaEnd }/>
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
        <Text ref="text"/>
      </div>
      <div class={ 'poster' + (this.curColumn === 2 ? '' : ' fn-hide') }>
        {
          <Poster ref="poster"/>
        }
      </div>
      <div class={ 'comment' + (this.curColumn === 3 ? '' : ' fn-hide') }>
        <CommentWrap ref="comment"/>
      </div>
      <BotPlayBar ref="botPlayBar"
                  on-play={ this.play }
                  on-pause={ this.pause }
                  on-prev={ this.prev }
                  on-next={ this.next }
                  on-comment={ this.comment }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Music;
