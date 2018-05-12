/**
 * Created by army8735 on 2018/2/3.
 */

'use strict';

import Media from '../works/Media.jsx';
import Info from '../works/Info.jsx';
import Column from '../works/Column.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import Author from '../works/Author.jsx';
import Comments from '../works/Comments.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import Background from '../component/background/Background.jsx';

let currentPriority = 0;
let cacheKey;

class MusicAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind id
  // @bind workId
  @bind curColumn
  init(id, workId) {
    let self = this;
    self.id = id;
    self.workId = workId;
    cacheKey = 'musicAlbumData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/musicAlbum/index', { id }, function(res) {
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
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let info = self.ref.info;
    let playlist = self.ref.playlist;
    let author = self.ref.author;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 3) {
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

    playlist.setData(data.collection);
    playlist.setCur(index);

    author.list = data.info.author;

    comments.setData(self.id, data.commentList);
  }
  setMedia(item) {
    let self = this;
    let work = item.work;
    work.worksId = item.id;
    work.worksTitle = item.title;
    work.worksCover = item.cover;
    self.ref.media.setData(work || null);
    jsBridge.setTitle(item.title);
    let author = [];
    let hash = {};
    work.author.forEach(function(item) {
      item.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    jsBridge.setSubTitle(author.join(' '));
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
    if(self.curColumn === undefined) {
      self.curColumn = 0;
    }
    column.list = list;
  }
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
  }
  mediaPlay(data) {
    $util.recordPlay(data);
    this.ref.botPlayBar.isPlaying = true;
  }
  mediaPause() {
    this.ref.botPlayBar.isPlaying = false;
  }
  mediaTimeupdate() {
    this.mediaPlay();
  }
  mediaEnd() {
    let self = this;
    let botPlayBar = self.ref.botPlayBar;
    let media = self.ref.media;
    self.mediaPause();
    if(botPlayBar.mode === 'repeat') {
      media.play();
    }
    else if(botPlayBar.mode === 'loop') {
      self.next();
    }
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
  change(item) {
    let self = this;
    self.setMedia(item);
    self.ref.media.play();
  }
  play() {
    this.ref.media.play();
  }
  pause() {
    this.ref.media.pause();
  }
  prev() {
    let data = this.ref.playlist.prev();
    this.setMedia(data);
    this.play();
  }
  next() {
    let data = this.ref.playlist.next();
    this.setMedia(data);
    this.play();
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/sub_comment.html?type=2&id=' + self.id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  // share() {
  //   let self = this;
  //   migi.eventBus.emit('BOT_FN', {
  //     canShare: true,
  //     canShareWb: true,
  //     canShareLink: true,
  //     clickShareWb: function(botFn) {
  //       if(!self.data) {
  //         return;
  //       }
  //       let url = window.ROOT_DOMAIN + '/musicAlbum/' + self.id;
  //       let text = '【';
  //       if(self.data.info.title) {
  //         text += self.data.info.title;
  //       }
  //       if(self.data.info.subTitle) {
  //         if(self.data.info.subTitle) {
  //           text += ' ';
  //         }
  //         text += self.data.info.subTitle;
  //       }
  //       text += '】';
  //       if(self.data.info.author[0]) {
  //         self.data.info.author[0].forEach((item) => {
  //           item.list.forEach((author) => {
  //             text += author.name + ' ';
  //           });
  //         });
  //       }
  //       text += '#转圈circling# ';
  //       text += url;
  //       jsBridge.shareWb({
  //         text,
  //       }, function(res) {
  //         if(res.success) {
  //           jsBridge.toast("分享成功");
  //         }
  //         else if(res.cancel) {
  //           jsBridge.toast("取消分享");
  //         }
  //         else {
  //           jsBridge.toast("分享失败");
  //         }
  //       });
  //       botFn.cancel();
  //     },
  //     clickShareLink: function(botFn) {
  //       if(!self.data) {
  //         return;
  //       }
  //       let url = window.ROOT_DOMAIN + '/musicAlbum/' + self.data.id;
  //       $util.setClipboard(url);
  //       botFn.cancel();
  //     },
  //   });
  // }
  render() {
    return <div class="music">
      <Background ref="background"/>
      <Media ref="media"
             on-play={ this.mediaPlay }
             on-pause={ this.mediaPause }
             on-timeupdate={ this.mediaTimeupdate }
             on-end={ this.mediaEnd }
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }/>
      <Info ref="info"/>
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'list' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Playlist ref="playlist"
                  visible={ true }
                  on-change={ this.change }/>
      </div>
      <div class={ 'intro' + (this.curColumn === 1 ? '' : ' fn-hide') }>
        <Author ref="author"/>
      </div>
      <Comments ref="comments"
                @visible={ this.curColumn === 2 }/>
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

export default MusicAlbum;
