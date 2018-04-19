/**
 * Created by army8735 on 2018/1/19.
 */

'use strict';

class BotPlayBar extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.hidden = self.props.hidden;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference('playMode', function(res) {
        res = res || 'loop';
        self.mode = res;
      });
    });
  }
  @bind hidden
  @bind isPlaying
  @bind mode
  show() {
    this.hidden = false;
  }
  hide() {
    this.hidden = true;
  }
  clickMode() {
    let self = this;
    if(self.mode === 'loop') {
      self.mode = 'repeat';
    }
    else if(self.mode === 'repeat') {
      self.mode = 'loop';
    }
    else {
      return;
    }
    self.emit('mode', self.mode);
    jsBridge.setPreference('playMode', self.mode);
  }
  clickPrev() {
    this.emit('prev');
  }
  clickPlay() {
    this.emit(this.isPlaying ? 'pause' : 'play');
  }
  clickNext() {
    this.emit('next');
  }
  clickComment() {
    this.emit('comment');
  }
  render() {
    return <ul class={ 'cp-botplaybar' + (this.hidden ? ' fn-hide' : '') }>
      <li class={ 'mode ' + this.mode } onClick={ this.clickMode }/>
      <li class="prev" onClick={ this.clickPrev }/>
      <li class={ 'play' + (this.isPlaying ? ' pause' : '') } onClick={ this.clickPlay }/>
      <li class="next" onClick={ this.clickNext }/>
      <li class="comment" onClick={ this.clickComment }/>
    </ul>;
  }
}

export default BotPlayBar;
