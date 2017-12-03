/**
 * Created by army8735 on 2017/11/12.
 */

'use strict';

import util from '../../common/util';

class HotPlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind dataList
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
      {
        this.hasData
          ? <ol class="list" ref="list">
            {
              (this.dataList || []).map(function(item, i) {
                let url = '/works.html?worksID=' + item.WorksID + '&workID=' + item.ItemID;
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
                  return <li class={ type + ' rel' }>
                    <a href={ url } class="pic" title={ item.ItemName }>
                      <img src={ util.autoSsl(util.img108_108_80(item.WorksCoverPic || this.props.cover))
                      || '//zhuanquan.xin/img/blank.png' }/>
                    </a>
                    <a href={ url } class={ 'name' + (item.ItemName ? '' : ' empty') }
                       title={ item.ItemName }>{ item.ItemName || '待揭秘' }</a>
                  </li>;
                }
                return <li class={ type + ' rel' }>
                  <a href={ url } class="pic" title={ item.ItemName }>
                    <img src={ util.autoSsl(util.img108_108_80(item.WorksCoverPic || this.props.cover))
                    || '//zhuanquan.xin/img/blank.png' }/>
                  </a>
                  <a href={ url } class={ 'name' + (item.ItemName ? '' : ' empty') }
                     title={ item.ItemName }>{ item.ItemName || '待揭秘' }</a>
                  <span class="icon"/>
                </li>;
              }.bind(this))
            }
          </ol>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default HotPlayList;
