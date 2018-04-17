/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import util from '../common/util';

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
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <ol class="mod-list"
               onClick={ {
                 '.txt': this.clickItem,
                 '.fn': this.clickFn,
                 '.pic': this.clickPic,
               } }>
      {
        (this.workId, this.list || []).map((item) => {
          let url = '/works.html?worksId=' + item.works.id;
          return <li class={ this.workId === item.id ? 'cur' : '' }>
            <a class="pic"
               href={ url }
               title={ item.works.title }>
              <img src={ util.img(item.works ? item.works.cover : item.cover, 64, 64, 80)
              || '//zhuanquan.xin/img/blank.png' }/>
            </a>
            <div class="txt" workId={ item.id }>
              <span class="title">{ item.title }</span>
            </div>
          </li>;
        })
      }
    </ol>;
  }
}

export default List;
