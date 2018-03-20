/**
 * Created by army8735 on 2018/2/9.
 */

'use strict';

import util from '../common/util';

class People extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(tvd.props.author) {
      util.openAuthor({
        url,
        title,
      });
    }
    else {
      jsBridge.pushWindow(url, {
        title,
        transparentTitle: true,
      });
    }
  }
  render() {
    return <div class="mod-people" onClick={ { a: this.click } }>
      {
        this.list
          ? this.list.length
            ? <ul>
              {
                this.list.map(function(item) {
                  let url = item.ISAuthor
                    ? `/author.html?authorId=${item.ID}`
                    : `/user.html?userID=${item.ID}`;
                  return <li>
                    {
                      <a href={ url }
                         class={ 'pic' }
                         title={ item.Name }
                         author={ item.ISAuthor }>
                        <img src={ util.autoSsl(util.img120_120_80(item.Head_url
                          || '/src/common/head.png')) }/>
                      </a>
                    }
                    </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more">
                    <a href={ this.props.more } title="圈关系">查看更多</a>
                  </li>
                  : ''
              }
            </ul>
            : <p class="empty">{ this.props.empty || '暂无数据' }</p>
          : ''
      }
    </div>
  }
}

export default People;
