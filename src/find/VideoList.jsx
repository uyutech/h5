/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let last;
let isPlaying;

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList;
    if(self.props.visible !== undefined) {
      self.visible = self.props.visible;
    }
  }
  @bind message
  @bind visible = true
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
    this.clearLast();
    last = null;
    isPlaying = false;
  }
  setData(data) {
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).html(s);
  }
  appendData(data) {
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).append(s);
  }
  genItem(item) {
    let self = this;
    let works = (item.Works_Items_Works || [])[0] || {};
    let author = ((item.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let url = util.getWorksUrl(works.WorksID, works.WorksType, item.ItemID);
    return <li>
      <a href={ url } title={ item.ItemName } class="pic">
        <img src={ util.autoSsl(util.img750__80(item.ItemCoverPic || works.WorksCoverPic || '/src/common/blank.png')) }/>
        <div class="num">
          <span class="play-times">{ util.abbrNum(item.PlayHis) }次播放</span>
        </div>
      </a>
      <div class="video fn-hide" src={ item.FileUrl }>
        <video ref="video"
               poster="/src/common/blank.png"
               onTimeupdate={ this.onTimeupdate }
               onLoadedmetadata={ this.onLoadedmetadata }
               onCanplaythrough={ this.onCanplaythrough }
               onProgress={ this.onProgress }
               onPause={ this.onPause }
               onEnded={ this.onEnded }
               onPlaying={ this.onPlaying }
               onClick={ this.toggle }
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
      </div>
      <div class="txt">
        <a href={ url } title={ item.ItemName } class="name">{ item.ItemName }</a>
        <div class="info">
          <div class="author">
          {
            (author.AuthorInfo || []).map(function(item) {
              return <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName }>
                <img src={ util.autoSsl(util.img48_48_80(item.Head_url || '/src/common/blank.png')) }/>
                {
                  self.props.profession
                    ? <span>{ item.AuthorTypeName }</span>
                    : <span>{ item.AuthorName }</span>
                }
              </a>;
            })
          }
          </div>
          <b class={ 'like' + (item.ISLike ? ' liked' : '') } workID={ item.ItemID }>{ item.LikeHis }</b>
          <b class="comment">{ works.CommentCount }</b>
        </div>
      </div>
    </li>;
  }
  clearData() {
    this.clearLast();
    this.dataList = [];
  }
  clickPic(e, vd, tvd) {
    e.preventDefault();
    let self = this;
    if(self.props.playInline) {
      let dvd = tvd.next();
      let video = dvd.children[0];
      if(last === dvd) {
        isPlaying ? video.element.pause() : video.element.play();
        isPlaying = !isPlaying;
      }
      else {
        self.clearLast();
        last = dvd;
        dvd.element.classList.remove('fn-hide');
        video.element.src = dvd.props.src;
        video.element.play();
        isPlaying = true;
      }
      return;
    }
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickName(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickLike(e, vd, tvd) {
    let b = tvd.element;
    if(b.classList.contains('loading')) {
      return;
    }
    b.classList.add('loading');
    net.postJSON('/h5/works/likeWork', { workID: tvd.props.workID }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.State === 'likeWordsUser') {
          b.classList.add('liked');
        }
        else {
          b.classList.remove('liked');
        }
        b.textContent = data.LikeCount;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      b.classList.remove('loading');
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      b.classList.remove('loading');
    });
  }
  clearLast() {
    if(last) {
      let video = last.children[0];
      video.element.pause();
      last.element.classList.add('fn-hide');
    }
  }
  render() {
    return <div class={ 'mod-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list" onClick={ { '.pic': this.clickPic, '.name': this.clickName, '.like': this.clickLike } }>
      {
        (this.dataList || []).map(function(item) {
          return this.genItem(item);
        }.bind(this))
      }
      </ul>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default VideoList;
