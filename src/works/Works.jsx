/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
// import WorksTypeEnum from './WorksTypeEnum';
// import itemTemplate from './itemTemplate';
// import worksState from './worksState';
// import Lyric from './Lyric.jsx';
// import Timeline from './Timeline.jsx';
// import Insp from './Insp.jsx';
// import Poster from './Poster.jsx';
// import Comments from './Comments.jsx';
// import Text from './Text.jsx';
// import SubCmt from '../component/subcmt/SubCmt.jsx';
// import LyricsParser from './LyricsParser.jsx';
// import MusicAlbum from './MusicAlbum.jsx';
// import PlayList from './PlayList.jsx';
// import ImageView from './ImageView.jsx';
// import Describe from './Describe.jsx';
// import PhotoAlbum from './PhotoAlbum.jsx';

import Media from './Media.jsx';
import Info from './Info.jsx';
import Select from './Select.jsx';
import Column from './Column.jsx';
import Author from './Author.jsx';
import Poster from './Poster.jsx';
import CommentWrap from './CommentWrap.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let worksId;
let workId;
let curWorkId;
let worksDetail;
let workList = [];
let avList = [];
let avHash = {};

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    worksId = self.props.worksId;
    workId = self.props.workId;
    curWorkId = workId;
    self.on(migi.Event.DOM, function() {
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
    });
  }
  @bind curColumn
  setData(data) {
    worksDetail = data.worksDetail;
    if([5, 6].indexOf(worksDetail.WorkType) > -1) {
      location.replace('/music.html?worksId=' + worksId);
      return;
    }
    else if([11, 12].indexOf(worksDetail.WorkType) > -1) {
      location.replace('/image.html?worksId=' + worksId);
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
      if(/^[12]/.test(item.ItemType)) {
        avList.push(item);
        avHash[item.ItemID] = item;
      }
    });
    let index = 0;
    if(workId) {
      for(let i = 0, len = avList.length; i < len; i++) {
        if(avList[i].ItemID === workId) {
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
    info.title = worksDetail.Title;
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
    comment.setData(commentData);
  }
  setMedia(item) {
    if(item) {
      let o = {
        worksId,
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
      if(item.ItemType.toString().charAt(0) === '4') {
        res.push(item);
      }
    });
    this.textWorkList = res;
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
    let work = avHash[workId];
    jsBridge.setTitle(work.ItemName);
    let authorList = ((work.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let s = (authorList.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    });
    jsBridge.setSubTitle(s.join('、'));
    this.setMedia(work);
    history.replaceState(null, '', '/works.html?worksId=' + worksId + '&workId=' + workId);
  }
  share() {
    migi.eventBus.emit('SHARE', '/works/' + worksId + (workId ? ('/' + workId) : ''));
  }
  render() {
    return <div class="works">
      <Media ref="media"/>
      <Info ref="info"/>
      <Select ref="select"
              workId={ workId }
              on-change={ this.change }/>
      <Column ref="column" on-change={ this.changeColumn }/>
      <div class={ 'intro' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Author ref="author"/>
        {
          (this.textWorkList || []).map(function(item) {
            switch(item.ItemType) {
              case 4110:
                return <Text title="文案" data={ item.Text }/>;
              case 4120:
                return <Text title="随笔" data={ item.Text }/>;
              case 4210:
                return <Text title="诗词" data={ item.Text }/>;
              case 4211:
                return <Text title="原创歌词" data={ item.Text }/>;
              case 4212:
                return <Text title="改编歌词" data={ item.Text }/>;
              case 4310:
                return <Text title="小说" data={ item.Text }/>;
              case 4320:
                return <Text title="剧本" data={ item.Text }/>;
              case 4330:
                return <Text title="散文" data={ item.Text }/>;
              case 4340:
                return <Text title="故事" data={ item.Text }/>;
            }
          }.bind(this))
        }
      </div>
      <div class={ 'poster' + (this.curColumn === 1 ? '' : ' fn-hide') }>
        {
          <Poster title="海报" ref="poster"/>
        }
      </div>
      <div class={ 'comment' + (this.curColumn === 2 ? '' : ' fn-hide') }>
        <CommentWrap ref="comment" worksId={ worksId }/>
      </div>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Works;
