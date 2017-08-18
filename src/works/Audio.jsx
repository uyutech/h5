/**
 * Created by army on 2017/6/11.
 */

let last;

class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
    this.data = this.props.data;
    this.isLike = this.data[0].ISLike;
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
  @bind isLike
  @bind workIndex = 0
  clickLike() {
    let self = this;
    if(last) {
      last.abort();
    }
    last = util.postJSON('api/works/AddLikeBehavior', { WorkItemsID: self.data[self.workIndex].ItemID }, function(res) {
      if(res.success) {
        self.isLike = res.data === 211;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function() {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="audio">
      <audio ref="audio"
        onTimeupdate={ this.timeupdate }
        onLoadedmetadata={ this.loadedmetadata }
        preload="meta"
        src={ this.data[0].FileUrl }>
        your browser does not support the audio tag
      </audio>
      <ul class="btn">
        <li class={ 'like' + (this.isLike ? ' is' : '') } onClick={ this.clickLike }/>
        <li class="download"/>
        <li class="share"/>
        <li class="origin"/>
      </ul>
    </div>;
  }
}

export default Audio;
