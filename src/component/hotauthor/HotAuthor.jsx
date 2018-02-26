/**
 * Created by army8735 on 2017/8/9.
 */

'use strict';

import util from '../../common/util';

class HotAuthor extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  @bind list
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(tvd.parent.props.class === 'more') {
      jsBridge.pushWindow(url, {
        title,
      });
    }
    else {
      util.openAuthor({
        url,
        title,
      });
    }
  }
  render() {
    return <div class="cp-hotauthor" onClick={ { a: this.click } }>
      {
        this.list
          ? this.list.length
            ? <ul class="list">
              {
                this.list.map(function(item) {
                  let url = `/author.html?authorId=${item.AuthorID}`;
                  return <li>
                    <a href={ url } class="pic" title={ item.AuthorName }>
                      <img src={ util.autoSsl(util.img120_120_80(item.Head_url
                        || '/src/common/head.png')) }/>
                    </a>
                    <a href={ url } class="txt" title={ item.AuthorName }>
                      <span class="name">{ item.AuthorName }</span>
                    </a>
                    <div class="info">合作{ util.abbrNum(item.CooperationTimes) }次</div>
                  </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more"><a href={ this.props.more } title="圈关系">查看更多</a></li>
                  : ''
              }
            </ul>
            : <div class="empty">暂无</div>
          : <div class="placeholder"/>
      }
    </div>;
  }
}

export default HotAuthor;
