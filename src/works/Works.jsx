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
    if([5, 6].indexOf(worksDetail.WorkType) > -1) {
      location.replace('/music.html?worksId=' + self.worksId + '&workId=' + self.workId);
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

    let self = this;
    let info = self.ref.info;
    let select = self.ref.select;
    let author = self.ref.author;
    let comment = self.ref.comment;

    // 音视频区域初始化
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

    info.worksType = worksDetail.WorkType;
    info.title = worksDetail.Title || '歌名待揭秘';
    info.subTitle = worksDetail.sub_Title;
    info.state = worksDetail.WorkState;

    select.workId = work.ItemID;
    select.list = avList;

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
      let o = {
        worksId: self.worksId,
        workId: item.ItemID,
        workType: item.ItemType,
        worksTitle: worksDetail.Title,
        workTitle: item.ItemName,
        url: item.FileUrl,
        isFavor: item.ISFavor,
        isLike: item.ISLike,
        worksCover: worksDetail.cover_Pic,
        workCover: item.ItemCoverPic,
        likeNum: item.LikeHis,
        lrc: item.lrc,
      };
      self.ref.media.setData(o);
    }
    else {
      self.ref.media.setData(null);
    }
  }
  setColumn(hash, commentData) {
    let self = this;
    let column = self.ref.column;
    let list = [
      {
        id: 0,
        name: '简介',
      }
    ];
    if(hash.poster) {
      list.push({
        id: 1,
        name: '海报',
      });
    }
    list.push({
      id: 2,
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
  mediaPlay(data) {
    if(data.workType.toString().charAt(0) === '1') {
      jsBridge.getPreference('playlist', function(res) {
        res = res || [];
        for (let i = 0, len = res.length; i < len; i++) {
          if(res[i].workId === data.workId) {
            res.splice(i, 1);
            break;
          }
        }
        res.unshift({
          workId: data.workId,
        });
        jsBridge.setPreference('playlist', res);
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
    jsBridge.setTitle(work.ItemName);
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
    jsBridge.pushWindow('/subcomment.html?type=3&id='
      + self.worksId, {
      title: '评论',
    });
  }
  share() {
    migi.eventBus.emit('SHARE', '/works/' + this.worksId + (this.workId ? ('/' + this.workId) : ''));
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
      <div class={ 'comment' + (this.curColumn === 2 ? '' : ' fn-hide') }>
        <CommentWrap ref="comment"/>
      </div>
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
