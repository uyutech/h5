/**
 * Created by army8735 on 2017/9/1.
 */

import authorTemplate from '../component/author/authorTemplate';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list = []
  setAuthor(data) {
    let $c = $(this.ref.c.element);
    $c.css('width', '9999rem');
    let temp = [];
    data.forEach(function(item) {
      item.forEach(function(item2) {
        let type = authorTemplate.code2Data[item2.type];
        let label = item2.type === '141' ? item2.list[0].Tips : type.display;
        temp.push(<li class="label">{ label }</li>);
        item2.list.forEach(function(item3) {
          temp.push(<li class="item" id={ item3.ID }><a href={ `author.html?id=${item3.ID}` }>{ item3.AuthName }</a></li>);
        });
      });
    });
    this.list = temp;
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  clickAuthor(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href, {
      transparentTitle: true,
    });
  }
  render() {
    return <div class="author">
      <div class="c" ref="c" onClick={ { a: this.clickAuthor } }>
        <ul>
          {
            this.list
          }
        </ul>
      </div>
    </div>;
  }
}

export default Author;
