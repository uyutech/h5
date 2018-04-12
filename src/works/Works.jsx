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
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let currentPriority = 0;
let cacheKey;

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind worksId
  // @bind workId
  // @bind kind
  @bind curColumn = 0
  init(worksId, workId, kind) {
    let self = this;
    self.worksId = worksId;
    self.workId = workId;
    self.kind = kind;
    self.ref.comments.worksId = worksId;
    cacheKey = 'worksData_' + worksId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/works2/index', { worksId }, function(res) {
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
    self.data = data;
    let info = self.ref.info;
    let select = self.ref.select;
    let author = self.ref.author;
    let text = self.ref.text;
    let poster = self.ref.poster;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 2) {
      return;
    }
    info.setData(data.info);
    let avList = self.avList = [];
    let imgList = [];
    let textList = [];
    data.collection.forEach(function(item) {
      item.worksId = self.worksId;
      if([1, 2].indexOf(item.kind) > -1) {
        item.worksTitle = data.info.title;
        item.worksSubTitle = data.info.subTitle;
        item.worksCover = data.info.cover;
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
    author.list = data.authorList;
    text.list = textList;
    select.id = avList[index].id;
    select.list = avList;
    poster.list = imgList;

    comments.setData(self.worksId, data.commentList);
  }
  setMedia(item) {
    let self = this;
    self.ref.media.setData(item || null);
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
  mediaLike(data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        let collection = cache.collection;
        for(let i = 0, len = collection.length; i < len; i++) {
          let item = collection[i];
          if(item.id === data.id && item.kind === data.kind) {
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
          if(item.id === data.id && item.kind === data.kind) {
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
    self.workId = workId;
    for(let i = 0; i < self.avList.length; i++) {
      if(self.avList[i].id === workId) {
        self.setMedia(self.avList[i]);
        break;
      }
    }
  }
  comment() {
    let self = this;
    if(!self.worksId) {
      return;
    }
    jsBridge.pushWindow('/subcomment.html?type=3&id=' + self.worksId, {
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
        if(self.data.author && self.data.author[0]) {
          self.data.author[0].forEach(function(item) {
            text += item.list.map(function(item2) {
              return item2.name;
            });
          })
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
             on-play={ this.mediaPlay }
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }/>
      <Info ref="info"/>
      <Select ref="select"
              on-change={ this.change }/>
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'intro' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Author ref="author"/>
        <Text ref="text"/>
      </div>
      <div class={ 'poster' + (this.curColumn === 1 ? '' : ' fn-hide') }>
      {
        <Poster ref="poster"/>
      }
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

export default Works;
