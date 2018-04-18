/**
 * Created by army8735 on 2018/3/30.
 */

'use strict';

import util from '../common/util';

class WorksList extends migi.Component {
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
    return <div class="mod-workslist"
                onClick={ { a: this.click } }>
      {
        this.list
          ? this.list.length
          ? <ul class="list">
            {
              this.list.map(function(item) {
                let url = `/works.html?id=${item.id}`;
                return <li>
                  <a class="pic"
                     href={ url }
                     title={ item.title }>
                    <img src={ util.img(item.cover, 170, 170, 80) || '/src/common/blank.png' }/>
                    <span class="type">{ item.typeName }</span>
                    <span class="num">{ util.abbrNum(item.popular) }</span>
                  </a>
                  <a class="txt"
                     href={ url }
                     title={ item.title }>
                    <span>{ item.title }</span>
                    <span class="profession">{ (item.profession || []).map((item) => {
                      return item.name;
                    }).join(' ') }</span>
                  </a>
                </li>;
              })
            }
            </ul>
          : <div class="empty">暂无</div>
          : <div class="placeholder"/>
      }
    </div>;
  }
}

export default WorksList;
