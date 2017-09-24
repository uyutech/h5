/**
 * Created by army8735 on 2017/9/7.
 */

let de = document.documentElement;

class Video extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  setData(data) {
    let self = this;
    self.data = data;
    self.isLike = data[0].ISLike;
    self.isFavor = data[0].ISFavor;
    self.fileUrl = data[0].FileUrl;
    self.cover = data[0].VideoCoverPic;
    return this;
  }
  show() {
    $(this.element).removeClass('fn-hide');
    $(this.ref.poster.element).removeClass('fn-hide');
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
  }
  timeupdate(e) {
    let currentTime = e.target.currentTime;
    this.emit('timeupdate', currentTime);
  }
  loadedmetadata(e) {
    let duration = this.duration = e.target.duration;
    this.hasLoaded = true;
    this.emit('loadedmetadata', {
      duration,
    });
  }
  playing(e) {
    let duration = this.duration = e.target.duration;
    this.emit('playing', {
      duration,
    });
  }
  onpause() {
    this.emit('pause');
  }
  play() {
    this.ref.video.element.play();
    $(this.ref.poster.element).addClass('fn-hide');
    return this;
  }
  pause() {
    this.ref.video.element.pause();
    return this;
  }
  currentTime(t) {
    this.ref.video.element.currentTime = t;
    return this;
  }
  @bind cover
  @bind fileUrl
  @bind isLike
  @bind isFavor
  @bind workIndex = 0
  @bind duration
  @bind hasLoaded
  clear() {
    this.fileUrl = '';
    this.workIndex = 0;
    this.duration = 0;
    this.hasLoaded = false;
    $(this.ref.poster.element).removeClass('fn-hide');
    return this;
  }
  clickLike(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if(!$vd.hasClass('loading')) {
      $vd.addClass('loading');
      util.postJSON('api/works/AddLikeBehavior', {WorkItemsID: self.data[self.workIndex].ItemID}, function (res) {
        if(res.success) {
          self.isLike = res.data === 211;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickFavor(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if($vd.hasClass('loading')) {
      //
    }
    else if($vd.hasClass('has')) {
      util.postJSON('api/works/RemoveCollection', { WorkItemsID: self.data[self.workIndex].ItemID }, function (res) {
        if(res.success) {
          self.isFavor = false;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
    else {
      util.postJSON('api/works/AddCollection', { WorkItemsID: self.data[self.workIndex].ItemID }, function (res) {
        if(res.success) {
          self.isFavor = true;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickDownload(e) {
    if(window.$CONFIG.isLogin !== 'True') {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
    }
  }
  clickShare() {
    migi.eventBus.emit('share');
  }
  clickScreen() {
    let video = this.ref.video.element;
    if(de.requestFullscreen) {
      video.requestFullscreen();
    }
    else if(de.mozRequestFullscreen) {
      video.mozRequestFullscreen();
    }
    else if(de.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
    else if(de.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  }
  clickPoster() {
    if(this.top.canControl) {
      this.play();
      this.emit('play');
      $(this.ref.poster.element).addClass('fn-hide');
    }
  }
  render() {
    return <div class="video fn-hide">
      <video ref="video"
             poster={ this.cover }
             onTimeupdate={ this.timeupdate }
             onLoadedmetadata={ this.loadedmetadata }
             onPause={ this.onpause }
             onPlaying={ this.playing }
             preload="metadata"
             playsinline="true"
             webkit-playsinline="true"
             src={ this.fileUrl }>
        your browser does not support the audio tag
      </video>
      <div ref="poster" class="poster"
        style={ 'background-image:url(' + (this.cover || '//zhuanquan.xyz/img/blank.png') + ')' }
        onClick={ this.clickPoster }/>
      <ul class="btn" ref="btn">
        <li class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.clickLike }/>
        <li class={ 'favor' + (this.isFavor ? ' has' : '') } onClick={ this.clickFavor }/>
        <li class="download"><a href={ this.fileUrl } download={ this.fileUrl } onClick={ this.clickDownload }/></li>
        <li class="share" onClick={ this.clickShare }/>
        <li class="screen" onClick={ this.clickScreen }/>
      </ul>
    </div>;
  }
}

export default Video;
