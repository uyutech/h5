/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import util from '../../common/util';

class HotAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  @bind list
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
    return <div class="cp-hotalbum" onClick={ { a: this.click } }>
      {
        this.list
          ? this.list.length
            ? <ul class="list">
              {
                this.list.map(function(item) {
                  let url = `/music.html?worksId=${item.WorksID}`;
                  return <li>
                    <b class="bg"/>
                    <a href={ url } class="pic" title={ item.Title }>
                      <img src={ util.autoSsl(util.img170_170_80(item.cover_Pic)) || '/src/common/blank.png' }/>
                      <span class="num">{ util.abbrNum(item.Popular) }</span>
                      {
                        item.WorkState === 2 || item.WorkState === 3
                          ? <span class="state">填坑中</span>
                          : ''
                      }
                    </a>
                    <a href={ url } class="txt" title={ item.Title }>
                      <span>{ item.Title }</span>
                      <span class="author">{ (item.SingerName || []).join(' ') }</span>
                    </a>
                  </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more"><a href={ this.props.more } title="全部作品">查看更多</a></li>
                  : ''
              }
              </ul>
            : <div class="empty">暂无</div>
          : <div class="placeholder"/>
      }
    </div>;
  }
}

export default HotAlbum;