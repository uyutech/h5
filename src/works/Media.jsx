/**
 * Created by army8735 on 2017/9/1.
 */

import util from '../common/util';
import net from '../common/net';
import lrcParser from './lrcParser';

let loadingLike;
let loadingFavor;
let ajaxLike;
let ajaxFavor;

let isStart;
let WIDTH;
let mediaService;
let info;
let first = true;

class Media extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.lrc = {};
    self.lrcIndex = 0;
    self.on(migi.Event.DOM, function() {
      WIDTH = $(window).width();
      if(jsBridge.appVersion && jsBridge.android) {
        let version = jsBridge.appVersion.split('.');
        let major = parseInt(version[0]) || 0;
        let minor = parseInt(version[1]) || 0;
        let patch = parseInt(version[2]) || 0;
        if(major > 0 || minor > 4) {
          mediaService = true;
          jsBridge.on('mediaPrepared', function(e) {
            if(self.data && e.data && e.data.id === self.data.workId.toString()) {
              self.duration = e.data.duration * 0.001;
              self.canControl = true;
            }
          });
          jsBridge.on('mediaTimeupdate', function(e) {
            // 延迟导致拖动开始后，timeupdate还会抵达，需注意判断
            if(self.data && e.data && !isStart && e.data.id === self.data.workId.toString()) {
              self.duration = e.data.duration * 0.001;
              self.canControl = true;
              if(!isStart) {
                self.isPlaying = true;
                self.currentTime = e.data.currentTime * 0.001;
                self.updateLrc();
                self.setBarPercent(self.currentTime / self.duration);
              }
            }
          });
          jsBridge.on('mediaProgress', function(e) {
            if(self.data && e.data && e.data.id === self.data.workId.toString()) {
              let load = self.ref.load.element;
              load.innerHTML = `<b style="width:${e.data.percent}%"/>`;
            }
          });
          jsBridge.on('mediaEnd', function() {
            self.emit('end');
          });
        }
      }
      jsBridge.on('optionMenu1', function() {
        if(self.data) {
          migi.eventBus.emit('BOT_FN', {
            isLike: self.isLike,
            isFavor: self.isFavor,
            clickLike: function(botFn) {
              self.like(function() {
                botFn.isLike = self.isLike;
              });
            },
            clickFavor: function(botFn) {
              self.favor(function() {
                botFn.isFavor = self.isFavor;
              });
            },
            clickCancel: function() {
              loadingLike = loadingFavor = false;
              if(ajaxLike) {
                ajaxLike.abort();
              }
              if(ajaxFavor) {
                ajaxFavor.abort();
              }
            },
          });
        }
      });
    });
  }
  @bind data
  @bind isPlaying
  @bind lrcMode
  @bind lrcIndex
  @bind lrc
  @bind duration
  @bind currentTime
  @bind canControl
  @bind isLike
  @bind likeNum
  @bind isFavor
  @bind isVideo
  setData(data) {
    let self = this;
    let old = self.data;
    let load = self.ref.load.element;
    if(data === null) {
      // 有数据之前传空无效
      if(first) {
        return;
      }
      self.data = data;
      self.stop();
      self.duration = 0;
      self.isLike = self.isFavor = false;
      self.likeNum = 0;
      self.canControl = false;
      self.lrc = {};
      load.innerHTML = '';
      if(ajaxLike) {
        ajaxLike.abort();
      }
      if(ajaxFavor) {
        ajaxFavor.abort();
      }
      loadingLike = loadingFavor = false;
      if(mediaService) {
        jsBridge.media({
          key: 'stop',
        }, function() {
          self.duration = 0;
          self.currentTime = 0;
          self.canControl = false;
          self.isLike = self.isFavor = false;
          self.likeNum = 0;
          self.lrc = {};
          load.innerHTML = '';
          self.setBarPercent(0);
        });
      }
      return;
    }

    // 如果传入相同信息则忽略
    if(old && old.workId === data.workId) {
      return;
    }
    self.data = data;
    self.duration = 0;
    self.currentTime = 0;
    self.canControl = false;
    self.isLike = data.isLike;
    self.likeNum = data.likeNum;
    self.isFavor = data.isFavor;
    self.setBarPercent(0);

    // 除了第一次，每次设置后除非信息相同，否则停止播放
    if(!first) {
      self.pause();
    }
    first = false;

    if(ajaxLike) {
      ajaxLike.abort();
    }
    if(ajaxFavor) {
      ajaxFavor.abort();
    }
    loadingLike = loadingFavor = false;

    // 1音频2视频
    self.isVideo = data.workType.toString().charAt(0) === '2';
    let l = {};
    if(lrcParser.isLrc(data.lrc)) {
      l.is = true;
      l.data = lrcParser.parse(data.lrc);
      let s = '';
      l.data.forEach(function(item) {
        s += item.txt + '\n';
      });
      l.txt = s;
    }
    else {
      l.is = false;
      l.txt = data.lrc;
    }
    self.lrc = l;

    if(self.isVideo) {
      self.ref.video.element.src = data.url;
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'info',
        value: {
          id: self.data.workId,
          url: location.protocol + util.autoSsl(self.data.url),
          name: self.data.workId,
        },
      }, function(res) {
        if(res.isCached) {
          load.innerHTML = `<b style="width:100%"/>`;
        }
        else {
          load.innerHTML = '';
        }
        if(res.same) {
          if(res.prepared) {
            self.canControl = true;
          }
          if(res.duration) {
            self.duration = res.duration * 0.001;
          }
        }
      });
    }
    else {
      self.ref.audio.element.src = data.url;
    }
  }
  onTimeupdate(e) {
    let currentTime = this.currentTime = e.target.currentTime;
    this.duration = e.target.duration;
    let percent = currentTime / this.duration;
    this.setBarPercent(percent);
    this.updateLrc();
  }
  onLoadedmetadata(e) {
    this.duration = e.target.duration;
    this.canControl = true;
    this.onProgress(e);
  }
  onCanplaythrough(e) {
    this.duration = e.target.duration;
    this.canControl = true;
    this.onProgress(e);
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
  onPause(e) {
    this.isPlaying = false;
  }
  onEnded(e) {
    this.isPlaying = false;
    this.emit('end');
  }
  onPlaying(e) {
    this.isPlaying = true;
    this.duration = e.target.duration;
  }
  play() {
    let self = this;
    if(!self.data) {
      return;
    }
    if(self.isVideo) {
      self.ref.video.element.play();
      self.isPlaying = true;
      self.emit('play', self.data);
      jsBridge.media({
        key: 'stop',
      });
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'play',
      }, function() {
        self.isPlaying = true;
        self.emit('play', self.data);
      });
    }
    else {
      self.ref.audio.element.play();
      self.isPlaying = true;
      self.emit('play', self.data);
    }
    net.postJSON('/h5/works/addPlayCount', { workID: self.data.workId });
  }
  pause() {
    let self = this;
    if(self.isVideo) {
      self.ref.video.element.pause();
      self.isPlaying = false;
      self.emit('pause');
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'pause',
      }, function() {
        self.isPlaying = false;
        self.emit('pause');
      });
    }
    else {
      self.ref.audio.element.pause();
      self.isPlaying = false;
      self.emit('pause');
    }
  }
  toggle() {
    this.isPlaying ? this.pause() : this.play();
  }
  stop() {
    let self = this;
    if(self.isVideo) {
      self.ref.video.element.pause();
      self.ref.video.element.src = '';
      self.currentTime = 0;
      self.isPlaying = false;
      self.emit('stop');
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'stop',
      }, function() {
        self.currentTime = 0;
        self.isPlaying = false;
        self.emit('stop');
      });
    }
    else {
      self.ref.audio.element.pause();
      self.ref.audio.element.src = '';
      self.currentTime = 0;
      self.isPlaying = false;
      self.emit('stop');
    }
  }
  repeat() {
    let self = this;
    if(self.isVideo) {
      self.ref.video.currentTime = 0;
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'seek',
        value: {
          time: 0,
        },
      });
    }
    else {
      self.ref.audio.currentTime = 0;
    }
    self.play();
  }
  clickPlay() {
    if(this.data) {
      this.isPlaying ? this.pause() : this.play();
    }
  }
  clickLrcMode() {
    this.lrcMode = !this.lrcMode;
  }
  touchStart(e) {
    e.preventDefault();
    if(this.canControl && e.touches.length === 1) {
      isStart = true;
      this.pause();
    }
  }
  touchMove(e) {
    if(isStart && e.touches.length === 1) {
      e.preventDefault();
      let self = this;
      let diff = e.touches[0].pageX;
      let percent = diff / WIDTH;
      let currentTime = self.duration * percent;
      if(Math.floor(currentTime) !== Math.floor(self.currentTime)) {
        self.currentTime = currentTime;
        self.setBarPercent(percent);
        self.updateLrc();
        if(self.isVideo) {
          self.ref.video.element.currentTime = currentTime;
        }
        else if(mediaService) {
          jsBridge.media({
            key: 'seek',
            value: {
              time: currentTime * 1000,
            },
          });
        }
        else {
          self.ref.audio.element.currentTime = currentTime;
        }
      }
    }
  }
  touchEnd(e) {
    isStart = false;
  }
  setBarPercent(percent) {
    if(isNaN(percent) || percent < 0) {
      percent = 0;
    }
    percent *= 100;
    percent = Math.min(percent, 100);
    $(this.ref.vol.element).css('width', percent + '%');
    $(this.ref.p.element).css('-webkit-transform', `translateX(${percent}%)`);
    $(this.ref.p.element).css('transform', `translateX(${percent}%)`);
  }
  updateLrc() {
    let lrc = this.lrc;
    let lrcData = lrc.data;
    if(lrc.is && lrcData.length) {
      let tempIndex = this.lrcIndex;
      for (let i = 0, len = lrcData.length; i < len; i++) {
        if(this.currentTime * 1000 >= lrcData[i].timestamp) {
          tempIndex = i;
        }
        else {
          break;
        }
      }
      if(tempIndex !== this.lrcIndex) {
        this.lrcIndex = tempIndex;
      }
    }
  }
  clickLike(e) {
    this.like();
  }
  like(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(!self.data) {
      return;
    }
    if(loadingLike) {
      return;
    }
    loadingLike = true;
    ajaxLike = net.postJSON('/h5/works/likeWork', { workID: self.data.workId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isLike = self.data.isLike = data.State === 'likeWordsUser';
        self.data.likeNum = self.likeNum = data.LikeCount;
        cb && cb();
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingLike = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingLike = false;
    });
  }
  clickFavor(e) {
    this.favor();
  }
  favor(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(!self.data) {
      return;
    }
    if(loadingFavor) {
      return;
    }
    loadingFavor = true;
    if(self.isFavor) {
      ajaxFavor = net.postJSON('/h5/works/unFavorWork', { workID: self.data.workId }, function (res) {
        if(res.success) {
          self.isFavor = self.data.isFavor = false;
          cb && cb();
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingFavor = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingFavor = false;
      });
    }
    else {
      ajaxFavor = net.postJSON('/h5/works/favorWork', { workID: self.data.workId }, function (res) {
        if(res.success) {
          self.isFavor = self.data.isFavor = true;
          cb && cb();
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingFavor = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingFavor = false;
      });
    }
  }
  clickDownload() {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(!self.data) {
      return;
    }
    let url = self.data.url;
    let name = self.data.workTitle;
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
    let self = this;
    if(!self.data) {
      return;
    }
    migi.eventBus.emit('SHARE', '/works/' + self.data.worksId + '/' + self.data.workId);
  }
  render() {
    return <div class="mod-media">
      <div class={ 'c'  + (this.isVideo ? ' is-video' : '') + (this.isPlaying ? ' is-playing' : '') }>
        <div class="cover">
          <img class={ this.lrcMode && this.lrc.data ? 'blur' : '' }
               src={ util.autoSsl(util.img750_750_80((this.data || {}).worksCover || '/src/common/blank.png')) }/>
        </div>
        <video ref="video"
               poster="/src/common/blank.png"
               onTimeupdate={ this.onTimeupdate }
               onLoadedmetadata={ this.onLoadedmetadata }
               onCanplaythrough={ this.onCanplaythrough }
               onProgress={ this.onProgress }
               onPause={ this.onPause }
               onEnded={ this.onEnded }
               onPlaying={ this.onPlaying }
               onClick={ this.toggle }
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
        <audio ref="audio"
               onTimeupdate={ this.onTimeupdate }
               onLoadedmetadata={ this.onLoadedmetadata }
               onCanplaythrough={ this.onCanplaythrough }
               onProgress={ this.onProgress }
               onPause={ this.onPause }
               onEnded={ this.onEnded }
               onPlaying={ this.onPlaying }
               preload="meta"/>
        <div class={ 'lrc' + (this.lrc.data && this.lrc.is ? '' : ' fn-hide') } ref="lrc">
          <div class={ 'roll' + (this.lrcMode && this.lrc.data ? '' : ' fn-hide') }>
            <div class="c"
                 ref="lrcRoll"
                 style={ '-webkit-transform:translateY(-' + this.lrcIndex * 24 + 'px);transform:translateY(-' + this.lrcIndex * 24 + 'px)' }>
              {
                (this.lrc.data || []).map(function(item) {
                  return <pre>{ item.txt || ' ' }</pre>;
                })
              }
            </div>
          </div>
          <div class={ 'line' + (!this.lrcMode && this.lrc.txt ? '' : ' fn-hide') }>
            <pre style={ '-webkit-transform:translateY(-' + this.lrcIndex * 24 + 'px);transform:translateY(-' + this.lrcIndex * 24 + 'px)' }>{ this.lrc.txt }</pre>
          </div>
        </div>
        <div class="control">
          <b class={ 'play' + (this.isPlaying ? ' pause' : '') }
             onClick={ this.clickPlay }/>
          <b class={ 'lrc' + (this.lrc.is ? '' : ' fn-hide') + (this.lrcMode ? ' roll' : '') }
             onClick={ this.clickLrcMode }/>
        </div>
        <b class={ 'start' + (this.isPlaying ? ' fn-hide' : '') } onClick={ this.play }/>
        <div class="time">
          <span class="now">{ util.formatTime(this.currentTime) }</span>
          <span class="total">{ util.formatTime(this.duration) }</span>
        </div>
        <div class={ 'progress' + (this.canControl ? ' can' : '') }>
          <div class="load" ref="load"/>
          <b class="vol" ref="vol"/>
          <b class="p" ref="p"
             onTouchStart={ this.touchStart } onTouchMove={ this.touchMove } onTouchEnd={ this.touchEnd }/>
        </div>
      </div>
      <ul class="btn">
        <li onClick={ this.clickLike }>
          <b class={ 'like' + (this.isLike ? ' liked' : '') }/>
          <span>{ this.isLike ? (this.likeNum || 0) : '点赞' }</span>
        </li>
        <li onClick={ this.clickFavor }>
          <b class={ 'favor' + (this.isFavor ? ' favored' : '') }/>
          <span>{ this.isFavor ? '已收藏' : '收藏' }</span>
        </li>
        <li class="dl" onClick={ this.clickDownload }>
          <b class="download"/>
          <span>下载</span>
        </li>
        <li onClick={ this.clickShare }>
          <b class="share"/>
          <span>分享</span>
        </li>
      </ul>
    </div>;
  }
}

export default Media;
