/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

class Playlist extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList;
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
    let url = '/works.html?worksID=' + works.WorksID + '&workID=' + item.ItemID;
    if(item.WorksState === 2) {
      return <li>
        <a href={ url } title={ item.ItemName || '待揭秘' } class="pic">
          <img src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
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
        <img src={ util.autoSsl(util.img80_80_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
      </a>
      <div class="txt">
        <a href={ url } title={ item.ItemName || '待揭秘' }
           class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
        <p class="author">{ (author.AuthorInfo || []).map(function(item) {
          return item.AuthorName;
        }).join(' ') }</p>
      </div>
      <b class="video"/>
      <b class="fn"/>
    </li>;
  }
  clearData() {
    $(this.ref.list.element).html('');
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(!url) {
      throw new Error('hotplaylist url is null');
    }
    jsBridge.pushWindow(url, {
      title,
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
