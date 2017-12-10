/**
 * Created by army8735 on 2017/8/9.
 */

'use strict';

import util from '../../common/util';
import authorTemplate from '../author/authorTemplate';

let seq = ['ge', 'qu', 'ci', 'cv', 'hun'];

class HotAuthor extends migi.Component {
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
    return <div class="cp-hotauthor" onClick={ { a: this.click } }>
      {
        this.dataList && this.dataList.length
          ? <ul>
              {
                this.dataList.map(function(item) {
                  let type = [];
                  if(item.Authortype) {
                    for(let i = 0, len = item.Authortype.length; i < len; i++) {
                      let code = authorTemplate.code2Data[item.Authortype[i].AuthorTypeID].css;
                      if(code && type.indexOf(code) === -1) {
                        type.push(code);
                      }
                    }
                  }
                  migi.sort(type, function(a, b) {
                    if(seq.indexOf(a) === -1) {
                      return true;
                    }
                    if(seq.indexOf(b) === -1) {
                      return false;
                    }
                    return seq.indexOf(a) > seq.indexOf(b);
                  });
                  let url = `/author.html?authorID=${item.AuthorID}`;
                  return <li>
                    <a href={ url } class="pic" title={ item.AuthorName }>
                      <img src={ util.autoSsl(util.img120_120_80(item.Head_url
                        || '/src/common/head.png')) }/>
                      {
                        type.slice(0, 2).map(function(item) {
                          return <b class={ 'cp-author-type-' + item }/>;
                        })
                      }
                    </a>
                    <a href={ url } class="txt" title={ item.AuthorName }>
                      <span class="name">{ item.AuthorName }</span>
                      <span class="fans">粉丝 { util.abbrNum(item.FansNumber) }</span>
                      <span class="comment">留言 { util.abbrNum(item.Popular) }</span>
                    </a>
                    <div class="info">合作{ util.abbrNum(item.CooperationTimes) }次</div>
                  </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more"><a href={ this.props.more } title="全部作者">查看更多</a></li>
                  : ''
              }
            </ul>
          : <div class="empty">{ this.props.empty || '暂无数据' }</div>
      }
    </div>;
  }
}

export default HotAuthor;
