/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";
import WorksTypeEnum from './WorksTypeEnum';
import itemTemplate from './itemTemplate';
import Media from './Media.jsx';
import worksState from './worksState';
import Author from './Author.jsx';
import Lyric from './Lyric.jsx';
import Timeline from './Timeline.jsx';
import Insp from './Insp.jsx';
import Poster from './Poster.jsx';
import Comments from './Comments.jsx';
import Text from './Text.jsx';

let first;

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind worksID
  @bind workID
  @bind worksType
  setData(worksID, workID, data) {
    let self = this;
    self.worksID = worksID;
    self.workID = workID;
    self.worksType = data.worksDetail.WorkType;
    self.worksDetail = data.worksDetail;
    self.commentData = data.commentData;
    self.setWorks(data.worksDetail);

    self.hasData = true;
  }
  setWorks(worksDetail) {
    let self = this;
    let works = worksDetail.Works_Items;
    let authorList = worksDetail.Works_Author || [];
    let workList = [];
    if(self.worksType === WorksTypeEnum.TYPE.musicAlbum) {
      works.forEach(function(item) {
        if(item.ItemType === 1111 || item.ItemType === 1113) {
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
        else if(item.ItemType === 2110) {
          workList.push(item);
        }
      });
      self.workList = workList;

      self.setAuthors(authorList);
      return;
    }
    else if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
      self.setAuthors(self.props.worksDetail.Works_Author || []);
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
          if(item.ItemID.toString() === self.workID) {
            first = 'video';
          }
        });
      }
      if(self.audioData) {
        self.audioData.forEach(function(item) {
          if(item.ItemID.toString() === self.workID) {
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
    // 按类型将作者整理排序
    let authorList = [];
    itemTemplate.authorType.forEach(function(typeList) {
      let list = [];
      typeList.forEach(function(type) {
        if(typeHash.hasOwnProperty(type)) {
          list = list.concat(typeHash[type].list);
          delete typeHash[type];
        }
      });
      if(list.length) {
        authorList.push(list);
      }
    });
    let unKnowList = [];
    let unKnowHash = {};
    Object.keys(typeHash).forEach(function(type) {
      typeHash[type].list.forEach(function(item) {
        if(!unKnowHash.hasOwnProperty(item.ID)) {
          unKnowHash[item.ID] = true;
          unKnowList.push(item);
        }
      });
    });
    authorList = authorList.concat([unKnowList]);
    self.authorList = authorList;
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
          $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.playList.element).removeClass('fn-hide');
        }
        else if(rel === 'intro') {
          $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.playList.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          if(!self.ref.comments) {
            self.ref.comments = migi.render(
              <Comments ref="comments"
                        hidden={ true }
                        isLogin={ self.props.isLogin }
                        worksID={ self.worksID }
                        workID={ self.workID }
                        originTo={ self.worksDetail.Title }
                        commentData={ self.commentData }/>
            );
            self.ref.comments.after(self.ref.intro.element);
          }
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.playList.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
      else if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
        if(rel === 'photoAlbum') {
          $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).removeClass('fn-hide');
          if(self.props.tag !== 'intro' && self.props.tag !== 'comment') {
            self.ref.photoAlbum.load($(window));
          }
        }
        else if(rel === 'intro') {
          $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          if(!self.ref.comments) {
            self.ref.comments = migi.render(
              <Comments ref="comments"
                        hidden={ true }
                        isLogin={ self.props.isLogin }
                        worksID={ self.worksID }
                        workID={ self.workID }
                        originTo={ self.worksDetail.Title }
                        commentData={ self.commentData }/>
            );
            self.ref.comments.after(self.ref.intro.element);
          }
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.photoAlbum.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
      else if(self.worksType === WorksTypeEnum.TYPE.originMusic) {
        if(rel === 'intro') {
          $(self.ref.comments.element).addClass('fn-hide');
          $(self.ref.intro.element).removeClass('fn-hide');
        }
        else if(rel === 'comment') {
          if(!self.ref.comments) {
            self.ref.comments = migi.render(
              <Comments ref="comments"
                        hidden={ true }
                        isLogin={ self.props.isLogin }
                        worksID={ self.worksID }
                        workID={ self.workID }
                        originTo={ self.worksDetail.Title }
                        commentData={ self.commentData }/>
            );
            self.ref.comments.after(self.ref.intro.element);
          }
          $(self.ref.intro.element).addClass('fn-hide');
          $(self.ref.comments.element).removeClass('fn-hide');
        }
      }
    }
  }
  genDom() {
    let self = this;
    let state = worksState.getStateStr(self.worksType, self.worksDetail.WorkState);
    if(self.worksType === WorksTypeEnum.TYPE.musicAlbum) {
      return <div class={ 't' + self.worksType }>111</div>;
    }
    if(self.worksType === WorksTypeEnum.TYPE.photoAlbum) {
      return <div class={ 't' + self.worksType }>222</div>;
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
        <Author authorList={ this.authorList }/>
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
    </div>;
  }
  render() {
    return <div class="works">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-pic"/>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Works;
