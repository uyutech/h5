/**
 * Created by army on 2017/6/11.
 */

let WIDTH = $(window).width();
let currentTime = 0;
let duration = 0;
let isStart;
let isMove;

class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    let $root = $(this.element);
    if($root.hasClass('fn-hide')) {
      $root.removeClass('fn-hide');
    }
  }
  @bind canControl
  timeupdate(e) {
    let audio = e.target;
    let percent = audio.currentTime / duration;
    this.setBarPercent(percent);
  }
  loadedmetadata(e) {
    duration = e.target.duration;
    this.canControl = true;
  }
  clickPlay(e, vd) {
    let audio = this.ref.audio.element;
    let $play = $(vd.element);
    if(!$play.closest('.c').hasClass('hide-control')) {
      if($play.hasClass('pause')) {
        audio.pause();
      }
      else {
        audio.play();
      }
      $play.toggleClass('pause');
    }
  }
  clickProgress(e) {
    if(this.canControl && e.target.className !== 'point' && !$(this.element).closest('.c').hasClass('hide-control')) {
      let x = e.pageX;
      let percent = x / WIDTH;
      let currentTime = Math.floor(duration * percent);
      this.ref.audio.element.currentTime = currentTime;
    }
  }
  start(e) {
    if(e.touches.length === 1 && !$(this.element).closest('.c').hasClass('hide-control')) {
      isStart = true;
      this.ref.audio.element.pause();
      $(this.ref.play.element).removeClass('pause');
    }
  }
  move(e) {
    if(isStart) {
      isMove = true;
      e.preventDefault();
      let x = e.touches[0].pageX;
      let percent = x / WIDTH;
      this.setBarPercent(percent);
      currentTime = Math.floor(duration * percent);
    }
  }
  end() {
    if(isMove) {
      this.ref.audio.element.currentTime = currentTime;
    }
    isStart = isMove = false;
  }
  setBarPercent(percent) {
    percent *= 100;
    $(this.ref.has.element).css('width', percent + '%');
    $(this.ref.pgb.element).css('-webkit-transform', `translate3d(${percent}%,0,0)`);
    $(this.ref.pgb.element).css('transform', `translate3d(${percent}%,0,0)`);
  }
  render() {
    return <div class="audio" flag="1">
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
