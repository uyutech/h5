/**
 * Created by army8735 on 2018/3/29.
 */

'use strict';

import util from "../../common/util";

class WorksList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  @bind list
  render() {
    return <div class="cp-workslist">
      {
        this.list
          ? this.list.length
            ? <ul class="list">
                {
                  this.list.map(function(item) {
                    let url = `/works.html?worksId=${item.id}`;
                    return <li>
                      <a href={ url } class="pic" title={ item.title }>
                        <img src={ util.autoSsl(util.img170_170_80(item.cover)) || '/src/common/blank.png' }/>
                        <span class="type">原创音乐</span>
                        <span class="num">{ util.abbrNum(item.popular) }</span>
                      </a>
                      <a href={ url } class="txt" title={ item.title }>
                        <span>{ item.title }</span>
                        <span class="author">123</span>
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

export default WorksList;
