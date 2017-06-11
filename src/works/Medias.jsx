/**
 * Created by army on 2017/6/10.
 */
 
class Medias extends migi.Component {
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
      let winWidth = $window.width();
      let $lis = $switch.find('li.item');
      let lefts = [];
      for(let i = 0, len = $lis.length; i < len; i++) {
        lefts.push($lis.eq(i).offset().left);
      }
      for(let i = 0, len = $lis.length; i < len; i++) {
        let $item = $lis.eq(i);
        $item.css('-webkit-transform', `translate3d(${winWidth-lefts[i]-40}px,${i*40}px,0)`);
        $item.css('transform', `translate3d(${winWidth-lefts[i]-40}px,${i*40}px,0)`);
      }
      $window.on('scroll', function() {
        let diff = top - $window.scrollTop();
        if(diff > 0) {
          $switch.removeClass('fix');
          for(let i = 0, len = $lis.length; i < len; i++) {
            let $item = $lis.eq(i);
            $item.css('-webkit-transform', `translate3d(${Math.floor((winWidth-lefts[i]-40)*diff/top)}px,${Math.floor(i*40*diff/top)}px,0)`);
            $item.css('transform', `translate3d(${Math.floor((winWidth-lefts[i]-40)*diff/top)}px,${Math.floor(i*40*diff/top)}px,0)`);
          }
        }
        else {
          $switch.addClass('fix');
          $lis.removeAttr('style');
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
          <li class="item video cur"/>
          <li class="placeholder"/>
          <li class="item audio"/>
          <li class="placeholder"/>
          <li class="item image"/>
          <li class="placeholder"/>
          <li class="item link"/>
        </ul>
      </div>
    </div>;
  }
}

export default Medias;
