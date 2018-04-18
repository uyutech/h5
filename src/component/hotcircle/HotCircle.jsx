/**
 * Created by army8735 on 2017/11/12.
 */

'use strict';

import util from '../../common/util';

class HotCircle extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
  @bind dataList
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(!url) {
      throw new Error('hotcircle url is null');
    }
    jsBridge.pushWindow(url, {
      title,
    });
  }
  render() {
    return <div class="cp-hotcircle" onClick={ { a: this.click } }>
      {
        this.dataList && this.dataList.length
          ? <ul>
              {
                this.dataList.map(function(item) {
                  let url = `/circle.html?id=${item.TagID}`;
                  return <li>
                    <a href={url} class="pic" title={ item.TagName + '圈' }>
                      <img src={util.autoSsl(util.img288_288_80(item.TagCover)) || '//zhuanquan.xin/img/blank.png'}/>
                    </a>
                    <a href={url} class="txt" title={ item.TagName + '圈' }>
                      <span class="name">{item.TagName}</span>
                      <span class="fans">成员{ util.abbrNum(item.FansNumber) }</span>
                      <span class="comment">画圈{ util.abbrNum(item.Popular) }</span>
                    </a>
                  </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more"><a href={ this.props.more } title="全部圈子">查看更多</a></li>
                  : ''
              }
            </ul>
          : <div class="empty">暂无数据</div>
      }
    </div>;
  }
}

export default HotCircle;
