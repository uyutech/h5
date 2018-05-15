/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import Media from './Media.jsx';
import Info from './Info.jsx';
import Select from './Select.jsx';
import Column from './Column.jsx';
import Author from './Author.jsx';
import Text from './Text.jsx';
import Poster from './Poster.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import Background from '../component/background/Background.jsx';

let currentPriority = 0;
let cacheKey;
let firstCommentColumn;

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind id
  // @bind workId
  // @bind kind
  @bind curColumn
  init(id, workId, option) {
    let self = this;
    self.id = id;
    self.workId = workId;
    self.ref.comments.id = id;
    cacheKey = 'worksData_' + id;
    if(option.comment) {
      firstCommentColumn = true;
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/works/index', { id }, function(res) {
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
    jsBridge.on('optionMenu1', function() {
      $net.statsAction(20, {
        id: self.id,
      });
    });
    jsBridge.on('optionMenu', function() {
      $net.statsAction(26, {
        id: self.id,
      });
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.data = data;
    let info = self.ref.info;
    let select = self.ref.select;
    let author = self.ref.author;
    let text = self.ref.text;
    let poster = self.ref.poster;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 3) {
      return;
    }
    info.setData(data.info);
    let avList = self.avList = [];
    let imgList = [];
    let textList = [];
    data.collection.forEach(function(item) {
      if([1, 2].indexOf(item.kind) > -1) {
        avList.push(item);
      }
      else if(item.kind === 3) {
        imgList.push(item);
      }
      else if(item.kind === 4) {
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
    self.setMedia(avList[index]);

    self.setColumn(imgList, data.commentList);
    author.list = data.info.author;
    text.list = textList;
    select.id = avList[index].id;
    select.list = avList;
    poster.list = imgList;

    comments.setData(self.id, data.commentList);
  }
  setMedia(item) {
    let self = this;
    if(item) {
      item.worksId = self.id;
      item.worksTitle = self.data.info.title;
      item.worksCover = self.data.info.cover;
    }
    self.ref.media.setData(item || null);
    if(!item) {
      return;
    }
    jsBridge.setTitle(item.title);
    let author = [];
    let hash = {};
    (item.author || []).forEach(function(item) {
      item.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    jsBridge.setSubTitle(author.join(' '));
  }
  setColumn(imgList, commentList) {
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
      name: '评论 ' + (commentList ? commentList.count || '' : ''),
    });
    if(self.curColumn === undefined) {
      if(firstCommentColumn) {
        self.curColumn = column.index = 2;
      }
      else {
        self.curColumn = 0;
      }
    }
    column.list = list;
  }
  mediaPlay(data, firstPlay) {
    $util.recordPlay(data);
    $net.statsAction(22, {
      id: data.id,
      worksId: data.worksId,
      firstPlay,
    });
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
    $net.statsAction(14, {
      id,
      worksId: self.id,
    });
  }
  change(workId) {
    let self = this;
    self.workId = workId;
    for(let i = 0; i < self.avList.length; i++) {
      if(self.avList[i].id === workId) {
        self.setMedia(self.avList[i]);
        $net.statsAction(13, {
          id: workId,
          worksId: self.id,
        });
        break;
      }
    }
  }
  comment() {
    let self = this;
    if(!self.id) {
      return;
    }
    jsBridge.pushWindow('/sub_comment.html?type=2&id=' + self.id, {
      title: '评论',
      optionMenu: '发布',
    });
    $net.statsAction(21, {
      id: self.id,
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
        let url = window.ROOT_DOMAIN + '/works/' + self.id;
        let text = '【';
        if(self.data.info.title) {
          text += self.data.info.title;
        }
        if(self.data.info.subTitle) {
          if(self.data.info.subTitle) {
            text += ' ';
          }
          text += self.data.info.subTitle;
        }
        text += '】';
        if(self.data.info.author[0]) {
          self.data.info.author[0].forEach((item) => {
            item.list.forEach((author) => {
              text += author.name + ' ';
            });
          });
        }
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
        let url = window.ROOT_DOMAIN + '/works/' + self.data.id;
        $util.setClipboard(url);
        botFn.cancel();
      },
    });
    $net.statsAction(19, {
      id: self.id,
    });
  }
  render() {
    return <div class="works">
      <Background ref="background"/>
      <Media ref="media"
             on-play={ this.mediaPlay }
             on-pause={ function(data) { $net.statsAction(23, { id: data.id, worksId: data.worksId, }); } }
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }
             on-fullscreen={ function(data) { $net.statsAction(24, { id: data.id, worksId: data.worksId, }); } }
             on-clickLike={ function(data) { $net.statsAction(15, { id: data.id, worksId: data.worksId, }); } }
             on-clickFavor={ function(data) { $net.statsAction(16, { id: data.id, worksId: data.worksId, }); } }
             on-clickDownload={ function(data) { $net.statsAction(17, { id: data.id, worksId: data.worksId, }); } }
             on-clickShare={ function(data) { $net.statsAction(18, { id: data.id, worksId: data.worksId, }); } }/>
      <Info ref="info"/>
      <Select ref="select"
              on-change={ this.change }/>
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'intro' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Author ref="author"/>
        <Text ref="text"/>
      </div>
      <Poster ref="poster"
              @visible={ this.curColumn === 1 }/>
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

export default Works;
