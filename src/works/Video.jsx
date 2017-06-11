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
      
      let $window = $(window);
      let $switch = $(self.ref.switch.element);
      let $nav = $(self.props.nav.element);
      let top = $switch.offset().top - $nav.height();
      let itemWidth = 40;
      let totalHeight = 200;
      let winWidth = $window.width();
      let $video = $switch.find('.video');
      let videoLeft = $video.offset().left;
      $video.css('transform', `translate3d(${winWidth-videoLeft-40}px,0,0)`);
      let $audio = $switch.find('.audio');
      let audioLeft = $audio.offset().left;
      $audio.css('-webkit-transform', `translate3d(${winWidth-audioLeft-40}px,40px,0)`);
      $audio.css('transform', `translate3d(${winWidth-audioLeft-40}px,40px,0)`);
      let $image = $switch.find('.image');
      let imageLeft = $image.offset().left;
      $image.css('-webkit-transform', `translate3d(${winWidth-imageLeft-40}px,80px,0)`);
      $image.css('transform', `translate3d(${winWidth-imageLeft-40}px,80px,0)`);
      let $link = $switch.find('.link');
      let linkLeft = $link.offset().left;
      $link.css('-webkit-transform', `translate3d(${winWidth-linkLeft-40}px,120px,0)`);
      $link.css('transform', `translate3d(${winWidth-linkLeft-40}px,120px,0)`);
      $window.on('scroll', function() {
        let diff = top - $window.scrollTop();
        if(diff > 0) {
          $switch.removeClass('fix');
          $video.css('-webkit-transform', `translate3d(${Math.floor((winWidth-videoLeft-40)*diff/top)}px,0,0)`);
          $video.css('transform', `translate3d(${Math.floor((winWidth-videoLeft-40)*diff/top)}px,0,0)`);
          $audio.css('-webkit-transform', `translate3d(${Math.floor((winWidth-audioLeft-40)*diff/top)}px,${Math.floor(40*diff/top)}px,0)`);
          $audio.css('transform', `translate3d(${Math.floor((winWidth-audioLeft-40)*diff/top)}px,${Math.floor(40*diff/top)}px,0)`);
          $image.css('-webkit-transform', `translate3d(${Math.floor((winWidth-imageLeft-40)*diff/top)}px,${Math.floor(80*diff/top)}px,0)`);
          $image.css('transform', `translate3d(${Math.floor((winWidth-imageLeft-40)*diff/top)}px,${Math.floor(80*diff/top)}px,0)`);
          $link.css('-webkit-transform', `translate3d(${Math.floor((winWidth-linkLeft-40)*diff/top)}px,${Math.floor(120*diff/top)}px,0)`);
          $link.css('transform', `translate3d(${Math.floor((winWidth-linkLeft-40)*diff/top)}px,${Math.floor(120*diff/top)}px,0)`);
        }
        else {
          $switch.addClass('fix');
          $video.removeAttr('style');
          $audio.removeAttr('style');
          $image.removeAttr('style');
          $link.removeAttr('style');
        }
      });
  
      video.addEventListener('x5videoenterfullscreen', function() {
        $switch.hide();
      });
      video.addEventListener('x5videoexitfullscreen', function() {
        $switch.show();
      });
      video.addEventListener('play', function() {
        // console.log(1);
      });
      video.addEventListener('playing', function() {
        // requestAnimFrame(draw);
      });
      video.addEventListener('pause', function() {
        //
      });
      // let canvas = this.canvas = this.ref.canvas.element;
      // let width = $(canvas).width();
      // let height = $(canvas).height();
      // let ctx = canvas.getContext('2d');
      // function draw() {
      //   ctx.clearRect(0, 0, width, height);
      //   ctx.drawImage(video, 0, 0, width, height);
      //   requestAnimFrame(draw);
      // }
      // video.play();
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
    return <div class="videos">
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
      <div class="switch" ref="switch">
        <b class="bg"/>
        <ul>
          <li class="video cur"/>
          <li class="placeholder"/>
          <li class="audio"/>
          <li class="placeholder"/>
          <li class="image"/>
          <li class="placeholder"/>
          <li class="link"/>
        </ul>
      </div>
    </div>;
  }
}

export default Video;
