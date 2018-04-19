/**
 * Created by army8735 on 2017/9/21.
 */

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  click(e, vd, tvd) {
    e.preventDefault();
    let authorId = tvd.props.authorId;
    let title = tvd.props.title;
    jsBridge.pushWindow('/author.html?id=' + authorId, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <ul class="mod-author"
               onClick={ { dd: this.click } }>
      {
        (this.list || []).map(function(arr) {
          return <li>
            {
              (arr || []).map(function(item) {
                return <dl>
                  <dt>{ item.name }</dt>
                  {
                    (item.list || []).map(function(author) {
                      if(author.isSettle) {
                        return <dd authorId={ author.id }
                                   title={ author.name }>
                          <img src={ $util.img(author.headUrl, 48, 48, 80) || '/src/common/head.png' }/>
                          <span>{ author.name }</span>
                        </dd>;
                      }
                      return <dd authorId={ author.id }
                                 title={ author.name }>
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
