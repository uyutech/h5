/**
 * Created by army8735 on 2017/9/21.
 */

import util from '../common/util';
import authorTemplate from '../component/author/authorTemplate';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.list;
  }
  @bind list = []
  render() {
    return <div class="mod mod-author">
      <h5>作者</h5>
      <div class="c">
        {
          (this.list || []).map(function(arr) {
            return <ul>
              {
                (arr.AuthorTypeHashlist || []).map(function(item) {
                  return <dl>
                    <dt>{ item.Describe }</dt>
                    {
                      (item.AuthorInfo || []).map(function(author) {
                        return <dd>
                          <a href={ '/author/' + author.AuthorID }>
                            <img src={ util.autoSsl(util.img48_48_80(author.Head_url)) || '//zhuanquan.xin/img/blank.png' }/>
                            <span>{ author.AuthorName }</span>
                          </a>
                        </dd>;
                      })
                    }
                  </dl>;
                  return <li>{ item.Describe }</li>;
                })
              }
            </ul>;
          })
        }
      </div>
    </div>;
  }
}

export default Author;
