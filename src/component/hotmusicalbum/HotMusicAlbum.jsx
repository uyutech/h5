/**
 * Created by army8735 on 2017/10/29.
 */

'use strict';

import util from '../../common/util';
import WorksTypeEnum from '../../works/WorksTypeEnum';

class HotMusicAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
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
    return <div class="cp-hotmusicalbum" onClick={ { a: this.click } }>
      {
        this.dataList && this.dataList.length
          ? <ul>
            {
              this.dataList.map(function(item) {
                let url = `/works.html?worksID=${item.WorksID}`;
                return <li>
                  <b class="bg"/>
                  <a href={ url } class="pic" title={ item.Title }>
                    <img src={ util.autoSsl(util.img200_200_80(item.cover_Pic || '/src/common/blank.png')) }/>
                    <span class="type">{ WorksTypeEnum.NAME[item.WorkType] }</span>
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
          </ul>
          : <div class="empty">暂无数据</div>
      }
    </div>;
  }
}

export default HotMusicAlbum;
