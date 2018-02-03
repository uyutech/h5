/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";
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

let first;
let worksId;
let workId;
let curWorkId;
let TEMPLATE = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  7: 0,
  5: 1,
  6: 1,
  11: 2,
  12: 2,
};
let template;
let worksDetail;
let workList = [];

function hide(arr) {
  arr.forEach(function(cp) {
    if(cp && cp.element) {
      $(cp.element).addClass('fn-hidden');
    }
  });
}

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
    let self = this;
    let info = self.ref.info;
    let select = self.ref.select;
    let author = self.ref.author;
    let comment = self.ref.comment;
    worksDetail = data.worksDetail;
    workList = worksDetail.Works_Items || [];

    jsBridge.setSubTitle(worksDetail.sub_Title);
    template = TEMPLATE[worksDetail.WorkType];

    // 音视频区域初始化
    let seq = [2111,2112,2113,2000,2001,2002,2003,1220,1210,1230,1111,1121,1112,1122,1114,1113,1123,1140,1131,1132];
    migi.sort(workList, function(a, b) {
      return seq.indexOf(a.ItemType) > seq.indexOf(b.ItemType);
    });
    if(template === 0 || template === 1) {
      self.setMedia(workId);
    }

    let hash = {};
    workList.map(function(item) {
      if(item.ItemType === 3120) {
        hash.poster = true;
      }
    });

    info.worksType = worksDetail.WorkType;
    info.title = worksDetail.Title;
    info.subTitle = worksDetail.sub_Title;
    info.state = worksDetail.WorkState;

    select.workId = workId;
    select.list = workList;

    let commentData = data.commentData;
    self.setColumn(hash, commentData);
    author.list = worksDetail.GroupAuthorTypeHash;
    self.setText(workList);
    if(hash.poster) {
      self.setPoster(workList);
    }
    comment.setData(commentData);
  }
  setMedia(workId) {
    let item;
    if(workId) {
      for(let i = 0, len = workList.length; i < len; i++) {
        if(/^[12]/.test(workList[i].ItemType) && workList[i].ItemID === workId) {
          item = workList[i];
          break;
        }
      }
    }
    else {
      for(let i = 0, len = workList.length; i < len; i++) {
        if(/^[12]/.test(workList[i].ItemType)) {
          item = workList[i];
          break;
        }
      }
    }
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
  }
  setColumn(hash, commentData) {
    let self = this;
    let column = self.ref.column;
    let list;
    switch(template) {
      case 0:
        list = [
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
        break;
      case 1:
        list = [
          {
            id: 3,
            name: '曲目',
          },
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
        self.curColumn = 3;
        break;
      case 2:
        list = [
          {
            id: 4,
            name: '相册',
          },
          {
            id: 0,
            name: '简介',
          },
          {
            id: 2,
            name: '评论 ' + (commentData.Count || ''),
          }
        ];
        self.curColumn = 4;
        break;
    }
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
  // setData(worksID, workID, data) {
  //   let self = this;
  //   self.worksID = worksID;
  //   self.workID = workID;
  //   self.worksType = data.worksDetail.WorkType;
  //   self.worksDetail = data.worksDetail;
  //   self.commentData = data.commentData;
  //   self.setWorks(data.worksDetail);
  //
  //   self.hasData = true;
  //
  //   let subCmt = self.ref.subCmt;
  //   subCmt.on('click', function() {
  //     if(subCmt.to) {
  //       jsBridge.pushWindow('/subcomment.html?type=3&id='
  //         + self.worksID + '&sid=' + (self.workID || '') + '&cid=' + self.cid + '&rid=' + self.rid, {
  //         title: '评论',
  //       });
  //     }
  //     else {
  //       jsBridge.pushWindow('/subcomment.html?type=3&id='
  //         + self.worksID + '&sid=' + (self.workID || ''), {
  //         title: '评论',
  //       });
  //     }
  //   });
  //
  //   let imageView = self.ref.imageView;
  //   if(imageView) {
  //     jsBridge.on('back', function(e) {
  //       if(!imageView.isHide()) {
  //         e.preventDefault();
  //         imageView.hide();
  //       }
  //     });
  //   }
  // }
  setWorks(worksDetail) {
    let self = this;
    let works = worksDetail.Works_Items;
    let authorList = worksDetail.Works_Author || [];
    let workList = [];
    if(self.worksType === WorksTypeEnum.TYPE.musicAlbum) {
      works.forEach(function(item) {
        let type = itemTemplate.workType(item.ItemType).bigType;
        if(type === 'audio') {
          let l = {};
          if(LyricsParser.isLyrics(item.lrc)) {
            l.is = true;
            l.txt = LyricsParser.getTxt(item.lrc);
            l.data = LyricsParser.parse(item.lrc);
          }
          else {
            l.is = false;
            l.txt = item.lrc;
          }
          item.formatLyrics = l;
          workList.push(item);
        }
        else if(type === 'video') {
          workList.push(item);
        }
      });
      self.workList = workList;

      self.setAuthors(authorList);
      return;
    }
    else if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
      self.setAuthors(self.worksDetail.Works_Author || []);
      return;
    }
    let workHash = {};
    works.forEach(function(item) {
      // 将每个小作品根据小类型映射到大类型上，再归类
      let type = itemTemplate.workType(item.ItemType);
      let bigType = type.bigType;
      let name = type.display || type.name;
      if(bigType) {
        workHash[bigType] = workHash[bigType] || {
          name,
          value: [],
        };
        workHash[bigType].value.push(item);
        authorList = authorList.concat(item.Works_Item_Author);
      }
    });
    Object.keys(workHash).forEach(function(k) {
      workList.push({
        bigType: k,
        name: workHash[k].name,
        value: workHash[k].value,
      });
    });

    workList.forEach(function(item) {
      if(item.bigType === 'audio') {
        self.audioData = item.value;
      }
      else if(item.bigType === 'video') {
        self.videoData = item.value;
      }
      else if(item.bigType === 'text') {
        self.textData = item;
      }
      else if(item.bigType === 'poster') {
        self.posterData = item;
      }
      else if(item.bigType === 'lyric') {
        self.lyricData = item;
      }
    });

    if(self.workID) {
      if(self.videoData) {
        self.videoData.forEach(function(item) {
          if(item.ItemID.toString() === self.workID.toString()) {
            first = 'video';
          }
        });
      }
      if(self.audioData) {
        self.audioData.forEach(function(item) {
          if(item.ItemID.toString() === self.workID.toString()) {
            first = 'audio';
          }
        });
      }
    }
    else {
      if(self.videoData) {
        first = 'video';
        self.workID = self.videoData[0].ItemID;
      }
      else if(self.audioData) {
        first = 'audio';
        self.workID = self.audioData[0].ItemID;
      }
    }

    self.setAuthors(authorList);
  }
  setAuthors(authors) {
    let self = this;
    let hash = {};
    let typeHash = {};
    (authors || []).forEach(function(item) {
      hash[item.ID] = item;
      typeHash[item.WorksAuthorType] = typeHash[item.WorksAuthorType] || {
        hash: {},
        list: [],
      };
      let type = typeHash[item.WorksAuthorType];
      if(!type.hash.hasOwnProperty(item.ID)) {
        type.hash[item.ID] = true;
        type.list.push(item);
      }
    });
    self.isManager = hash.hasOwnProperty(self.props.authorID);
  }
  clickSel(e, vd, tvd) {
    let self = this;
    //最后一个可能是文本节点
    if(!tvd || !tvd.name) {
      return;
    }
    let $li = $(tvd.element);
    if(!$li.hasClass('cur') && !$li.hasClass('state')) {
      $(vd.element).find('.cur').removeClass('cur');
      $li.addClass('cur');
      let rel = tvd.props.rel;
      if(self.worksType === WorksTypeEnum.TYPE.musicAlbum) {
        if(rel === 'playList') {
          self.ref.comments && $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.playList.element).removeClass('fn-hide');
        }
        else if(rel === 'intro') {
          self.ref.comments && $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.playList.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          self.addComment();
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.playList.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
      else if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
        if(rel === 'photoAlbum') {
          self.ref.comments && $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).removeClass('fn-hide');
          if(self.props.tag !== 'intro' && self.props.tag !== 'comment') {
            self.ref.photoAlbum.load($(window));
          }
        }
        else if(rel === 'intro') {
          self.ref.comments && $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          self.addComment();
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
      else {
        if(rel === 'intro') {
          self.ref.comments && $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          self.addComment();
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
    }
  }
  addComment() {
    let self = this;
    if(self.ref.comments) {
      return;
    }
    let comments = self.ref.comments = migi.render(
      <Comments ref="comments"
                hidden={ true }
                isLogin={ util.isLogin() }
                worksID={ self.worksID }
                workID={ self.workID }
                originTo={ self.worksDetail.Title }
                commentData={ self.commentData }/>
    );
    self.ref.comments.after(self.ref.intro.element);

    let comment = comments.ref.comment;
    let subCmt = self.ref.subCmt;
    if(self.worksType === WorksTypeEnum.TYPE.originMusic) {
      let media = self.ref.media;
      media.on('switchTo', function(data) {
        comments.workID = data.ItemID;
      });
    }
    comment.on('chooseSubComment', function(rid, cid, name, n) {
      subCmt.to = name;
      self.rid = rid;
      self.cid = cid;
      if(!n || n === '0') {
        jsBridge.pushWindow('/subcomment.html?type=3&id='
          + self.worksID + '&sid=' + (self.workID || '') + '&cid=' + cid + '&rid=' + rid, {
          title: '评论',
        });
      }
    });
    comment.on('closeSubComment', function() {
      subCmt.to = '';
    });
  }
  genDom() {
    let self = this;
    let state = worksState.getStateStr(self.worksType, self.worksDetail.WorkState);
    if(self.worksType === WorksTypeEnum.TYPE.musicAlbum) {
      return <div class={ 't' + self.worksType }>
        <MusicAlbum ref="musicAlbum"
                    worksID={ self.worksID }
                    workID={ self.workID }
                    cover={ self.worksDetail.cover_Pic }
                    workList={ self.workList }/>
        <ul class="sel fn-clear" ref="sel" onClick={ { li: this.clickSel } }>
          <li class="cur" rel="playList">曲目</li>
          <li rel="intro">简介</li>
          <li rel="comment">留言</li>
          {
            state ? <li class="state">{ state }</li> : ''
          }
        </ul>
        <PlayList ref="playList" cover={ self.worksDetail.cover_Pic }
                  worksID={ this.worksID } workID={ this.workID } workList={ this.workList }/>
        <div class="intro fn-hide" ref="intro">
          <Describe title="专辑简介" data={ self.worksDetail.Describe }/>
          <Author list={ self.worksDetail.GroupAuthorTypeHash }/>
          {
            self.worksDetail.WorkTimeLine && self.worksDetail.WorkTimeLine.length
              ? <Timeline datas={ self.worksDetail.WorkTimeLine }/>
              : ''
          }
          {
            self.worksDetail.WorksAuthorComment
              ? <Insp ref="inspComment"
                      commentData={ self.worksDetail.WorksAuthorComment }/>
              : ''
          }
        </div>
        <SubCmt ref="subCmt"
                originTo={ self.worksDetail.Title }
                subText="发送"
                tipText="-${n}"
                readOnly={ true }
                placeholder="夸夸这个作品吧"/>
      </div>;
    }
    if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
      return <div class={ 't' + self.worksType }>
        <ul class="sel fn-clear" ref="sel" onClick={ { li: this.clickSel } }>
          <li class="cur" rel="photoAlbum">相册</li>
          <li rel="intro">简介</li>
          <li rel="comment">留言</li>
          {
            state ? <li class="state">{ state }</li> : ''
          }
        </ul>
        <PhotoAlbum ref="photoAlbum" worksID={ this.worksID } labelList={ self.labelList }/>
        <div class="intro fn-hide" ref="intro">
          <Author list={ self.worksDetail.GroupAuthorTypeHash }/>
          {
            self.worksDetail.WorkTimeLine && self.worksDetail.WorkTimeLine.length
              ? <Timeline datas={ self.worksDetail.WorkTimeLine }/>
              : ''
          }
          {
            self.textData && self.textData.value && self.textData.value.length
              ? <Text datas={ self.textData }/>
              : ''
          }
          {
            self.worksDetail.WorksAuthorComment
              ? <Insp ref="inspComment"
                      commentData={ self.worksDetail.WorksAuthorComment }/>
              : ''
          }
        </div>
        <SubCmt ref="subCmt"
                originTo={ self.worksDetail.Title }
                subText="发送"
                tipText="-${n}"
                readOnly={ true }
                placeholder="夸夸这个作品吧"/>
        <ImageView ref="imageView"/>
      </div>;
    }
    return <div class={ 't' + self.worksType }>
      <Media ref="media"
             worksID={ self.worksID }
             workID={ self.workID }
             cover={ self.worksDetail.cover_Pic }
             audioData={ self.audioData }
             videoData={ self.videoData }
             first={ first }/>
      <ul class="sel fn-clear" ref="sel" onClick={ { li: this.clickSel } }>
        <li class="cur" rel="intro">简介</li>
        <li rel="comment">留言</li>
        {
          state ? <li class="state">{ state }</li> : ''
        }
      </ul>
      <div class="intro" ref="intro">
        {
          self.worksDetail.Describe
            ? <Describe title="简介" data={ self.worksDetail.Describe }/>
            : ''
        }
        <Author list={ self.worksDetail.GroupAuthorTypeHash }/>
        {
          self.worksDetail.WorkTimeLine && self.worksDetail.WorkTimeLine.length
            ? <Timeline datas={ self.worksDetail.WorkTimeLine }/>
            : ''
        }
        {
          self.textData && self.textData.value && self.textData.value.length
            ? <Text datas={ self.textData }/>
            : ''
        }
        {
          self.lyricData && self.lyricData.value && self.lyricData.value.length && self.lyricData.value[0].Text
            ? <Lyric datas={ self.lyricData }/>
            : ''
        }
        {
          self.worksDetail.WorksAuthorComment
            ? <Insp ref="insp"
                    commentData={ self.worksDetail.WorksAuthorComment }/>
            : ''
        }
        {
          self.posterData
            ? <Poster datas={ self.posterData }/>
            : ''
        }
      </div>
      <SubCmt ref="subCmt"
              originTo={ self.worksDetail.Title }
              subText="发送"
              tipText="-${n}"
              readOnly={ true }
              placeholder="夸夸这个作品吧"/>
    </div>;
  }
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
    switch(id) {
      case 2:
        self.ref.comment.show();
        break;
      default:
        self.ref.comment.hide();
        break;
    }
  }
  share() {
    migi.eventBus.emit('SHARE', '/works/' + worksId + (curWorkId ? ('/' + curWorkId) : ''));
  }
  change(workId) {
    this.setMedia(workId);
  }
  render() {
    return <div class="works">
      <Media ref="media"/>
      <Info ref="info"/>
      <Select ref="select"
              workId={ workId }
              on-change={ this.change.bind(this) }/>
      <Column ref="column" on-change={ this.changeColumn.bind(this) }/>
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
                on-share={ this.share.bind(this) }/>
    </div>;
  }
}

export default Works;
