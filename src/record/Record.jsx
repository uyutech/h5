/**
 * Created by army8735 on 2018/1/17.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Media from '../works/Media.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import List from './List.jsx';

let offset = 0;
let loading;
let loadEnd;

class Record extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let media = self.ref.media;
      let botPlayBar = self.ref.botPlayBar;
      jsBridge.on('mediaEnd', function(e) {
        if(e.data) {
          if(botPlayBar.mode === 'repeat') {
            media.play();
          }
          else if(botPlayBar.mode === 'loop') {
            self.next();
          }
        }
      });
    });
  }
  @bind curColum
  init() {
    let self = this;
    let list = self.ref.list;
    self.curColum = 0;
    jsBridge.getCache(['record', 'recordCur'], function([record, recordCur]) {
      if(record && record.length) {
        list.setData(record);
        if(recordCur) {
          for(let i = 0, len = record.length; i < len; i++) {
            let item = record[i];
            if(item.id === recordCur) {
              self.setMedia(item);
              list.setCur(i);
              break;
            }
          }
        }
      }
      else {
        list.message = '暂无记录';
      }
    });
    if(util.isLogin()) {
      self.load();
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    }
  }
  setMedia(item) {
    let self = this;
    self.ref.media.setData(item || null);
  }
  checkMore() {
    let self = this;
    if(loadEnd || loading || self.curColum !== 1) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    let playlist = self.ref.playlist;
    net.postJSON('/h5/my2/favorList', { offset, kind: 2 }, function(res) {
      if(res.success) {
        let data = res.data;
        playlist.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          playlist.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  clickTag(e, vd, tvd) {
    let self = this;
    if(self.curColum === tvd.props.rel) {
      return;
    }
    self.curColum = tvd.props.rel;
  }
  change(data) {
    this.setMedia(data || null);
  }
  change2(data) {
    let self = this;
    let work = {};
    Object.keys(data.work).forEach((key) => {
      work[key] = data.work[key];
    });
    work.worksId = data.id;
    work.worksTitle = data.title;
    work.worksCover = data.cover;
    self.setMedia(work);
    self.ref.media.play();
    self.ref.list.prependData(work);
    self.ref.list.setCur(0);
    self.curColum = 0;
  }
  del(data) {
    let self = this;
    if(self.ref.media.data && self.ref.media.data.id === data.id) {
      self.ref.media.setData(null);
      self.ref.media.stop();
    }
  }
  mediaPlay() {
    this.ref.botPlayBar.isPlaying = true;
  }
  mediaPause() {
    this.ref.botPlayBar.isPlaying = false;
  }
  mediaEnd() {
    let self = this;
    let botPlayBar = self.ref.botPlayBar;
    let media = self.ref.media;
    if(botPlayBar.mode === 'repeat') {
      media.play();
    }
    else if(botPlayBar.mode === 'loop') {
      self.next();
    }
  }
  mediaLike(data) {
    this.ref.list.like(data);
  }
  mediaFavor(data) {
    this.ref.list.favor(data);
  }
  play() {
    this.ref.media.play();
  }
  pause() {
    this.ref.media.pause();
  }
  prev() {
    let data = this.ref.list.prev();
    this.setMedia(data);
    this.play();
  }
  next() {
    let data = this.ref.list.next();
    this.setMedia(data);
    this.play();
  }
  comment() {
    let data = this.ref.media.data;
    if(data) {
      jsBridge.pushWindow('/sub_post.html?type=2&id=' + data.id, {
        title: '评论',
        optionMenu: '发布',
      });
    }
  }
  render() {
    return <div class="record">
      <Media ref="media"
             on-play={ this.mediaPlay }
             on-pause={ this.mediaPause }
             on-end={ this.mediaEnd }
             on-like={ this.mediaLike }
             on-favor={ this.mediaFavor }/>
      <ul class="tag"
          onClick={ this.clickTag }>
        <li class={ this.curColum === 0 ? 'cur' : '' }
            rel={ 0 }>最近播放</li>
        <li class={ this.curColum === 1 ? 'cur' : '' }
            rel={ 1 }>收藏列表</li>
      </ul>
      <List ref="list"
            on-change={ this.change }
            on-del={ this.del }
            @visible={ this.curColum === 0 }/>
      <Playlist ref="playlist"
                message="正在加载..."
                on-change={ this.change2 }
                @visible={ this.curColum === 1 }/>
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

export default Record;
