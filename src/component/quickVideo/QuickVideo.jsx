/**
 * Created by army8735 on 2018/3/6.
 */

'use strict';

import util from '../../common/util';

class QuickVideo extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.cover = self.props.cover;
    self.sName = self.props.name;
    self.playCount = self.props.playCount;
    self.url = self.props.url;
  }
  @bind cover
  @bind sName
  @bind playCount
  @bind showVideo
  @bind isPlaying
  clickPic() {
    let self = this;
    self.ref.video.element.src = self.url;
    self.play();
  }
  clickVideo() {
    let self = this;
    if(self.isPlaying) {
      self.pause();
    }
    else {
      self.play();
    }
  }
  play() {
    let self = this;
    self.showVideo = true;
    self.isPlaying = true;
    let video = self.ref.video;
    video.element.play();
    self.emit('play');
  }
  pause() {
    let self = this;
    self.isPlaying = false;
    let video = self.ref.video;
    video.element.pause();
    self.emit('pause');
  }
  render() {
    return <div class="cp-quick-video">
      <div class="pic"
           onClick={ this.clickPic }>
        <img src={ util.autoSsl(util.img750__80(this.cover || '/src/common/blank.png')) }/>
        <div class="num">
          <span class="play-times">{ util.abbrNum(this.playCount) }次播放</span>
        </div>
      </div>
      <div class={ 'video' + (this.showVideo ? '' : ' fn-hide') + (this.isPlaying ? '' : ' pause') }
           ref="v"
           onClick={ this.clickVideo }>
        <video ref="video"
               poster="/src/common/blank.png"
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
      </div>
    </div>;
  }
}

export default QuickVideo;
