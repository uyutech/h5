/**
 * Created by army8735 on 2017/9/1.
 */

import lrcParser from './lrcParser';

let loadingLike;
let loadingFavor;
let ajaxLike;
let ajaxFavor;

let isStart;
let WIDTH;
let mediaService;
let first = true;
let firstPlay = true;
let dragPlaying;

class Media extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.lrc = {};
    self.lrcIndex = 0;
    self.on(migi.Event.DOM, function() {
      WIDTH = screen.availWidth;
      if(jsBridge.appVersion) {
        let version = jsBridge.appVersion.split('.');
        let major = parseInt(version[0]) || 0;
        let minor = parseInt(version[1]) || 0;
        let patch = parseInt(version[2]) || 0;
        if(jsBridge.android && (major > 0 || minor > 4) || jsBridge.ios && (major > 0 || minor > 5)) {
          mediaService = true;
          jsBridge.on('mediaPrepared', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              self.duration = e.data.duration * 0.001;
              self.canControl = true;
            }
          });
          jsBridge.on('mediaTimeupdate', function(e) {
            // 延迟导致拖动开始后，timeupdate还会抵达，需注意判断
            if(self.data && e.data && !isStart && e.data.id === self.data.id.toString()) {
              self.duration = e.data.duration * 0.001;
              self.canControl = true;
              if(!isStart) {
                self.isPlaying = true;
                self.currentTime = e.data.currentTime * 0.001;
                self.updateLrc();
                self.setBarPercent(self.currentTime / self.duration);
                self.emit('timeupdate', self.currentTime);
              }
            }
          });
          jsBridge.on('mediaProgress', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              let load = self.ref.load.element;
              if(jsBridge.ios) {
                let length = e.data.length;
                let cache = e.data.cache || [];
                let s = '';
                cache.forEach(function(item) {
                  s += `<b style="left:${item.offset * 100 / length}%;width:${item.length * 100 / length}%"></b>`;
                });
                load.innerHTML = s;
              }
              else {
                load.innerHTML = `<b style="width:${e.data.percent}%"></b>`;
              }
            }
          });
          jsBridge.on('mediaEnd', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              self.isPlaying = false;
              self.emit('end');
            }
          });
          jsBridge.on('mediaPlay', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              self.isPlaying = true;
              self.emit('play', self.data);
            }
          });
          jsBridge.on('mediaPause', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              self.isPlaying = false;
              self.emit('pause');
            }
          });
          jsBridge.on('mediaStop', function(e) {
            if(self.data && e.data && e.data.id === self.data.id.toString()) {
              self.isPlaying = false;
              self.duration = 0;
              self.setBarPercent(0);
              self.emit('pause');
            }
          });
        }
      }
      jsBridge.on('optionMenu1', function() {
        if(self.data) {
          migi.eventBus.emit('BOT_FN', {
            canFn: true,
            canReport: true,
            clickReport: function(botFn) {
              if(!self.data) {
                return;
              }
              let id = self.data.id;
              jsBridge.confirm('确认举报吗？', function(res) {
                if(!res) {
                  return;
                }
                $net.postJSON('/h5/work/report', { id }, function(res) {
                  if(res.success) {
                    jsBridge.toast('举报成功');
                  }
                  else {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                  }
                  botFn.cancel();
                }, function(res) {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                  botFn.cancel();
                });
              });
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
  @bind likeCount
  @bind isFavor
  @bind favorCount
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
      self.likeCount = 0;
      self.favorCount = 0;
      self.canControl = false;
      self.lrc = {};
      load.innerHTML = '';
      firstPlay = true;
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
          self.likeCount = 0;
          self.favorCount = 0;
          self.lrc = {};
          load.innerHTML = '';
          self.setBarPercent(0);
        });
      }
      return;
    }

    self.data = data;
    self.isLike = data.isLike;
    self.likeCount = data.likeCount;
    self.favorCount = data.favorCount;
    self.isFavor = data.isFavor;

    // 如果传入相同信息则忽略
    if(old && old.id === data.id && old.kind === data.kind) {
      return;
    }

    self.duration = data.duration || 0;
    self.currentTime = 0;
    self.canControl = false;
    firstPlay = true;
    self.setBarPercent(0);

    // 除了第一次，每次设置后除非信息相同，否则停止播放
    if(!first) {
      self.stop();
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
    self.isVideo = data.kind === 1;
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
      jsBridge.media({
        key: 'stop',
      });
    }
    else if(mediaService) {
      let author = [];
      let hash = {};
      (self.data.author || []).forEach(function(item) {
        item.list.forEach(function(at) {
          if(!hash[at.id]) {
            hash[at.id] = true;
            author.push(at.name);
          }
        });
      });
      jsBridge.media({
        key: 'info',
        value: {
          id: self.data.id,
          url: location.protocol + $util.autoSsl(self.data.url),
          title: self.data.title,
          author: author.join(' '),
          cover: $util.protocol($util.img(self.data.worksCover, 128, 128, 80)),
        },
      }, function(res) {
        load.innerHTML = '';
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
    if(!this.data.duration) {
      $net.postJSON('/h5/work/updateDuration', { id: this.data.id, duration: Math.ceil(this.duration) });
    }
    if(this.data.kind === 1 && !this.data.width) {
      $net.postJSON('/h5/work/updateSize', { id: this.data.id, width: e.target.videoWidth, height: e.target.videoHeight });
    }
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
    this.emit('playing', this.duration);
  }
  play() {
    let self = this;
    if(!self.data) {
      return;
    }
    if(self.isVideo) {
      self.ref.video.element.play();
      self.isPlaying = true;
      self.emit('play', self.data, firstPlay);
      jsBridge.media({
        key: 'stop',
      });
    }
    else if(mediaService) {
      if(jsBridge.ios) {
        jsBridge.media({
          key: 'play',
        }, function() {
          self.isPlaying = true;
          self.emit('play', self.data, firstPlay);
        });
      }
      else {
        let author = [];
        let hash = {};
        (self.data.author || []).forEach(function(item) {
          item.list.forEach(function(at) {
            if(!hash[at.id]) {
              hash[at.id] = true;
              author.push(at.name);
            }
          });
        });
        jsBridge.media({
          key: 'play',
          value: {
            id: self.data.id,
            url: location.protocol + $util.autoSsl(self.data.url),
            title: self.data.title,
            author: author.join(' '),
            cover: $util.protocol($util.img(self.data.worksCover, 80, 80, 80)),
          },
        }, function() {
          self.isPlaying = true;
          self.emit('play', self.data, firstPlay);
        });
      }
    }
    else {
      self.ref.audio.element.play();
      self.isPlaying = true;
      self.emit('play', self.data, firstPlay);
    }
    if(firstPlay) {
      firstPlay = false;
      $net.postJSON('/h5/work/addViews', { id: self.data.id });
    }
  }
  pause() {
    let self = this;
    if(self.isVideo) {
      self.ref.video.element.pause();
      self.isPlaying = false;
      self.emit('pause', self.data);
    }
    else if(mediaService) {
      jsBridge.media({
        key: 'pause',
      }, function() {
        self.isPlaying = false;
        self.emit('pause', self.data);
      });
    }
    else {
      self.ref.audio.element.pause();
      self.isPlaying = false;
      self.emit('pause', self.data);
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
  clickFullScreen() {
    if(jsBridge.ios) {
      jsBridge.fullscreen(true);
    }
    let video = this.ref.video.element;
    if(video.requestFullscreen) {
      video.requestFullscreen();
    }
    else if(video.mozRequestFullscreen) {
      video.mozRequestFullscreen();
    }
    else if(video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
    else if(video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
    else if(video.webkitEnterFullScreen) {
      video.webkitEnterFullScreen();
    }
    this.emit('fullscreen', this.data);
  }
  touchStart(e) {
    e.preventDefault();
    let self = this;
    if(self.canControl && e.touches.length === 1) {
      dragPlaying = self.isPlaying;
      isStart = true;
      self.pause();
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
  touchEnd() {
    if(isStart) {
      if(dragPlaying) {
        this.play();
      }
      isStart = false;
    }
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
  clickLike() {
    let self = this;
    if(!self.data) {
      return;
    }
    self.emit('clickLike', self.data);
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingLike) {
      return;
    }
    loadingLike = true;
    let item = self.data;
    let url = self.isLike ? 'unLike' : 'like';
    ajaxLike = $net.postJSON('/h5/works/' + url, {
      workId: item.id, id: item.worksId,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isLike = item.isLike = data.state;
        self.likeCount = item.likeCount = data.count;
        self.emit('like', item);
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loadingLike = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loadingLike = false;
    });
  }
  clickFavor() {
    let self = this;
    if(!self.data) {
      return;
    }
    self.emit('clickFavor', self.data);
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingFavor) {
      return;
    }
    loadingFavor = true;
    let item = self.data;
    let url = self.isFavor ? 'unFavor' : 'favor';
    ajaxFavor = $net.postJSON('/h5/works/' + url, {
      workId: item.id, id: item.worksId,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isFavor = item.isFavor = data.state;
        self.favorCount = item.favorCount = data.count;
        self.emit('favor', item);
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loadingFavor = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loadingFavor = false;
    });
  }
  clickDownload() {
    let self = this;
    if(!self.data) {
      return;
    }
    self.emit('clickDownload',  self.data);
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(jsBridge.ios) {
      jsBridge.toast('ios暂不支持下载音视频~');
      return;
    }
    let url = self.data.url;
    if(!url) {
      return;
    }
    let id = self.data.id;
    let kind = self.data.kind;
    let title = self.data.title;
    let name = id;
    let type = url.match(/\.\w+$/);
    if(type) {
      name += type;
    }
    if(/^\/\//.test(url)) {
      url = location.protocol + url;
    }
    jsBridge.networkInfo(function(res) {
      if(res.available) {
        if(res.wifi) {
          jsBridge.download({
            url,
            name,
            kind,
            title,
          });
          jsBridge.setPreference('work_' + id, self.data);
        }
        else {
          jsBridge.confirm("检测到当前网络环境非wifi，继续下载可能会产生流量，是否确定继续？", function(res) {
            if(!res) {
              return;
            }
            jsBridge.download({
              url,
              name,
              kind,
              title,
            });
            jsBridge.setPreference('work_' + id, self.data);
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
    self.emit('clickShare', self.data);
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      canShareIn: true,
      clickShareIn: function(botFn) {
        if(!self.data) {
          return;
        }
        jsBridge.pushWindow('/sub_post.html?worksId=' + self.data.worksId
          + '&workId=' + self.data.id
          + '&cover=' + encodeURIComponent(self.data.cover || self.data.worksCover || ''), {
          title: '画个圈',
          optionMenu: '发布',
        });
        botFn.cancel();
      },
      clickShareWb: function(botFn) {
        if(!self.data) {
          return;
        }
        let url = window.ROOT_DOMAIN + '/works/' + self.data.worksId + '/' + self.data.id;
        let text = '【' + self.data.title;
        if(self.data.subTitle) {
          text += ' ' + self.data.subTitle;
        }
        text += '】';
        let hash = {};
        self.data.author.forEach((item) => {
          item.list.forEach((author) => {
            if(!hash[author.id]) {
              hash[author.id] = true;
              text += author.name + ' ';
            }
          });
        });
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
        let url = window.ROOT_DOMAIN + '/works/' + self.data.worksId + '/' + self.data.id;
        $util.setClipboard(url);
        botFn.cancel();
      },
    });
  }
  render() {
    return <div class="mod-media">
      <div class={ 'c'  + (this.isVideo ? ' is-video' : '') + (this.isPlaying ? ' is-playing' : '') }>
        <div class="cover">
          <img class={ this.lrcMode && this.lrc.data ? 'blur' : '' }
               src={ $util.img((this.data || {}).cover || (this.data || {}).worksCover, 750, 750, 80)
                 || '/src/common/blank.png' }/>
        </div>
        <video ref="video"
               poster="/src/common/blank.png"
               onTimeupdate={ this.onTimeupdate }
               onLoadedmetadata={ this.onLoadedmetadata }
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
          <b class="full-screen"
             onClick={ this.clickFullScreen }/>
        </div>
        <b class={ 'start' + (this.isPlaying ? ' fn-hide' : '') } onClick={ this.play }/>
        <div class="time">
          <span class="now">{ $util.formatTime(this.currentTime) }</span>
          <span class="total">{ $util.formatTime(this.duration) }</span>
        </div>
        <div class={ 'progress' + (this.canControl ? ' can' : '') }>
          <div class="load"
               ref="load"/>
          <b class="vol"
             ref="vol"/>
          <b class="p"
             ref="p"
             onTouchStart={ this.touchStart }
             onTouchMove={ this.touchMove }
             onTouchEnd={ this.touchEnd }/>
        </div>
      </div>
      <ul class="btn">
        <li onClick={ this.clickLike }>
          <b class={ 'like' + (this.isLike ? ' liked' : '') }/>
          <span>{ this.likeCount || '点赞' }</span>
        </li>
        <li onClick={ this.clickFavor }>
          <b class={ 'favor' + (this.isFavor ? ' favored' : '') }/>
          <span>{ this.favorCount || '收藏' }</span>
        </li>
        <li class="ios"
            onClick={ this.clickDownload }>
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
