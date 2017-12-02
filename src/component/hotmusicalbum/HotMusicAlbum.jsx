/**
 * Created by army8735 on 2017/10/29.
 */

'use strict';

import util from '../../common/util';
import WorksTypeEnum from '../../works/WorksTypeEnum';

class HotMusicAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind dataList = []
  render() {
    return <div class="cp-hotmusicalbum">
      {
        this.hasData
          ? this.dataList && this.dataList.length
            ? <ul>
              {
                this.dataList.map(function(item) {
                  let url = `/works/${item.WorksID}`;
                  return <li>
                    <b class="bg"/>
                    <a href={ url } class="pic">
                      <img src={ util.autoSsl(util.img200_200_80(item.cover_Pic
                        || '//zhuanquan.xin/img/blank.png')) }/>
                      <span class="type">{ WorksTypeEnum.NAME[item.WorkType] }</span>
                      <span class="num">{ util.abbrNum(item.Popular) }</span>
                      {
                        item.WorkState === 2 || item.WorkState === 3
                          ? <span class="state">填坑中</span>
                          : ''
                      }
                    </a>
                    <a href={ url } class="txt">
                      <span>{ item.Title }</span>
                      <span class="author">{ (item.SingerName || []).join(' ') }</span>
                    </a>
                  </li>;
                })
              }
            </ul>
            : <div class="empty">暂无数据</div>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default HotMusicAlbum;
