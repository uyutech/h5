/**
 * Created by army on 2017/6/11.
 */

import LyricsParser from './LyricsParser.jsx';

let lyricsIndex = -1;
let lyricsHeight = [];
let $lyricsRoll;

class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  setData(data) {
    let self = this;
    self.data = data;
    self.isLike = data[0].ISLike;
    self.isFavor = data[0].ISFavor;
    self.fileUrl = data[0].FileUrl;
    data.forEach(function(item) {
      let l = {};
      if(LyricsParser.isLyrics(item.lrc)) {
        l.is = true;
        l.txt = LyricsParser.getTxt(item.lrc);
        l.data = LyricsParser.parse(item.lrc);
      }
      else {
        l.is = false;
        l.txt = item.lrc;
      }
      item.formatLyrics = l;
    });
    self.rollLyrics = data[0].formatLyrics.data;
    let count = 0;
    $lyricsRoll = $(self.ref.lyricsRoll.element);
    $lyricsRoll.find('pre').each(function() {
      lyricsHeight.push(count);
      count += 20;
    });
    return this;
  }
  show() {
    $(this.element).removeClass('fn-hide');
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
  }
  timeupdate(e) {
    let currentTime = e.target.currentTime;
    // console.log(currentTime);
    let item = this.data[this.workIndex];
    let formatLyrics = item.formatLyrics;
    let formatLyricsData = formatLyrics.data;
    if(formatLyrics.is && formatLyricsData.length) {
      let tempIndex = lyricsIndex;
      for (let i = 0, len = formatLyricsData.length; i < len; i++) {
        if(currentTime * 1000 >= formatLyricsData[i].timestamp) {
          tempIndex = i;
        }
        else {
          break;
        }
      }
      if(tempIndex !== lyricsIndex) {
        // console.log(lyricsIndex, tempIndex);
        lyricsIndex = tempIndex;
        this.lineLyrics = formatLyricsData[lyricsIndex].txt;
        $lyricsRoll.find('.cur').removeClass('cur');
        $lyricsRoll.find('pre').eq(lyricsIndex).addClass('cur');
        $lyricsRoll.css('-webkit-transform', `translate3d(0,${-lyricsHeight[lyricsIndex]}px,0)`);
        $lyricsRoll.css('transform', `translate3d(0,${-lyricsHeight[lyricsIndex]}px,0)`);
      }
    }
    this.emit('timeupdate', currentTime);
  }
  loadedmetadata(e) {
    let duration = this.duration = e.target.duration;
    this.hasLoaded = true;
    this.emit('loadedmetadata', {
      duration,
    });
  }
  playing(e) {
    let duration = this.duration = e.target.duration;
    this.emit('playing', {
      duration,
    });
  }
  play() {
    this.ref.audio.element.play();
    return this;
  }
  pause() {
    this.ref.audio.element.pause();
    return this;
  }
  currentTime(t) {
    this.ref.audio.element.currentTime = t;
    return this;
  }
  @bind fileUrl
  @bind isLike
  @bind isFavor
  @bind workIndex = 0
  @bind lineLyrics
  @bind rollLyrics = []
  @bind showLyricsMode
  @bind duration
  @bind hasLoaded
  clickLike(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if(!$vd.hasClass('loading')) {
      $vd.addClass('loading');
      util.postJSON('api/works/AddLikeBehavior', {WorkItemsID: self.data[self.workIndex].ItemID}, function (res) {
        if(res.success) {
          self.isLike = res.data === 211;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickFavor(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if($vd.hasClass('loading')) {
      //
    }
    else if($vd.hasClass('has')) {
      util.postJSON('api/works/RemoveCollection', { WorkItemsID: self.data[self.workIndex].ItemID }, function (res) {
        if(res.success) {
          self.isFavor = false;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
    else {
      util.postJSON('api/works/AddCollection', { WorkItemsID: self.data[self.workIndex].ItemID }, function (res) {
        if(res.success) {
          self.isFavor = true;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $vd.removeClass('loading');
      }, function () {
        alert(res.message || util.ERROR_MESSAGE);
        $vd.removeClass('loading');
      });
    }
  }
  clickDownload(e) {
    if(window.$CONFIG.isLogin !== 'True') {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
    }
  }
  altLyrics() {
    this.showLyricsMode = !this.showLyricsMode;
  }
  clickShare() {
    migi.eventBus.emit('share');
  }
  clear() {
    this.duration = 0;
    this.fileUrl = '';
    this.lineLyrics = '';
    this.rollLyrics = [];
    this.hasLoaded = false;
    return this;
  }
  render() {
    return <div class="audio fn-hide">
      <audio ref="audio"
        onTimeupdate={ this.timeupdate }
        onLoadedmetadata={ this.loadedmetadata }
        onPlaying={ this.playing }
        preload="metadata"
        src={ this.fileUrl }>
        your browser does not support the audio tag
      </audio>
      <ul class="btn">
        <li class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.clickLike }/>
        <li class={ 'favor' + (this.isFavor ? ' has' : '') } onClick={ this.clickFavor }/>
        <li class="download"><a href={ this.fileUrl } download={ this.fileUrl } onClick={ this.clickDownload }/></li>
        <li class="share" onClick={ this.clickShare }/>
      </ul>
      <div class="lyrics-con">
        <div class={ 'lyrics-roll' + (!this.showLyricsMode ? '' : ' fn-hide') }>
          <div class="c" ref="lyricsRoll">
            {
              (this.rollLyrics || []).map(function(item) {
                return <pre>{ item.txt || '&nbsp;' }</pre>
              })
            }
          </div>
        </div>
        <pre class={ 'lyrics-line' + (this.showLyricsMode ? '' : ' fn-hide') }>{ this.lineLyrics }</pre>
        <span class={ 'lyrics' + (this.showLyricsMode ? '' : ' alt') } onClick={ this.altLyrics }/>
      </div>
    </div>;
  }
}

export default Audio;
