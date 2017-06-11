/**
 * Created by army on 2017/6/10.
 */
 
class Video extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let video = self.video = self.ref.video.element;
      let interval = setInterval(function() {
        if(video.readyState > 0) {
          clearInterval(interval);
          // console.log(video.readyState, video.duration);
        }
      }, 200);
  
      video.addEventListener('x5videoenterfullscreen', function() {
        self.emit('playing');
      });
      video.addEventListener('x5videoexitfullscreen', function() {
        self.emit('pause');
      });
      video.addEventListener('play', function() {
      });
      video.addEventListener('playing', function() {
        self.emit('playing');
      });
      video.addEventListener('pause', function() {
        self.emit('pause');
      });
    });
  }
  playing(e) {
    // $(this.ref.switch.element).hide();
  }
  pause() {
    // let video = this.ref.video.element;
    // $(video).hide();
  }
  loadedmetadata(e) {
    let video = this.video;
    if(video.readyState > 0) {
      // console.log(video.readyState, video.duration);
    }
  }
  togglePlay(e, vd) {
    let $vd = $(vd.element);
    if($vd.hasClass('pause')) {
      this.video.pause();
    }
    else {
      this.video.play();
    }
    $vd.toggleClass('pause');
  }
  render() {
    return <div class="video">
      <video
        onPlaying={ this.playing }
        onPause={ this.pause }
        onLoadedmetadata={ this.loadedmetadata }
        ref="video"
        preload="preload"
        playsinline="true"
        webkit-playsinline="true"
        controls="controls"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        src={ 'http://192.168.100.199/github/zhuanq/h5/ssc.mp4' }>
        your browser does not support the video tag
      </video>
    </div>;
  }
}

export default Video;
