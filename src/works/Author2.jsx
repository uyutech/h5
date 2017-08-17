/**
 * Created by army8735 on 2017/8/17.
 */

import authorTemplate from '../component/author/authorTemplate';

class Author2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list = []
  setAuthor(data) {
    let temp = [];
    data.forEach(function(item) {
      item.forEach(function(item2) {
        temp.push(<li class="label">{ authorTemplate(item2.type).name }</li>);
        item2.list.forEach(function(item3) {
          temp.push(<li class="item" id={ item3.ID }>{ item3.AuthName }</li>);
        });
      });
    });
    this.list = temp;
    let $c = $(this.ref.c.element);
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="author2">
      <div class="c" ref="c">
        <ul>
          {
            this.list
          }
        </ul>
      </div>
    </div>;
  }
}

export default Author2;
