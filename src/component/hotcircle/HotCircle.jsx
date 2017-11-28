/**
 * Created by army8735 on 2017/11/12.
 */

'use strict';

import util from '../../common/util';

class HotCircle extends migi.Component {
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
    return <div class="cp-hotcircle">
      {
        this.hasData
          ? <div class="list">
              <div class="c">
                {
                  this.dataList && this.dataList.length
                    ? <ul>
                      {
                        this.dataList.map(function(item) {
                          return <li>
                            <a href={ `/circle/${item.TagID}` } class="pic">
                              <img src={ util.autoSsl(util.img288_288_80(item.TagCover)) || '/src/common/blank.png' }/>
                            </a>
                            <a href={ `/circle/${item.TagID}` } class="txt">
                              <span class="name">{ item.TagName }</span>
                              <span class="fans">{ item.FansNumber || 0 }</span>
                              <span class="comment">{ item.Popular || 0 }</span>
                            </a>
                          </li>;
                        })
                      }
                    </ul>
                    : <div class="empty">暂无数据</div>
                }
              </div>
            </div>
          : <div class="placeholder"/>
      }

    </div>;
  }
}

export default HotCircle;
