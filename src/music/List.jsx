/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import util from "../common/util";

class List extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind workId
  clickItem(e, vd, tvd) {
    if(tvd.props.workId === this.workId) {
      return;
    }
    this.workId = tvd.props.workId;
    this.emit('change', this.workId);
  }
  clickFn(e, vd, tvd) {
    this.emit('fn', tvd.props.workId);
  }
  clickPic(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    jsBridge.pushWindow(url, {
      title: tvd.props.title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="mod-list"
                onClick={ {
                  '.item .txt': this.clickItem,
                  '.fn': this.clickFn,
                  '.pic': this.clickPic,
                } }>
      <ol>
        {
          (this.workId, this.list || []).map(function(item) {
            if(item.WorksState === 3) {
              return <li class="private">
                <span class="name">待揭秘</span>
              </li>;
            }
            let works = item.Works_Items_Works[0] || {};
            let url = '/works.html?worksId=' + works.WorksID;
            if(!item.FileUrl) {
              return <li class="empty">
                <a href={ url } class="pic" title={ item.ItemName }>
                  <img src={ util.autoSsl(util.img64_64_80(works.WorksCoverPic))
                  || '//zhuanquan.xin/img/blank.png' }/>
                </a>
                <div class="txt" workId={ item.ItemID }>
                  <span class={ 'title' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</span>
                </div>
              </li>;
            }
            return <li class={ 'item' + (this.workId === item.ItemID ? ' cur' : '') }>
              <a href={ url } class="pic" title={ item.ItemName }>
                <img src={ util.autoSsl(util.img64_64_80(works.WorksCoverPic))
                || '//zhuanquan.xin/img/blank.png' }/>
              </a>
              <div class="txt" workId={ item.ItemID }>
                <span class={ 'title' + (item.ItemName ? '' : ' empty') }>{ item.ItemName || '待揭秘' }</span>
              </div>
              <b class="fn" workId={ item.ItemID }/>
            </li>;
          }.bind(this))
        }
      </ol>
    </div>;
  }
}

export default List;
