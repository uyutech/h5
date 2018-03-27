/**
 * Created by army8735 on 2017/9/21.
 */

import util from '../common/util';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  click(e, vd, tvd) {
    e.preventDefault();
    let $this = $(tvd.element);
    let url = tvd.props.authorId;
    let title = tvd.props.title;
    util.openAuthor({
      url,
      title,
    });
  }
  render() {
    return <ul class="mod-author" onClick={ { dd: this.click } }>
      {
        (this.list || []).map(function(arr) {
          return <li>
            {
              arr.map(function(item) {
                return <dl>
                  <dt>{ item.kindName }</dt>
                  {
                    item.list.map(function(author) {
                      return <dd authorId={ author.id } title={ author.name }>
                        <img src={ util.autoSsl(util.img48_48_80(author.headUrl)) || '/src/common/head.png' }/>
                        <span>{ author.name }</span>
                      </dd>;
                    })
                  }
                </dl>;
              })
            }
          </li>;
        })
      }
    </ul>;
  }
}

export default Author;
