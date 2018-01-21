/**
 * Created by army8735 on 2018/1/19.
 */

'use strict';

import util from '../common/util';
import net from '../common/net';
import BotPlayBar from '../component/botplaybar/BotPlayBar.jsx';
import LyricsParser from "../works/LyricsParser.jsx";

let loadingLike;
let loadingFavor;
let ajaxLike;
let ajaxFavor;

let isStart;
let WIDTH = $(window).width();

class Media extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.lrc = {};
    self.lrcIndex = 0;
    self.on(migi.Event.DOM, function() {
      let botPlayBar = self.ref.botPlayBar;
      jsBridge.on('prepared', function(e) {
        if(e.data) {
          self.duration = e.data.duration * 0.001;
          self.canControl = true;
        }
      });
      jsBridge.on('timeupdate', function(e) {
        if(e.data) {
          self.isPlaying = self.ref.botPlayBar.isPlaying = true;
          self.currentTime = e.data.currentTime * 0.001;
          self.duration = e.data.duration * 0.001;
          self.canControl = true;
          self.updateLrc();
          self.setBarPercent(self.currentTime / self.duration);
        }
      });
      jsBridge.on('progress', function(e) {
        if(e.data) {
          let load = self.ref.load.element;
          load.innerHTML = `<b style="width:${e.data.percent}%"/>`;
        }
      });
      botPlayBar.on('play', function() {
        self.play();
      });
      botPlayBar.on('pause', function() {
        self.pause();
      });
      // botFn点赞收藏通过eventBus同步
      migi.eventBus.on('likeWork', function(data) {
        if(data.workID.toString() === self.data.ItemID.toString()
          && data.worksID.toString() === self.data.Works_Items_Works[0].WorksID.toString()) {
          self.isLike = data.state;
        }
      });
      migi.eventBus.on('favorWork', function(data) {
        if(data.workID.toString() === self.data.ItemID.toString()
          && data.worksID.toString() === self.data.Works_Items_Works[0].WorksID.toString()) {
          self.isFavor = data.state;
        }
      });
    });
  }
  @bind data
  @bind cover
  @bind isPlaying
  @bind lrcMode
  @bind lrcIndex
  @bind lrc
  @bind duration
  @bind currentTime
  @bind canControl
  @bind isLike
  @bidn likeNum
  @bind isFavor
  setData(data) {
    let self = this;
    self.data = data;
    let works = data.Works_Items_Works[0];
    self.cover = works.WorksCoverPic;
    self.isLike = data.ISLike;
    self.likeNum = data.LikeHis;
    self.isFavor = data.ISFavor;
    let l = {};
    if(LyricsParser.isLyrics(data.lrc)) {
      l.is = true;
      l.txt = LyricsParser.getTxt(data.lrc);
      l.data = LyricsParser.parse(data.lrc);
    }
    else {
      l.is = false;
      l.txt = data.lrc;
    }
    self.lrc = l;
    if(ajaxLike) {
      ajaxLike.abort();
    }
    if(ajaxFavor) {
      ajaxFavor.abort();
    }
    loadingLike = loadingFavor = false;
    jsBridge.media({
      key: 'info',
      value: {
        url: location.protocol + util.autoSsl(data.FileUrl),
        name: data.ItemID,
      },
    }, function(res) {
      let load = self.ref.load.element;
      if(res.isCached) {
        load.innerHTML = `<b style="width:100%"/>`;
      }
      else {
        load.innerHTML = '';
      }
    });
  }
  setBarPercent(percent) {
    if(isNaN(percent)) {
      percent = 0;
    }
    percent *= 100;
    percent = Math.min(percent, 100);
    $(this.ref.vol.element).css('width', percent + '%');
    let $p = $(this.ref.p.element);
    $p.css('-moz-transform', `translate3d(${percent}%, 0, 0)`);
    $p.css('-webkit-transform', `translate3d(${percent}%, 0, 0)`);
    $p.css('transform', `translate3d(${percent}%, 0, 0)`);
  }
  updateLrc() {
    let item = this.data;
    let lrc = this.lrc;
    let lrcData = lrc.data;
    if(lrc.is && lrcData.length) {
      let tempIndex = this.lrcIndex;
      for (let i = 0, len = lrcData.length; i < len; i++) {
        if(this.currentTime * 1000 >= lrcData[i].timestamp) {
          tempIndex = i;
        }
        else {
          break;
        }
      }
      if(tempIndex !== this.lrcIndex) {
        this.lrcIndex = tempIndex;
      }
    }
  }
  play() {
    let self = this;
    jsBridge.media({
      key: 'play',
    });
    self.isPlaying = self.ref.botPlayBar.isPlaying = true;
    net.postJSON('/h5/works/addPlayCount', { workID: self.data.ItemID });
    return this;
  }
  pause() {
    let self = this;
    jsBridge.media({
      key: 'pause',
    });
    self.isPlaying = self.ref.botPlayBar.isPlaying = false;
  }
  repeat() {
    jsBridge.media({
      key: 'seek',
      value: {
        time: 0,
      },
    });
    this.play();
  }
  touchStart(e) {
    e.preventDefault();
    if(this.canControl && e.touches.length === 1) {
      isStart = true;
      this.pause();
    }
  }
  touchMove(e) {
    if(isStart && e.touches.length === 1) {
      e.preventDefault();
      let diff = e.touches[0].pageX;
      let percent = diff / WIDTH;
      this.setBarPercent(percent);
      let currentTime = Math.floor(this.duration * percent);
      jsBridge.media({
        key: 'seek',
        value: {
          time: currentTime * 1000,
        },
      });
      this.currentTime = currentTime;
      this.setBarPercent(percent);
      this.updateLrc();
    }
  }
  touchEnd(e) {
    isStart = false;
  }
  clickPlay() {
    this.isPlaying ? this.pause() : this.play();
  }
  clickLrcMode() {
    this.lrcMode = !this.lrcMode;
  }
  clickLike() {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingLike) {
      return;
    }
    loadingLike = true;
    let self = this;
    ajaxLike = net.postJSON('/h5/works/likeWork', { workID: self.data.ItemID }, function (res) {console.log(res);
      if(res.success) {
        self.isLike = self.data.ISLike = res.data.State === 'likeWordsUser';
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingLike = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingLike = false;
    });
  }
  clickFavor() {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingFavor) {
      return;
    }
    loadingFavor = true;
    let self = this;
    if(self.isFavor) {
      ajaxFavor = net.postJSON('/h5/works/unFavorWork', { workID: self.data.ItemID }, function (res) {
        if(res.success) {
          self.isFavor = self.data.ISFavor = false;
          self.fnFavor = null;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingFavor = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingFavor = false;
      });
    }
    else {
      ajaxFavor = net.postJSON('/h5/works/favorWork', { workID: self.data.ItemID }, function (res) {
        if(res.success) {
          self.isFavor = self.data.ISFavor = true;
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingFavor = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingFavor = false;
      });
    }
  }
  render() {
    return <div class="mod-media">
      <div class="c">
        <div class="cover">
          <img class={ this.lrcMode && this.lrc.data ? 'blur' : '' }
               src={ util.autoSsl(util.img750_750_80(this.cover || '/src/common/blank.png')) }/>
        </div>
        <div class="lrc" ref="lrc">
          <div class={ 'roll' + (this.lrcMode && this.lrc.data ? '' : ' fn-hide') }>
            <div class="c" ref="lrcRoll" style={ '-webkit-transform:translateY(-' + this.lrcIndex * 24 + 'px);transform:translateY(-' + this.lrcIndex * 24 + 'px)' }>
              {
                (this.lrc.data || []).map(function(item) {
                  return <pre>{ item.txt || ' ' }</pre>;
                })
              }
            </div>
          </div>
          <div class={ 'line' + (!this.lrcMode && this.lrc.txt ? '' : ' fn-hide') }>
            <pre style={ '-webkit-transform:translateY(-' + this.lrcIndex * 24 + 'px);transform:translateY(-' + this.lrcIndex * 24 + 'px)' }>{ this.lrc.txt }</pre>
          </div>
        </div>
        <div class="control">
          <b class={ 'play' + (this.isPlaying ? ' pause' : '') } onClick={ this.clickPlay }/>
          <b class={ 'lrc' + (this.lrcMode ? ' roll' : '') } onClick={ this.clickLrcMode }/>
        </div>
        <div class="time">
          <span class="now">{ util.formatTime(this.currentTime) }</span>
          <span class="total">{ util.formatTime(this.duration) }</span>
        </div>
        <div class={ 'progress' + (this.canControl ? ' can' : '') }>
          <div class="load" ref="load"/>
          <b class="vol" ref="vol"/>
          <b class="p" ref="p" onTouchStart={ this.touchStart } onTouchMove={ this.touchMove } onTouchEnd={ this.touchEnd }/>
        </div>
      </div>
      <ul class="btn">
        <li onClick={ this.clickLike }>
          <b class={ 'like' + (this.isLike ? ' liked' : '') }/>
          <span>{ this.isLike ? this.data.LikeHis : '点赞' }</span>
        </li>
        <li onClick={ this.clickFavor }>
          <b class={ 'favor' + (this.isFavor ? ' favored' : '') }/>
          <span>{ this.isFavor ? '已收藏' : '收藏' }</span>
        </li>
        <li>
          <b class="download"/>
          <span>下载</span>
        </li>
        <li>
          <b class="share"/>
          <span>分享</span>
        </li>
      </ul>
      <BotPlayBar ref="botPlayBar"/>
    </div>;
  }
}

export default Media;
