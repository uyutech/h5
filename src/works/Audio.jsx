/**
 * Created by army on 2017/6/11.
 */

class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  timeupdate(e) {
    this.emit('timeupdate', e.target.currentTime);
  }
  loadedmetadata(e) {
    let duration = e.target.duration;
    this.emit('loadedmetadata', {
      duration,
    });
  }
  play() {
    this.ref.audio.element.play();
  }
  pause() {
    this.ref.audio.element.pause();
  }
  currentTime(t) {
    this.ref.audio.element.currentTime = t;
  }
  render() {
    return <div class="audio">
      <audio ref="audio"
        onTimeupdate={ this.timeupdate }
        onLoadedmetadata={ this.loadedmetadata }
        preload="meta"
        src={ this.props.data[0] }>
        your browser does not support the audio tag
      </audio>
      <ul class="btn">
        <li class="like"/>
        <li class="download"/>
        <li class="share"/>
        <li class="origin"/>
      </ul>
    </div>;
  }
}

export default Audio;
