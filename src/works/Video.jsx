/**
 * Created by army on 2017/6/10.
 */
 
class Video extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let video = this.video = this.ref.video.element;
      let interval = setInterval(function() {
        if(video.readyState > 0) {
          clearInterval(interval);
          // console.log(video.readyState, video.duration);
        }
      }, 200);
      
      let $window = $(window);
      let $switch = $(this.ref.switch.element);
      let $nav = $(this.props.nav.element);
      let top = $switch.offset().top - $nav.height();
      $window.on('scroll', function() {
        let diff = $window.scrollTop() - top;
        if(diff <= 0) {
          $switch.removeClass('fix');
        }
        else {
          $switch.addClass('fix');
        }
      });
  
      video.addEventListener('x5videoenterfullscreen', function() {
        // $switch.hide();
      });
      video.addEventListener('x5videoexitfullscreen', function() {
        // $switch.show();
      });
      video.addEventListener('play', function() {
        console.log(1);
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
    let video = this.ref.video.element;
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
      <div class="switch" ref="switch">
        <b class="bg"/>
        <ul>
          <li class="video"/>
          <li class="audio"/>
          <li class="image"/>
          <li class="link"/>
        </ul>
      </div>
      <video
        onPlaying={ this.playing }
        onPause={ this.pause }
        onLoadedmetadata={ this.loadedmetadata }
        ref="video"
        preload="preload"
        playsinline="true"
        webkit-playsinline="true"
        controls="controls"
        src={ 'http://192.168.100.199/github/zhuanq/h5/ssc.mp4' }>
        your browser does not support the video tag
      </video>
    </div>;
  }
}

export default Video;
