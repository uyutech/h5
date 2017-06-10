/**
 * Created by army on 2017/6/10.
 */
 
class Video extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let video = this.ref.video.element;
      let interval = setInterval(function() {
        if(video.readyState > 0) {
          clearInterval(interval);
          console.log(video.readyState, video.duration);
        }
      }, 200);
    });
  }
  playing(e) {
    console.log(2);
  }
  loadedmetadata(e) {
    let video = this.ref.video.element;
    console.log(video.readyState, video.duration);
  }
  render() {
    return <div class="video">
      <video
        onPlaying={ this.playing }
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
