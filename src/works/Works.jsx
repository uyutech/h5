/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from './Media.jsx';
import Info from './Info.jsx';
import Select from './Select.jsx';
import Column from './Column.jsx';
import Author from './Author.jsx';
import Text from './Text.jsx';
import Poster from './Poster.jsx';
import CommentWrap from './CommentWrap.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let worksDetail;
let workList = [];
let avList = [];
let avHash = {};

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu({
        icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
      });
    });
  }
  @bind worksId
  @bind workId
  @bind curColumn = 0
  init(worksId, workId) {
    let self = this;
    self.worksId = worksId;
    self.workId = workId;
    net.postJSON('/h5/works2/index', { worksId, worksID: worksId }, function(res) {
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
    let self = this;
    let info = self.ref.info;
    let select = self.ref.select;
    let author = self.ref.author;
    let text = self.ref.text;
    let poster = self.ref.poster;
    let commentWrap = self.ref.commentWrap;

    // 未完成保密
    if(data.info.state === 2) {
      return;
    }
    info.setData(data.info);
    let avList = [];
    let imgList = [];
    let textList = [];
    data.collection.forEach(function(item) {
      if([1, 2].indexOf(item.class) > -1) {
        avList.push(item);
      }
      else if(item.class === 3 && item.type === 4) {
        imgList.push(item);
      }
      else if(item.class === 4) {
        textList.push(item);
      }
    });

    let index = 0;
    if(self.workId) {
      for(let i = 0, len = avList.length; i < len; i++) {
        if(avList[i].id === self.workId) {
          index = i;
          break;
        }
      }
    }
    self.setMedia(data.info, avList[index]);

    self.setColumn(imgList, data.comment);
    select.id = avList[index].id;
    text.list = textList;
    select.list = avList;
    poster.list = imgList;
    commentWrap.setData(self.worksId, data.comment);


    return;
    self.worksDetail = worksDetail = data.worksDetail;
    if([5, 6, 18].indexOf(worksDetail.WorkType) > -1) {
      location.replace('/music.html?worksId=' + self.worksId + '&workId=' + (self.workId || ''));
      return;
    }
    else if([11, 12].indexOf(worksDetail.WorkType) > -1) {
      location.replace('/image.html?worksId=' + self.worksId);
      return;
    }
    workList = worksDetail.Works_Items || [];
    let commentData = data.commentData;
    jsBridge.setTitle(worksDetail.Title);
    jsBridge.setSubTitle(worksDetail.sub_Title);



    // 音视频区域初始化，音频1，视频2
    let seq = [2111,2112,2113,2000,2001,2002,2003,1220,1210,1230,1111,1121,1112,1122,1114,1113,1123,1140,1131,1132];
    migi.sort(workList, function(a, b) {
      return seq.indexOf(a.ItemType) > seq.indexOf(b.ItemType);
    });
    let hash = {};
    workList.forEach(function(item) {
      if(item.ItemType === 3120) {
        hash.poster = true;
      }
      else if(/^[12]/.test(item.ItemType)) {
        avList.push(item);
        avHash[item.ItemID] = item;
      }
    });
    if(self.workId) {
      for(let i = 0, len = avList.length; i < len; i++) {
        if(avList[i].ItemID === self.workId) {
          index = i;
          break;
        }
      }
    }

    let work = avList[index];
    // jsBridge.setTitle(work.ItemName);
    let authorList = ((work.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let s = (authorList.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    });
    jsBridge.setSubTitle(s.join('、'));


    info.worksType = worksDetail.WorkType;
    info.title = worksDetail.Title || '歌名待揭秘';
    info.subTitle = worksDetail.sub_Title;
    info.state = worksDetail.WorkState;

    select.workId = work.ItemID;
    select.list = avList;

    self.setColumn(hash, commentData);

    author.list = worksDetail.GroupAuthorTypeHash;
    self.setText(worksDetail.Describe, workList);
    if(hash.poster) {
      self.setPoster(workList);
    }

    comment.worksId = self.worksId;
    comment.setData(commentData);
  }
  setMedia(info, item) {
    let self = this;
    if(item) {
      let o = {
        worksId: self.worksId,
        workId: item.id,
        workType: item.type,
        worksTitle: info.title,
        worksSubTitle: info.subTitle,
        author: [],
        workTitle: item.title,
        url: item.url,
        isFavor: 0,
        isLike: 0,
        worksCover: info.cover,
        cover: item.cover,
        likeNum: 0,
        lrc: item.lrc,
      };
      self.ref.media.setData(o);
    }
    else {
      self.ref.media.setData(null);
    }
  }
  setColumn(imgList, comment) {
    let self = this;
    let column = self.ref.column;
    let list = [
      {
        id: 0,
        name: '简介',
      }
    ];
    if(imgList.length) {
      list.push({
        id: 1,
        name: '海报',
      });
    }
    list.push({
      id: 2,
      name: '评论 ' + (comment.size || ''),
    });
    self.curColumn = 0;
    column.list = list;
  }
  mediaPlay(data) {
    if(data.workType.toString().charAt(0) === '1') {
      jsBridge.getPreference('playlist', function(res) {
        res = jsBridge.android ? (res || []) : JSON.parse(res || '[]');
        for(let i = 0, len = res.length; i < len; i++) {
          if(res[i].workId === data.workId) {
            res.splice(i, 1);
            break;
          }
        }
        res.unshift({
          workId: data.workId,
        });
        jsBridge.setPreference('playlist', jsBridge.android ? res : JSON.stringify(res));
      });
      jsBridge.setPreference('playlistCur', {
        workId: data.workId,
      });
    }
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
  comment() {
    let self = this;
    if(!self.worksId) {
      return;
    }
    jsBridge.pushWindow('/subcomment.html?type=3&id='
      + self.worksId, {
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
    return <div class="works">
      <Media ref="media"
             on-play={ this.mediaPlay }/>
      <Info ref="info"/>
      <Select ref="select"
              on-change={ this.change }/>
      <Column ref="column" on-change={ this.changeColumn }/>
      <div class={ 'intro' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Author ref="author"/>
        <Text ref="text"/>
      </div>
      <div class={ 'poster' + (this.curColumn === 1 ? '' : ' fn-hide') }>
      {
        <Poster ref="poster"/>
      }
      </div>
      <CommentWrap ref="commentWrap"
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

export default Works;
