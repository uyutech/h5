/**
 * Created by army8735 on 2017/9/7.
 */

import util from '../common/util';
import net from '../common/net';

let isStart;
let offsetX;

class Video extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
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
          self.addMedia();
        });
      }
    }
  }
  @bind datas = []
  @bind index = 0
  @bind isPlaying
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
    return this;
  }
  addMedia() {
    let video = <video ref="video"
                       poster="/src/common/blank.png"
                       src={ this.datas[this.index].FileUrl }
                       onClick={ this.clickPlay.bind(this) }
                       onTimeupdate={ this.onTimeupdate.bind(this) }
                       onLoadedmetadata={ this.onLoadedmetadata.bind(this) }
                       onProgress={ this.onProgress.bind(this) }
                       onPause={ this.onPause.bind(this) }
                       onEnded={ this.onEnded.bind(this) }
                       onPlaying={ this.onPlaying.bind(this) }
                       preload="meta"
                       playsinline="true"
                       webkit-playsinline="true">
      your browser does not support the video tag
    </video>;
    this.video = video;
    video.prependTo(this.ref.c.element);
  }
  switchTo(index) {
    this.index = index;
    if(!this.video) {
      this.addMedia();
    }
    this.video.element.src = this.datas[this.index].FileUrl;
    this.pause();
    this.emit('switchTo', this.datas[this.index]);
  }
  show() {
    $(this.element).removeClass('fn-hide');
    if(!this.video) {
      this.addMedia();
    }
    $(this.ref.fn.element).removeClass('fn-hidden');
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
  }
  onTimeupdate(e) {
    let currentTime = this.currentTime = e.target.currentTime;
    this.duration = e.target.duration;
    let percent = currentTime / this.duration;
    this.setBarPercent(percent);
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
    this.video.element.play();
    this.isPlaying = true;
    return this;
  }
  pause() {
    this.video && this.video.element.pause();
    this.isPlaying = false;
    return this;
  }
  clickType(e, vd, tvd) {
    if(this.index !== tvd.props.rel) {
      this.index = tvd.props.rel;
      this.video.element.src = this.datas[this.index].FileUrl;
      this.emit('switchTo', this.datas[this.index]);
    }
  }
  clickStart(e) {
    this.play();
  }
  clickScreen() {
    let video = this.video.element;
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
      this.video.element.currentTime = this.currentTime = Math.floor(this.duration * percent);
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
      this.video.element.currentTime = this.currentTime = currentTime;
    }
  }
  setBarPercent(percent) {
    if(isNaN(percent)) {
      percent = 0;
    }
    percent *= 100;
    percent = Math.min(percent, 100);
    $(this.ref.vol.element).css('width', percent + '%');
    $(this.ref.p.element).css('-webkit-transform', `translateX(${percent}%)`);
    $(this.ref.p.element).css('transform', `translateX(${percent}%)`);
  }
  clickPlay(e) {
    this.isPlaying ? this.pause() : this.play();
  }
  clickLike(e, vd) {
    if(!$.cookie('isLogin')) {
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
          data.ISLike = res.data === 211;
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
    if(!$.cookie('isLogin')) {
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
  clickDownload(e) {
    if(!$.cookie('isLogin')) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
    }
  }
  clickShare() {
    migi.eventBus.emit('SHARE', '/works/' + this.props.worksID + '/' + this.props.workID);
  }
  render() {
    return <div class={ 'video' + (this.props.show ? '' : ' fn-hide') + (this.datas[this.index || 0].FileUrl ? '' : ' empty') }>
      <div class={ 'c' + ( this.isPlaying ? ' playing' : '') } ref="c">
        <b class={ 'start' + (this.isPlaying ? ' fn-hide' : '') } onClick={ this.clickStart }/>
      </div>
      <div class="fn" ref="fn">
        <div class="control">
          <small class="time">{ util.formatTime(this.currentTime * 1000) } / { util.formatTime(this.duration * 1000) }</small>
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

export default Video;
