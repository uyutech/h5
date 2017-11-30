/**
 * Created by army8735 on 2017/10/29.
 */

'use strict';

import util from '../../common/util';

class HotMusicAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind dataList = []
  autoWidth() {
    let $list = $(this.element).find('.list');
    let $c = $list.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="cp-hotmusicalbum">
      {
        this.hasData
          ? <div class="list">
              <div class="c">
                {
                  this.dataList && this.dataList.length
                    ? <ul>
                      {
                        this.dataList.map(function(item) {
                          let url = `/works/${item.WorksID}`;
                          return <li>
                            <b class="bg"/>
                            <a href={ url } class="pic">
                              <img src={ util.autoSsl(util.img200_200_80(item.cover_Pic)) || '/src/common/blank.png' }/>
                              <span class="num">{ item.Popular || 0 }</span>
                            </a>
                            <a href={ url } class="txt">
                              <span>{ item.Title }</span>
                              <span class="author">{ (item.SingerName || []).join(' ') }</span>
                            </a>
                          </li>;
                        })
                      }
                    </ul>
                    : <div class="empty">{ this.props.empty || '暂无数据' }</div>
                }
              </div>
            </div>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default HotMusicAlbum;
