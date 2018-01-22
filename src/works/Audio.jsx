/**
 * Created by army on 2017/6/11.
 */

import util from '../common/util';
import net from '../common/net';
import LyricsParser from './LyricsParser.jsx';

let isStart;
let offsetX;
let mediaService;

class Audio extends migi.Component {
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
          if(e.data) {
            self.duration = e.data.duration * 0.001;
            self.canControl = true;
          }
        });
        jsBridge.on('mediaTimeupdate', function(e) {
          if(e.data) {
            self.currentTime = e.data.currentTime * 0.001;
            self.duration = e.data.duration * 0.001;
            self.updateLrc();
            self.canControl = true;
            self.setBarPercent(self.currentTime / self.duration);
          }
        });
        jsBridge.on('mediaProgress', function(e) {
          if(e.data) {
            let load = self.ref.load.element;
            load.innerHTML = `<b style="width:${e.data.percent}%"/>`;
          }
        });
      }
    }
    if(self.props.datas) {
      self.setData(self.props.datas);
      if(self.props.workID) {
        self.props.datas.forEach(function(item, i) {
          if(item.ItemID.toString() === self.props.workID) {
            self.index = i;
          }
        });
      }
      if(self.props.show) {
        self.on(migi.Event.DOM, function() {
          if(mediaService) {
            jsBridge.media({
              key: 'info',
              value: {
                url: location.protocol + util.autoSsl(this.datas[this.index || 0].FileUrl),
                name: this.datas[this.index || 0].ItemID,
              },
            }, function(res) {
              let load = self.ref.load.element;
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
            self.addMedia();
          }
        });
      }
    }
  }
  @bind datas = []
  @bind index = 0
  @bind isPlaying
  @bind hasStart
  @bind showLyricsMode
  @bind lyricsIndex = 0
  @bind duration
  @bind canControl
  @bind fnFavor
  @bind fnLike
  get currentTime() {
    return this._currentTime || 0;
  }
  @bind
  set currentTime(v) {
    this._currentTime = v;
  }
  setData(datas) {
    let self = this;
    self.datas = datas;
    datas.forEach(function(item) {
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
    });
    return this;
  }
  addMedia() {
    let audio = <audio src={ this.datas[this.index || 0].FileUrl }
                       onTimeupdate={ this.onTimeupdate.bind(this) }
                       onLoadedmetadata={ this.onLoadedmetadata.bind(this) }
                       onPlaying={ this.onPlaying.bind(this) }
                       onPause={ this.onPause.bind(this) }
                       onEnded={ this.onEnded.bind(this) }
                       onProgress={ this.onProgress.bind(this) }
                       preload="meta"
                       playsinline="true"
                       webkit-playsinline="true">
      your browser does not support the audio tag
    </audio>;
    this.audio = audio;
    audio.appendTo(this.element);
  }
  switchTo(index) {
    let self = this;
    self.index = index;
    self.isPlaying = false;
    self.currentTime = 0;
    self.ref.load.element.innerHTML = '';
    self.setBarPercent(0);
    if(mediaService) {
      jsBridge.media({
        key: 'info',
        value: {
          url: location.protocol + util.autoSsl(this.datas[this.index || 0].FileUrl),
          name: this.datas[this.index || 0].ItemID,
        },
      }, function(res) {
        self.currentTime = 0;
        self.setBarPercent(0);
        let load = self.ref.load.element;
        if(res.isCached) {
          load.innerHTML = `<b style="width:100%"/>`;
        }
        else {
          load.innerHTML = '';
        }
      });
    }
    else {
      if(!self.audio) {
        self.addMedia();
      }
      self.audio.element.src = self.datas[self.index].FileUrl;
    }
    self.emit('switchTo', self.datas[self.index]);
  }
  show() {
    let self = this;
    $(self.element).removeClass('fn-hide');
    if(mediaService) {}
    else {
      if(!self.audio) {
        self.addMedia();
      }
    }
    $(self.ref.fn.element).removeClass('fn-hidden');
    return self;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
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
  play() {
    let self = this;
    let work = self.datas[self.index || 0];
    let o = {
      worksId: self.props.worksID,
      workId: work.ItemID,
      isLike: work.ISLike,
      isFavor: work.ISFavor,
      likeNum: work.LikeHis,
      url: work.FileUrl,
      workName: work.ItemName,
      worksCover: self.props.cover,
      lrc: work.lrc,
    };
    jsBridge.getPreference('playlist', function(res) {
      if(!res) {
        res = [];
      }
      for(let i = 0, len = res.length; i < len; i++) {
        if(res[i].worksId.toString() === o.worksId.toString() && res[i].workId.toString() === o.workId.toString()) {
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
    jsBridge.setPreference('playlist_cur', o);
    // jsBridge.setPreference('playlist_playing', true);
    if(mediaService) {
      jsBridge.media({
        key: 'play',
      });
    }
    else {
      self.audio.element.play();
    }
    self.isPlaying = true;
    self.hasStart = true;
    net.postJSON('/h5/works/addPlayCount', { workID: work.ItemID });
    return this;
  }
  pause() {
    // jsBridge.setPreference('playlist_playing', null);
    if(mediaService) {
      jsBridge.media({
        key: 'pause',
      });
    }
    else {
      this.audio && this.audio.element.pause();
    }
    this.isPlaying = false;
    return this;
  }
  altLyrics() {
    this.showLyricsMode = !this.showLyricsMode;
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
        this.setBarPercent(percent);
      }
      else {
        this.audio.element.currentTime = this.currentTime = currentTime;
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
      if(mediaService) {
        jsBridge.media({
          key: 'seek',
          value: {
            time: currentTime * 1000
          },
        });
        this.currentTime = currentTime;
        this.setBarPercent(percent);
      }
      else {
        this.audio.element.currentTime = this.currentTime = currentTime;
      }
    }
  }
  setBarPercent(percent) {
    if(isNaN(percent)) {
      percent = 0;
    }
    percent *= 100;
    percent = Math.min(percent, 100);
    $(this.ref.vol.element).css('width', percent + '%');
    let $p = $(this.ref.p.element);
    $p.css('-moz-transform', `translateX(${percent}%)`);
    $p.css('-webkit-transform', `translateX(${percent}%)`);
    $p.css('transform', `translateX(${percent}%)`);
  }
  updateLrc() {
    let item = this.datas[this.index];
    let formatLyrics = item.formatLyrics;
    let formatLyricsData = formatLyrics.data;
    if(formatLyrics.is && formatLyricsData.length) {
      let tempIndex = this.lyricsIndex;
      for (let i = 0, len = formatLyricsData.length; i < len; i++) {
        if(this.currentTime * 1000 >= formatLyricsData[i].timestamp) {
          tempIndex = i;
        }
        else {
          break;
        }
      }
      if(tempIndex !== this.lyricsIndex) {
        this.lyricsIndex = tempIndex;
      }
    }
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
      let data = self.datas[self.index];
      net.postJSON('/h5/works/likeWork', { workID: data.ItemID }, function (res) {
        if(res.success) {
          data.ISLike = res.data === 211 || res.data.State === 'likeWordsUser';
          self.fnLike = null;
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
    let data = self.datas[self.index];
    if($vd.hasClass('loading')) {
      //
    }
    else if($vd.hasClass('has')) {
      net.postJSON('/h5/works/unFavorWork', { workID: data.ItemID }, function (res) {
        if(res.success) {
          data.ISFavor = false;
          self.fnFavor = null;
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
      net.postJSON('/h5/works/favorWork', { workID: data.ItemID }, function (res) {
        if(res.success) {
          data.ISFavor = true;
          self.fnFavor = null;
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
    migi.eventBus.emit('SHARE', '/works/' + this.props.worksID + '/' + this.props.workID);
  }
  render() {
    return <div class={ 'audio' + (this.props.show ? '' : ' fn-hide') + (this.datas[this.index || 0].FileUrl ? '' : ' empty') }>
      <div class="c">
        <div class={ 'lyrics' + (this.hasStart ? '' : ' fn-hidden') } ref="lyrics">
          <div class={ 'roll' + (!this.showLyricsMode && this.datas[this.index].formatLyrics.data ? '' : ' fn-hide') }>
            <div class="c" ref="lyricsRoll" style={ '-webkit-transform:translateY(-' + this.lyricsIndex * 20 + 'px);transform:translateY(-' + this.lyricsIndex * 20 + 'px)' }>
              {
                (this.datas[this.index].formatLyrics.data || []).map(function(item) {
                  return <pre>{ item.txt || ' ' }</pre>
                })
              }
            </div>
          </div>
          <div class={ 'line' + (this.showLyricsMode && this.datas[this.index].formatLyrics.txt ? '' : ' fn-hide') }>
            <pre style={ '-webkit-transform:translateY(-' + this.lyricsIndex * 20 + 'px);transform:translateY(-' + this.lyricsIndex * 20 + 'px)' }>{ this.datas[this.index].formatLyrics.txt }</pre>
          </div>
        </div>
        <b class={ 'start' + (this.isPlaying ? ' fn-hide' : '') } onClick={ this.clickStart }/>
      </div>
      <div class="fn" ref="fn">
        <div class="control">
          <b class={ 'lyrics' + (this.showLyricsMode ? '' : ' roll') } onClick={ this.altLyrics }/>
          <small class="time">{ util.formatTime(this.currentTime) } / { util.formatTime(this.duration) }</small>
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
          <li class={ 'like' + (this.datas[this.index].ISLike || this.fnLike ? ' has' : '') } onClick={ this.clickLike }/>
          <li class={ 'favor' + (this.datas[this.index].ISFavor || this.fnFavor ? ' has' : '') } onClick={ this.clickFavor }/>
          <li class="download">
            <a href={ this.datas[this.index].FileUrl }
               download={ (this.datas[this.index].ItemName || '') + (this.datas[this.index].FileUrl ? (/\.\w+$/.exec(this.datas[this.index].FileUrl)[0] || '') : '') }
               onClick={ this.clickDownload }/>
          </li>
          <li class="share" onClick={ this.clickShare }/>
        </ul>
      </div>
    </div>;
  }
}

export default Audio;
