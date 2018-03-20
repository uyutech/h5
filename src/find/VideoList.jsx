/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let last;
let isPlaying;
let mediaService;

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList;
    if(self.props.visible !== undefined) {
      self.visible = self.props.visible;
    }
    self.on(migi.Event.DOM, function() {
      if(jsBridge.appVersion) {
        let version = jsBridge.appVersion.split('.');
        let major = parseInt(version[0]) || 0;
        let minor = parseInt(version[1]) || 0;
        let patch = parseInt(version[2]) || 0;
        if(jsBridge.android && (major > 0 || minor > 4) || jsBridge.ios && (major > 0 || minor > 5)) {
          mediaService = true;
        }
      }
    });
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
    let option = util.getWorksUrlOption(works.WorkType);
    let authorStr = (author.AuthorInfo || []).map(function(item) {
      return item.AuthorName;
    }).join(' ');
    return <li>
      <a href={ url }
         title={ item.ItemName }
         option={ option }
         class="pic">
        <img src={ util.autoSsl(util.img750__80(item.ItemCoverPic || works.WorksCoverPic || '/src/common/blank.png')) }/>
        <div class="num">
          <span class="play-times">{ util.abbrNum(item.PlayHis) }次播放</span>
        </div>
      </a>
      <div class="video fn-hide" src={ item.FileUrl }>
        <video ref="video"
               poster="/src/common/blank.png"
               preload="meta"
               playsinline="true"
               webkit-playsinline="true"/>
      </div>
      <div class="txt">
        <a href={ url }
           title={ item.ItemName }
           option={ option }
           class="name">{ item.ItemName }</a>
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
          <b class="fn"
             worksId={ works.WorksID }
             worksTitle={ works.WorksName }
             worksCover={ works.WorksCoverPic }
             workId={ item.ItemID }
             workTitle={ item.ItemName }
             authorStr={ authorStr }/>
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
      self.clearLast();
      last = dvd;
      dvd.element.classList.remove('fn-hide');
      video.element.src = dvd.props.src;
      video.element.play();
      isPlaying = true;
      if(mediaService) {
        jsBridge.media({
          key: 'stop',
        });
      }
      return;
    }
    let url = tvd.props.href;
    let title = tvd.props.title;
    let option = tvd.props.option;
    jsBridge.pushWindow(url, option);
  }
  clickVideo(e, vd, tvd) {
    let video = tvd.find('video');
    if(isPlaying) {
      video.element.pause();
      tvd.element.classList.add('pause');
    }
    else {
      video.element.play();
      tvd.element.classList.remove('pause');
    }
    isPlaying = !isPlaying;
  }
  clickName(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    let option = tvd.props.option;
    jsBridge.pushWindow(url, option);
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
  clickAuthor(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href, {
      transparentTitle: true,
    });
  }
  clickFn(e, vd, tvd) {
    let worksId = tvd.props.worksId;
    let worksTitle = tvd.props.worksTitle;
    let workId = tvd.props.workId;
    let authorStr = tvd.props.authorStr;
    let worksCover = tvd.props.worksCover;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      canShareIn: true,
      clickShareIn: function(botFn) {
        jsBridge.pushWindow('/subpost.html?worksId=' + worksId
          + '&workId=' + workId
          + '&cover=' + encodeURIComponent(worksCover || ''), {
          title: '画个圈',
          optionMenu: '发布',
        });
      },
      clickShareWb: function() {
        let url = window.ROOT_DOMAIN + '/works/' + worksId;
        if(workId) {
          url += '/' + workId;
        }
        let text = '【';
        if(worksTitle) {
          text += worksTitle;
        }
        text += '】';
        text += authorStr;
        text += ' #转圈circling# ';
        text += url;
        jsBridge.shareWb({
          text,
        }, function(res) {
          if(res.success) {
            jsBridge.toast("分享成功");
          }
          else if(res.cancel) {
            jsBridge.toast("取消分享");
          }
          else {
            jsBridge.toast("分享失败");
          }
        });
      },
      clickShareLink: function() {
        let url = window.ROOT_DOMAIN + '/works/' + worksId;
        if(workId) {
          url += '/' + workId;
        }
        util.setClipboard(url);
      },
    });
  }
  clearLast() {
    if(last) {
      let video = last.children[0];
      video.element.pause();
      last.element.classList.add('fn-hide');
      last.element.classList.remove('pause');
    }
  }
  render() {
    return <div class={ 'mod-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"
          onClick={ { '.pic': this.clickPic,
            '.video': this.clickVideo,
            '.name': this.clickName,
            '.like': this.clickLike,
            '.fn': this.clickFn,
            '.author a': this.clickAuthor } }>
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
