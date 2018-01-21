/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let loadingFavor;
let loadingLike;
let ajaxFavor;
let ajaxLike;

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList || [];
    self.on(migi.Event.DOM, function() {
      let $root = $(this.element);
      $root.on('click', '.fn', function() {
        let $fn = $(this);
        self.fn($fn);
      });
    });
  }
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  appendData(data) {
    data = data || [];
    let s = '';
    data.forEach(function(item, i) {
      s += this.genItem(item, i) || '';
    }.bind(this));
    $(this.ref.list.element).append(s);
    this.dataList = this.dataList.concat(data);
  }
  genItem(item, index) {
    if(item.WorksState === 3) {
      return <li class="private">
        <span class="name">待揭秘</span>
      </li>;
    }
    let works = item.Works_Items_Works[0];
    if(!works) {
      return;
    }
    let author = item.GroupAuthorTypeHash.AuthorTypeHashlist[0] || {};
    let url = '/works.html?worksID=' + works.WorksID + '&workID=' + item.ItemID;
    if(item.WorksState === 2) {
      return <li id={ 'playlist_' + works.WorksID + '_' + item.ItemID }
                 href={ url }
                 title={ item.ItemName || '待揭秘' }
                 index={ index }
                 data={ item }>
        <img class="pic"
             src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
        <div class="txt">
          <span class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</span>
          <p class="author">{ (author.AuthorInfo || []).map(function(item) {
            return item.AuthorName;
          }).join(' ') }</p>
        </div>
      </li>;
    }
    return <li id={ 'playlist_' + works.WorksID + '_' + item.ItemID }
               href={ url }
               title={ item.ItemName || '待揭秘' }
               index={ index }
               data={ item }>
      <img class="pic"
           src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
      <div class="txt">
        <span class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</span>
        <p class="author">{ (author.AuthorInfo || []).map(function(item) {
          return item.AuthorName;
        }).join(' ') }</p>
      </div>
      <b class="video"/>
      <b class="fn" worksID={ works.WorksID } workID={ item.ItemID } isLike={ item.ISLike } isFavor={ item.ISFavor }/>
    </li>;
  }
  clearData() {
    $(this.ref.list.element).html('');
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let li = tvd.parent;
    let $li = $(li.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).children('.cur').removeClass('cur');
    $li.addClass('cur');
    let url = li.props.href;
    let title = li.props.title;
    let data = li.props.data;
    this.emit('choose', {
      url,
      title,
      data,
    });
  }
  setCur(data) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    $list.find('#playlist_' + data.worksID + '_' + data.workID).addClass('cur');
  }
  setCurIndex(index) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    $list.find('li').eq(index).addClass('cur');
  }
  prev() {
    let self = this;
    let $list = $(self.ref.list.element);
    let $cur = $list.find('.cur');
    let $prev = $cur.prev();
    if($prev[0]) {
      $cur.removeClass('cur');
      $prev.addClass('cur');
      let index = $prev.attr('index');
      let url = $prev.attr('href');
      let title = $prev.attr('title');
      let data = self.dataList[index];
      self.emit('choose', {
        url,
        title,
        data,
      });
    }
    else {
      jsBridge.toast('已经是第一首了~');
    }
  }
  next() {
    let self = this;
    let $list = $(self.ref.list.element);
    let $cur = $list.find('.cur');
    let $next = $cur.next();
    if($next[0]) {
      $cur.removeClass('cur');
      $next.addClass('cur');
      let index = $next.attr('index');
      let url = $next.attr('href');
      let title = $next.attr('title');
      let data = self.dataList[index];
      self.emit('choose', {
        url,
        title,
        data,
      });
    }
    else {
      jsBridge.toast('已经是最后一首了~');
    }
  }
  prevLoop() {
    let self = this;
    let $list = $(self.ref.list.element);
    let $cur = $list.find('.cur');
    let $prev = $cur.prev();
    if(!$prev[0]) {
      $prev = $list.find('li:last-child');
    }
    $cur.removeClass('cur');
    $prev.addClass('cur');
    let index = $prev.attr('index');
    let url = $prev.attr('href');
    let title = $prev.attr('title');
    let data = self.dataList[index];
    self.emit('choose', {
      url,
      title,
      data,
    });
  }
  nextLoop() {
    let self = this;
    let $list = $(self.ref.list.element);
    let $cur = $list.find('.cur');
    let $next = $cur.next();
    if(!$next[0]) {
      $next = $list.find('li:first-child');
    }
    $cur.removeClass('cur');
    $next.addClass('cur');
    let index = $next.attr('index');
    let url = $next.attr('href');
    let title = $next.attr('title');
    let data = self.dataList[index];
    self.emit('choose', {
      url,
      title,
      data,
    });
  }
  fn($fn) {console.log($fn);
    let self = this;
    let isLike = $fn.attr('isLike') === 'true';
    let isFavor = $fn.attr('isFavor') === 'true';
    migi.eventBus.emit('BOT_FN', {
      isLike,
      isFavor,
      canDel: self.props.canDel,
      clickDel: function(botFn) {
        self.props.clickDel(botFn);
      },
      clickFavor: function(botFn) {
        if(loadingFavor) {
          return;
        }
        loadingFavor = true;
        let workID = $fn.attr('workID');
        ajaxFavor = net.postJSON(isFavor ? '/h5/works/unFavorWork' : '/h5/works/favorWork', { workID }, function(res) {
          if(res.success) {
            let data = res.data;
            $fn.attr('isFavor', isFavor = botFn.isFavor = data.State === 'favorWork');
            migi.eventBus.emit('favorWork', {
              state: isFavor,
              workID,
              worksID: $fn.attr('worksID'),
            });
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          loadingFavor = false;
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          loadingFavor = false;
        });
      },
      clickLike: function(botFn) {
        if(loadingLike) {
          return;
        }
        loadingLike = true;
        let workID = $fn.attr('workID');
        ajaxLike = net.postJSON('/h5/works/likeWork', { workID }, function(res) {
          if(res.success) {
            let data = res.data;
            $fn.attr('isLike', isLike = botFn.isLike = data.State === 'likeWordsUser');
            migi.eventBus.emit('likeWork', {
              state: isLike,
              workID,
              worksID: $fn.attr('worksID'),
            });
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          loadingLike = false;
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          loadingLike = false;
        });
      },
      clickCancel: function() {
        if(ajaxFavor) {
          ajaxFavor.abort();
        }
        if(ajaxLike) {
          ajaxLike.abort();
        }
        loadingFavor = false;
        loadingLike = false;
      }
    });
  }
  currentFn() {
    let self = this;
    let $list = $(self.ref.list.element);
    let $cur = $list.find('.cur');
    if($cur[0]) {
      self.fn($cur.find('.fn'));
    }
  }
  render() {
    return <div class="cp-playlist">
      <ol class="list" ref="list" onClick={ { '.txt,.pic': this.click } }>
        {
          (this.dataList || []).map(function(item) {
            return this.genItem(item);
          }.bind(this))
        }
      </ol>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Playlist;
