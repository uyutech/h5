/**
 * Created by army8735 on 2017/10/19.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

function setTranform($elem, n) {
  $elem.css('-moz-transform', `scaleY(${n})`);
  $elem.css('-webkit-transform', `scaleY(${n})`);
  $elem.css('transform', `scaleY(${n})`);
}

let isPlaying;

class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.workList;
    if(self.props.workID) {
      self.list.forEach(function(item, i) {
        if(self.props.workID === item.ItemID.toString()) {
          self.index = i;
        }
      });
    }
    self.on(migi.Event.DOM, function() {
      let $l1 = $(self.element).find('.l1');
      let $l2 = $(self.element).find('.l2');
      let $l3 = $(self.element).find('.l3');
      setInterval(function() {
        if(!isPlaying) {
          setTranform($l1, 0.1);
          setTranform($l2, 0.1);
          setTranform($l3, 0.1);
          return;
        }
        let n1 = Math.random();
        let n2 = Math.random();
        let n3 = Math.random();
        setTranform($l1, n1);
        setTranform($l2, n2);
        setTranform($l3, n3);
      }, 100);
    });
    migi.eventBus.on('play', function() {
      isPlaying = true;
    });
    migi.eventBus.on('pause', function() {
      isPlaying = false;
    });
  }
  @bind list
  @bind index
  clickType(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      $(vd.element).find('.cur').removeClass('cur');
      $li.addClass('cur');
      this.ref.list.element.className = 'list ' + (tvd.props.rel || '');
    }
  }
  clickItem(e, vd, tvd, avd) {
    if(avd.name === 'img') {
      return;
    }
    let $li = $(tvd.element);
    if($li.hasClass('private')) {
      return;
    }
    if(!$li.hasClass('cur')) {
      let $ol = $(vd.element);
      $ol.find('.cur').removeClass('cur');
      $li.addClass('cur');
      let i = tvd.props.rel;
      migi.eventBus.emit('chooseMusic', this.list[i]);
      if(parent && parent !== window && parent.setHash) {
        parent.setHash('/works/' + this.props.worksID + '/' + this.list[i].ItemID, true);
      }
    }
  }
  render() {
    return <div class={ 'mod mod-playlist' + (this.props.hidden ? ' fn-hide' : '') }>
      <ul class="type fn-clear" onClick={ { li: this.clickType } }>
        {/*<li class="video" rel="video">播放视频</li>*/}
        {/*<li class="audio" rel="audio">播放音频</li>*/}
        {/*<li class="music cur">播放全部</li>*/}
      </ul>
      <ol class="list" ref="list" onClick={ { li: this.clickItem } }>
        {
          (this.list || []).map(function(item, i) {
            let type = '';
            if(item.ItemType === 1111 || item.ItemType === 1113) {
              type = 'audio';
            }
            else if(item.ItemType === 2110) {
              type = 'video';
            }
            if(item.WorksState === 3) {
              return <li class="private">
                <span class="name">待揭秘</span>
              </li>;
            }
            if(item.WorksState === 2) {
              return <li class={ type + ' rel' + ((this.index === undefined ? i : this.index !== i) ? '' : ' cur') } rel={ i }>
                <a href={ '/works/' + item.WorksID } class="pic">
                  <img src={ util.autoSsl(util.img64_64_80(item.WorksCoverPic || this.props.cover)) || '//zhuanquan.xin/img/blank.png' }/>
                </a>
                <a href={ '/works/' + item.WorksID } class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
              </li>;
            }
            return <li class={ type + ' rel' + ((this.index === undefined ? i : this.index !== i) ? '' : ' cur') + (item.FileUrl ? '' : ' empty') } rel={ i }>
              <a href={ '/works/' + item.WorksID } class="pic">
                <img src={ util.autoSsl(util.img64_64_80(item.WorksCoverPic || this.props.cover)) || '//zhuanquan.xin/img/blank.png' }/>
              </a>
              <span class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</span>
              <span class="icon"><b class="l1"/><b class="l2"/><b class="l3"/></span>
            </li>;
          }.bind(this))
        }
      </ol>
    </div>;
  }
}

export default PlayList;
