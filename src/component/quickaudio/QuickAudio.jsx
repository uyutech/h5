/**
 * Created by army8735 on 2018/3/6.
 */

'use strict';

import util from '../../common/util';

class QuickAudio extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.cover = self.props.cover;
    self.sName = self.props.name;
    self.author = self.props.author;
    self.url = self.props.url;
  }
  @bind cover
  @bind sName
  @bind author
  @bind isPlaying
  clickPic() {
    let self = this;
    if(!self.hasPlay) {
      self.hasPlay = true;
      let audio = self.ref.audio;
      audio.element.src = self.url;
    }
    if(self.isPlaying) {
      self.pause();
    }
    else {
      self.play();
    }
  }
  play() {
    let self = this;
    self.isPlaying = true;
    let audio = self.ref.audio;
    audio.element.play();
    self.emit('play');
  }
  pause() {
    let self = this;
    self.isPlaying = false;
    let audio = self.ref.audio;
    audio.element.pause();
    self.emit('pause');
  }
  render() {
    return <div class="cp-quick-audio">
      <div class={ 'pic' + (this.hasPlay ? (this.isPlaying ? ' play' : ' pause') : '') }
           onClick={ this.clickPic }>
        <img src={ util.autoSsl(util.img750__80(this.cover || '/src/common/blank.png')) }/>
      </div>
      <div class="txt">
        <h4>{ this.sName }</h4>
        <p>
        {
          (this.author.AuthorInfo || []).map(function(item) {
            return item.AuthorName;
          }).join(' ')
        }
        </p>
      </div>
      <audio ref="audio"
             preload="meta"/>
    </div>;
  }
}

export default QuickAudio;
