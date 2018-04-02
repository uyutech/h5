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

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind worksId
  // @bind workId
  @bind curColumn = 0
  init(worksId, workId) {
    let self = this;
    self.worksId = worksId;
    self.workId = workId;
    net.postJSON('/h5/works2/index', { worksId }, function(res) {
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
    self.data = data;
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
    let avList = self.avList = [];
    let imgList = [];
    let textList = [];
    data.collection.forEach(function(item) {
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

    self.setColumn(imgList, data.comment);
    select.kind = avList[index].kind;
    select.id = avList[index].id;
    author.list = data.authorList;
    text.list = textList;
    select.list = avList;
    poster.list = imgList;
    commentWrap.setData(self.worksId, data.comment);
  }
  setMedia(item) {
    let self = this;
    self.ref.media.setData(item || null);
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
        if(self.data.authorList && self.data.authorList[0]) {
          self.data.authorList[0].forEach(function(item) {
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
             on-play={ this.mediaPlay }/>
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
