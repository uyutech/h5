/**
 * Created by army8735 on 2017/9/21.
 */

import util from '../common/util';
import authorTemplate from '../component/author/authorTemplate';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.setAuthor(self.props.authorList);
  }
  @bind list = []
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    util.openAuthor({
      url,
      title,
    });
  }
  setAuthor(data) {
    let list = [];
    (data || []).forEach(function(item) {
      let temp = [];
      let lis = [];
      let last = '';
      let lastTips = '';
      item.forEach(function(item) {
        let url = `/author.html?authorId=${item.ID}`;
        if(item.WorksAuthorType !== last || item.Tips !== lastTips) {
          if(temp.length) {
            let li = <li>
              {
                temp.map(function(item) {
                  return item;
                })
              }
            </li>;
            lis.push(li);
            temp = [];
          }
          let type = authorTemplate.code2Data[item.WorksAuthorType];
          let label = item.Tips || (type ? type.display : '其它');
          temp.push(<span class="item">
            <small>{ label }</small>
            <a class="item" href={ url } title={ item.AuthName }>
              <img src={ util.autoSsl(util.img48_48_80(item.HeadUrl || '/src/common/head.png')) }/>
              <span>{ item.AuthName }</span>
            </a>
          </span>);
        }
        else {
          temp.push(
            <a class="item" href={ url } title={ item.AuthName }>
              <img src={ util.autoSsl(util.img48_48_80(item.HeadUrl || '/src/common/head.png')) }/>
              <span>{ item.AuthName }</span>
            </a>
          );
        }
        last = item.WorksAuthorType;
        lastTips = item.Tips;
      });
      if(temp.length) {
        let li = <li>
          {
            temp.map(function(item) {
              return item;
            })
          }
        </li>;
        lis.push(li);
        temp = [];
      }
      let ul = <ul>
        {
          lis.map(function(item) {
            return item;
          })
        }
      </ul>;
      list.push(ul);
    });
    this.list = list;
  }
  render() {
    return <div class="mod mod-author">
      <h5>作者</h5>
      <div class="c" onClick={ { a: this.click } }>
        {
          (this.list || []).map(function(item) {
            return item;
          })
        }
      </div>
    </div>;
  }
}

export default Author;
