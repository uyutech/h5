/**
 * Created by army8735 on 2017/10/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import itemTemplate from './itemTemplate';

let isStart;
let offsetX;
let altMedia;
let mediaService;

class MusicAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    if(jsBridge.appVersion && jsBridge.android) {
      let version = jsBridge.appVersion.split('.');
      let major = parseInt(version[0]) || 0;
      let minor = parseInt(version[1]) || 0;
      let patch = parseInt(version[2]) || 0;
      if(major > 0 || minor > 4) {
        mediaService = true;
        jsBridge.on('mediaPrepared', function(e) {
          if(e.data && e.data.id.toString() === self.workID.toString()) {
            self.duration = e.data.duration * 0.001;
            self.canControl = true;
          }
        });
        jsBridge.on('mediaTimeupdate', function(e) {
          if(e.data && !isStart && e.data.id.toString() === self.workID.toString()) {
            self.currentTime = e.data.currentTime * 0.001;
            self.duration = e.data.duration * 0.001;
            self.updateLrc();
            self.canControl = true;
            self.isPlaying = true;
            self.setBarPercent(self.currentTime / self.duration);
          }
        });
        jsBridge.on('mediaProgress', function(e) {
          if(e.data && e.data.id.toString() === self.workID.toString()) {
            let load = self.ref.load.element;
            load.innerHTML = `<b style="width:${e.data.percent}%"/>`;
          }
        });
        jsBridge.on('mediaEnd', function(e) {
          if(e.data && e.data.id.toString() === self.workID.toString()) {
            self.onEnded();
          }
        });
      }
    }
    if(self.props.workList && self.props.workList.length) {
      if(self.props.workID) {
        self.props.workList.forEach(function(item, i) {
          if(self.props.workID.toString() === item.ItemID.toString()) {
            self.setItem(self.props.workList[i]);
          }
        });
      }
      else {
        self.setItem(self.props.workList[0]);
      }
      self.on(migi.Event.DOM, function() {
        let load = self.ref.load.element;
        if(mediaService) {
          jsBridge.media({
            key: 'info',
            value: {
              id: self.item.ItemID,
              url: location.protocol + util.autoSsl(self.item.FileUrl),
              name: self.item.ItemID,
            },
          }, function(res) {
            if(res.isCached) {
              load.innerHTML = `<b style="width:100%"/>`;
            }
            else {
              load.innerHTML = '';
            }
            self.isPlaying = res.isPlaying;
            if(res.isPlaying) {
              self.canControl = true;
            }
          });
        }
        else {
          self.addOrAltMedia();
        }
        migi.eventBus.on('chooseMusic', function(item) {
          self.setItem(item);
          if(mediaService) {
            jsBridge.media({
              key: 'info',
              value: {
                id: item.ItemID,
                url: location.protocol + util.autoSsl(item.FileUrl),
                name: item.ItemID,
              },
            }, function(res) {
              if(res.isCached) {
                load.innerHTML = `<b style="width:100%"/>`;
              }
              else {
                load.innerHTML = '';
              }
              self.currentTime = 0;
              self.isPlaying = true;
            });
            jsBridge.media({
              key: 'play',
            });
          }
          else {
            self.av.element.currentTime = self.currentTime = 0;
            self.addOrAltMedia();
            self.isPlaying = true;
            self.play();
          }
          history.replaceState(null, '', '/works.html?worksID=' + self.props.worksID + '&workID=' + self.workID);
        });
      });
    }
  }
  @bind item
  @bind type
  @bind workID
  @bind sname
  @bind url
  @bind playNum
  @bind likeNum
  @bind isPlaying
  @bind hasStart
  @bind formatLyrics = {}
  @bind showLyricsMode
  @bind lyricsIndex = 0
  @bind duration
  @bind canControl
  @bind muted
  @bind like
  @bind favor
  @bind cover
  @bind showFn = true
  @bind lrc
  get currentTime() {
    return this._currentTime || 0;
  }
  @bind
  set currentTime(v) {
    this._currentTime = v;
  }
  show() {
    $(this.element).removeClass('fn-hide hidden');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  setItem(item) {
    let self = this;
    self.item = item;
    self.type = item.ItemType;
    self.workID = item.ItemID;
    self.sname = item.ItemName;
    self.url = item.FileUrl;
    self.playNum = item.PlayHis;
    self.formatLyrics = item.formatLyrics || {};
    self.like = item.ISLike;
    self.favor = item.ISFavor;
    self.cover = item.ItemCoverPic;
    self.likeNum = item.LikeHis;
  }
  addOrAltMedia() {
    let self = this;
    let isPlaying = self.isPlaying;
    self.pause();
    let type = itemTemplate.workType(self.type).bigType;
    switch(type) {
      case 'audio':
        if(!self.audio) {
          self.audio = <audio src={ self.url }
                              onTimeupdate={ self.onTimeupdate.bind(self) }
                              onLoadedmetadata={ self.onLoadedmetadata.bind(self) }
                              onPlaying={ self.onPlaying.bind(self) }
                              onPause={ self.onPause.bind(self) }
                              onEnded={ self.onEnded.bind(self) }
                              onProgress={ self.onProgress.bind(self) }
                              onCanplaythrough={ self.onCanplaythrough.bind(self) }
                              preload="meta">
            your browser does not support the audio tag
          </audio>;
          self.audio.appendTo(self.ref.c.element);
        }
        else {
          self.audio.element.src = self.url || '';
        }
        self.av = self.audio;
        break;
      case 'video':
        if(!self.video) {
          self.video = <video ref="video"
                              poster="/src/common/blank.png"
                              src={ self.url }
                              onClick={ self.clickPlay.bind(self) }
                              onTimeupdate={ self.onTimeupdate.bind(self) }
                              onLoadedmetadata={ self.onLoadedmetadata.bind(self) }
                              onPause={ self.onPause.bind(self) }
                              onEnded={ self.onEnded.bind(self) }
                              onPlaying={ self.onPlaying.bind(self) }
                              onCanplaythrough={ self.onCanplaythrough.bind(self) }
                              preload="meta"
                              playsinline="true"
                              webkit-playsinline="true">
            your browser does not support the video tag
          </video>;
          self.video.appendTo(self.ref.c.element);
        }
        else {
          self.video.element.src = self.url || '';
        }
        self.av = self.video;
        break;
    }
    altMedia = true;
    self.canControl = false;
    if(isPlaying) {
      self.play();
    }
  }
  onTimeupdate(e) {
    let self = this;
    let currentTime = self.currentTime = e.target.currentTime;
    self.duration = e.target.duration;
    self.updateLrc();
    let percent = currentTime / self.duration;
    self.setBarPercent(percent);
  }
  onProgress(e) {
    let buffered = e.target.buffered;
    if(buffered && buffered.length) {
      let self = this;
      let load = self.ref.load.element;
      load.innerHTML = '';
      for(let i = 0, len = buffered.length; i < len; i++) {
        let start = buffered.start(i);
        let end = buffered.end(i);
        if(self.duration > 0) {
          load.innerHTML += `<b style="left:${Math.floor(start * 100 / self.duration)}%;width:${Math.floor((end - start) * 100 / self.duration)}%"/>`;
        }
      }
    }
  }
  onLoadedmetadata(e) {
    this.duration = e.target.duration;
    this.canControl = true;
    this.onProgress(e);
  }
  onPlaying(e) {
    this.duration = e.target.duration;
  }
  onPause(e) {
    this.isPlaying = false;
  }
  onEnded(e) {
    this.isPlaying = false;
  }
  onCanplaythrough(e) {
    this.canControl = true;
    if(altMedia) {
      altMedia = false;
      this.av.element.currentTime = this.currentTime = 0;
    }
  }
  play() {
    let self = this;
    let o = {
      worksId: self.props.worksID,
      workId: self.workID,
    };
    jsBridge.getPreference('playlist', function(res) {
      if(!res) {
        res = [];
      }
      for(let i = 0, len = res.length; i < len; i++) {
        if(res[i].workId.toString() === o.workId.toString()) {
          res.splice(i, 1);
          break;
        }
      }
      res.unshift(o);
      if(res.length > 20) {
        res.pop();
      }
      jsBridge.setPreference('playlist', res);
    });
    jsBridge.setPreference('playlistCur', o);
    if(mediaService) {
      jsBridge.media({
        key: 'play',
      });
    }
    else {
      self.av && self.av.element.play();
    }
    self.isPlaying = true;
    self.hasStart = true;
    net.postJSON('/h5/works/addPlayCount', { workID: self.workID });
    migi.eventBus.emit('play');
    return this;
  }
  pause() {
    if(mediaService) {
      jsBridge.media({
        key: 'pause',
      });
    }
    else {
      this.av && this.av.element.pause();
    }
    this.isPlaying = false;
    migi.eventBus.emit('pause');
    return this;
  }
  altLyrics() {
    this.showLyricsMode = !this.showLyricsMode;
  }
  updateLrc() {
    let self = this;
    let formatLyrics = self.formatLyrics || {};
    let formatLyricsData = formatLyrics.data;
    if(formatLyrics.is && formatLyricsData.length) {
      let tempIndex = self.lyricsIndex;
      for (let i = 0, len = formatLyricsData.length; i < len; i++) {
        if(self.currentTime * 1000 >= formatLyricsData[i].timestamp) {
          tempIndex = i;
        }
        else {
          break;
        }
      }
      if(tempIndex !== self.lyricsIndex) {
        self.lyricsIndex = tempIndex;
      }
    }
  }
  clickStart(e) {
    this.play();
  }
  touchStart(e) {
    e.preventDefault();
    if(this.canControl && e.touches.length === 1) {
      isStart = true;
      offsetX = $(this.ref.progress.element).offset().left;
      this.pause();
    }
  }
  touchMove(e) {
    if(isStart && e.touches.length === 1) {
      e.preventDefault();
      let x = e.touches[0].pageX;
      let diff = x - offsetX;
      let width = $(this.ref.progress.element).width();
      diff = Math.max(0, diff);
      diff = Math.min(width, diff);
      let percent = diff / width;
      this.setBarPercent(percent);
      let currentTime = Math.floor(this.duration * percent);
      if(mediaService) {
        jsBridge.media({
          key: 'seek',
          value: {
            time: currentTime * 1000,
          },
        });
        this.currentTime = currentTime;
      }
      else {
        this.av.element.currentTime = this.currentTime = currentTime;
      }
    }
  }
  touchEnd(e) {
    isStart = false;
  }
  clickProgress(e) {
    if(this.canControl && e.target.className !== 'p') {
      let $progress = $(this.ref.progress.element);
      let left = $progress.offset().left;
      let x = e.pageX - left;
      let percent = x / $progress.width();
      let currentTime = Math.floor(this.duration * percent);
      this.av.element.currentTime = this.currentTime = currentTime;
    }
  }
  setBarPercent(percent) {
    if(isNaN(percent)) {
      percent = 0;
    }
    percent *= 100;
    percent = Math.min(percent, 100);
    $(this.ref.vol.element).css('width', percent + '%');
    $(this.ref.p.element).css('-moz-transform', `translateX(${percent}%)`);
    $(this.ref.p.element).css('-webkit-transform', `translateX(${percent}%)`);
    $(this.ref.p.element).css('transform', `translateX(${percent}%)`);
  }
  clickPlay(e) {
    this.isPlaying ? this.pause() : this.play();
  }
  clickLike(e, vd) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    let $vd = $(vd.element);
    if(!$vd.hasClass('loading')) {
      $vd.addClass('loading');
      let data = self.item;
      net.postJSON('/h5/works/likeWork', { workID: self.workID }, function (res) {
        if(res.success) {
          data.ISLike = self.like = res.data === 211 || res.data.State === 'likeWordsUser';
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickFavor(e, vd) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    let $vd = $(vd.element);
    let data = self.item;
    if($vd.hasClass('loading')) {
      //
    }
    else if($vd.hasClass('has')) {
      net.postJSON('/h5/works/unFavorWork', { workID: self.workID }, function (res) {
        if(res.success) {
          data.ISFavor = self.favor = false;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
    else {
      net.postJSON('/h5/works/favorWork', { workID: self.workID }, function (res) {
        if(res.success) {
          data.ISFavor = self.favor = true;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickDownload(e, vd) {
    e.preventDefault();
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let url = vd.props.href.v;
    let name = vd.props.download.v;
    if(url && /^\/\//.test(url)) {
      url = location.protocol + url;
    }
    if(jsBridge.ios) {
      jsBridge.toast('ios暂不支持下载音视频~');
      return;
    }
    jsBridge.networkInfo(function(res) {
      if(res.available) {
        if(res.wifi) {
          jsBridge.download({
            url,
            name,
          });
        }
        else {
          jsBridge.confirm("检测到当前网络环境非wifi，继续下载可能会产生流量，是否确定继续？", function(res) {
            if(!res) {
              return;
            }
            jsBridge.download({
              url,
              name,
            });
          });
        }
      }
      else {
        jsBridge.toast("当前网络暂不可用哦~");
      }
    });
  }
  clickShare() {
    migi.eventBus.emit('SHARE', location.href);
  }
  render() {
    return <div class="mod mod-musicalbum" style={ 'background-image:url("' + (this.props.cover || '//zhuanquan.xin/img/blank.png') + '")'}>
      <div class="cover" ref="cover" style={ this.cover ? 'background-image:url("' + this.cover + '")' : '' }/>
      <div class={ 'c' + (this.isPlaying ? ' playing' : '') + (this.type === 2110 ? ' tvideo' : '') } ref="c">
        <div class={ 'lyrics' + (this.hasStart ? '' : ' fn-hide') } ref="lyrics">
          <div class={ 'roll' + (!this.showLyricsMode && this.formatLyrics.data ? '' : ' fn-hide') }>
            <div class="c" ref="lyricsRoll" style={ '-moz-transform:translateX(' + this.lyricsIndex * 20 + 'px);-webkit-transform:translateY(-' + this.lyricsIndex * 20 + 'px);transform:translateY(-' + this.lyricsIndex * 20 + 'px)' }>
              {
                (this.formatLyrics.data || []).map(function(item) {
                  return <pre>{ item.txt || ' ' }</pre>
                })
              }
            </div>
          </div>
          <div class={ 'line' + (this.showLyricsMode && this.formatLyrics.txt ? '' : ' fn-hide') }>
            <pre style={ '-moz-transform:translateX(' + this.lyricsIndex * 20 + 'px);-webkit-transform:translateY(-' + this.lyricsIndex * 20 + 'px);transform:translateY(-' + this.lyricsIndex * 20 + 'px)' }>{ this.formatLyrics.txt }</pre>
          </div>
        </div>
        <b class={ 'start' + ((this.isPlaying || !this.url) ? ' fn-hide' : '') } onClick={ this.clickStart }/>
      </div>
      <div class={ 'fn' + ((this.showFn && this.url) ? '' : ' hidden') } ref="fn">
        <div class="control">
          <small class="time">{ util.formatTime(this.currentTime) } / { util.formatTime(this.duration) }</small>
          <b class="full" onClick={ this.clickScreen }/>
        </div>
        <div class="bar">
          <b class={ 'play' + (this.isPlaying ? ' pause' : '') } onClick={ this.clickPlay }/>
          <div class="progress" ref="progress" onClick={ this.clickProgress }>
            <div class="load" ref="load"/>
            <b class="vol" ref="vol"/>
            <b class="p" ref="p" onTouchStart={ this.touchStart } onTouchMove={ this.touchMove } onTouchEnd={ this.touchEnd }/>
          </div>
        </div>
        <ul class="btn">
          <li class={ 'like' + (this.like ? ' has' : '') } onClick={ this.clickLike }/>
          <li class={ 'favor' + (this.favor ? ' has' : '') } onClick={ this.clickFavor }/>
          <li class="download">
            <a href={ this.url }
               download={ this.sname + (this.url ? (/\.\w+$/.exec(this.url)[0] || '') : '') }
               onClick={ this.clickDownload }/>
          </li>
          <li class="share" onClick={ this.clickShare }/>
        </ul>
      </div>
    </div>;
  }
}

export default MusicAlbum;
