/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let loadingFavor;
let loadingLike;
let ajaxFavor;
let ajaxLike;

class List extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList || [];
    self.curTag = self.props.curTag || 0;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.fn', function() {
        let $li = $(this).closest('li');
        self.fn($li);
      });
      let $list = $(self.ref.list.element);
      $list.on('click', '.pic,.txt', function() {
        let $li = $(this).closest('li');
        if($li.hasClass('cur')) {
          return;
        }
        $list.find('.cur').removeClass('cur');
        $li.addClass('cur');
        self.emit('choose', self.dataList[$li.attr('index')]);
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
  setData(data) {
    let self = this;
    self.clearData();
    self.dataList = data || [];
    let s = '';
    data.forEach(function(item, i) {
      s += self.genItem(item, i) || '';
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    data = data || [];
    let s = '';
    let len = self.dataList.length;
    data.forEach(function(item, i) {
      s += self.genItem(item, i + len) || '';
    });
    $(self.ref.list.element).append(s);
    self.dataList = self.dataList.concat(data);
  }
  genItem(item, index) {
    return <li id={ 'playlist_' + item.worksId + '_' + item.workId } index={ index }>
      <img class="pic"
           src={ util.autoSsl(util.img80_80_80(item.worksCover || '//zhuanquan.xin/img/blank.png')) }/>
      <div class="txt">
        <span class="name">{ item.workName }</span>
        <p class="author"></p>
      </div>
      {/*<b class="video"/>*/}
      <b class="fn"/>
    </li>;
  }
  clearData() {
    $(this.ref.list.element).html('');
    this.dataList = [];
  }
  setCurIndex(index) {
    let self = this;
    let $list = $(self.ref.list.element);
    $list.find('.cur').removeClass('cur');
    $list.find('li').eq(index || 0).addClass('cur');
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
      let data = self.dataList[index];
      self.emit('choose', data);
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
      let data = self.dataList[index];
      self.emit('choose', data);
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
    let data = self.dataList[index];
    self.emit('change', {
      data,
      index,
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
    let data = self.dataList[index];
    self.emit('change', {
      data,
      index,
    });
  }
  fn($li) {
    let self = this;
    let index = $li.attr('index');
    let data = self.dataList[index];
    migi.eventBus.emit('BOT_FN', {
      isLike: data.isLike,
      isFavor: data.isFavor,
      canDel: self.curTag === 0,
      clickDel: function(botFn) {
        jsBridge.confirm('确认删除吗？', function(res) {
          if(res) {
            let isCur = $li.hasClass('cur');
            $li.remove();
            self.updateIndex();
            self.dataList.splice(index, 1);
            self.emit('del', {
              data,
              isCur,
            });
            botFn.cancel();
          }
        });
      },
      clickFavor: function(botFn) {
        if(loadingFavor) {
          return;
        }
        loadingFavor = true;
        ajaxFavor = net.postJSON(data.isFavor ? '/h5/works/unFavorWork' : '/h5/works/favorWork', { workID: data.workId }, function(res) {
          if(res.success) {
            let data2 = res.data;
            data.isFavor = botFn.isFavor = data2.State === 'favorWork';
            self.emit('favorWork', {
              data,
              list: self.dataList,
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
        ajaxLike = net.postJSON('/h5/works/likeWork', { workID: data.workId }, function(res) {
          if(res.success) {
            let data2 = res.data;
            data.isLike = botFn.isLike = data2.State === 'likeWordsUser';
            self.emit('likeWork', {
              data,
              list: self.dataList,
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
    let $li = $list.find('.cur');
    if($li[0]) {
      self.fn($li);
    }
  }
  updateIndex() {
    $(this.ref.list.element).find('li').each(function(i, li) {
      $(li).attr('index', i);
    });
  }
  render() {
    return <div class="cp-playlist">
      <ol class="list" ref="list">
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

export default List;
