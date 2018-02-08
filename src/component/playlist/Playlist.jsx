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
        let isLike = $fn.attr('isLike') === 'true';
        let isFavor = $fn.attr('isFavor') === 'true';
        migi.eventBus.emit('BOT_FN', {
          canLike: true,
          canFavor: true,
          isLike,
          isFavor,
          clickFavor: function(botFn) {
            if(loadingFavor) {
              return;
            }
            loadingFavor = true;
            ajaxFavor = net.postJSON(isFavor ? '/h5/works/unFavorWork' : '/h5/works/favorWork', { workID: $fn.attr('workID') }, function(res) {
              if(res.success) {
                let data = res.data;
                $fn.attr('isFavor', isFavor = botFn.isFavor = data.State === 'favorWork');
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
            ajaxLike = net.postJSON('/h5/works/likeWork', { workID: $fn.attr('workID') }, function(res) {
              if(res.success) {
                let data = res.data;
                $fn.attr('isLike', isLike = botFn.isLike = data.State === 'likeWordsUser');
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
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).append(s);
  }
  genItem(item) {
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
    let url = '/works.html?worksId=' + works.WorksID + '&workId=' + item.ItemID;
    if(item.WorksState === 2) {
      return <li>
        <a href={ url } title={ item.ItemName || '待揭秘' } class="pic">
          <img class="pic" src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
        </a>
        <div class="txt">
          <a href={ url } title={ item.ItemName || '待揭秘' }
             class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
          <p class="author">{ (author.AuthorInfo || []).map(function(item) {
            return item.AuthorName;
          }).join(' ') }</p>
        </div>
      </li>;
    }
    return <li>
      <a href={ url } title={ item.ItemName || '待揭秘' } class="pic">
        <img class="pic" src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
      </a>
      <div class="txt">
        <a href={ url } title={ item.ItemName || '待揭秘' }
           class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
        <p class="author">{ (author.AuthorInfo || []).map(function(item) {
          return item.AuthorName;
        }).join(' ') }</p>
      </div>
      {/*<b class="video"/>*/}
      <b class="fn" workID={ item.ItemID } isLike={ item.ISLike } isFavor={ item.ISFavor }/>
    </li>;
  }
  clearData() {
    $(this.ref.list.element).html('');
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="cp-playlist" onClick={ { a: this.click } }>
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

export default Playlist;
