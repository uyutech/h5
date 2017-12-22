/**
 * Created by army8735 on 2017/11/12.
 */

'use strict';

import util from '../../common/util';

class HotPlayList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
  @bind hasData
  @bind dataList
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
      s += this.genItem(item);
    }.bind(this));
    $(this.ref.list.element).append(s);
  }
  genItem(item) {
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
    let author = (item.Works_Item_Author || []).filter(function(item) {
      return item.WorksAuthorType === '111';
    }).map(function(item) {
      return item.AuthName;
    });
    let works = item.Works_Items_Works[0];
    let url = '/works.html?worksID=' + works.WorksID + '&workID=' + item.ItemID;
    if(item.WorksState === 2) {
      return <li class={ type + ' rel' }>
        <a href={ url } title={ item.ItemName || '待揭秘' } class="pic">
          <img src={ util.autoSsl(util.img108_108_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
        </a>
        <a href={ url } title={ item.ItemName || '待揭秘' }
           class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
        <p class="author">{ author.join(' ') }</p>
      </li>;
    }
    return <li class={ type + ' rel' }>
      <a href={ url } title={ item.ItemName || '待揭秘' } class="pic">
        <img src={ util.autoSsl(util.img108_108_80(works.WorksCoverPic || '//zhuanquan.xin/img/blank.png')) }/>
      </a>
      <a href={ url } title={ item.ItemName || '待揭秘' }
         class={ 'name' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</a>
      <p class="author">{ author.join(' ') }</p>
      <span class="icon"/>
    </li>;
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(href, {
      title,
    });
  }
  render() {
    return <div class="cp-hotplaylist" onClick={ { a: this.click } }>
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

export default HotPlayList;
