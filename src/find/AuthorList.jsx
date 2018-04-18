/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import util from '../common/util';

class AuthorList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.index = 0;
    self.data = self.props.data;
  }
  @bind index
  @bind data
  setData(data) {
    this.data = data;
  }
  clickChange() {
    let length = (this.data.content || []).length;
    if(this.index >= length - 6) {
      this.index = 0;
    }
    else {
      this.index += 6;
    }
  }
  render() {
    return <div class="mod-authorlist">
      <h3>
        { this.data.title }
        { (this.data.content || []).length > 6 ? <span onClick={ this.clickChange }>换一换</span> : '' }
      </h3>
      <ul onClick={ { a: this.click } }>
      {
        (this.data.content || []).slice(this.index, this.index + 6).map(function(item) {
          return <li>
            <a class="pic"
               href={ '/author.html?id=' + item.id }
               title={ item.name }>
              <img src={ util.img(item.headUrl, 120, 120, 80) || '/src/common/head.png' }/>
            </a>
            <a class="name"
               href={ '/author.html?id=' + item.id }
               title={ item.name }>{ item.name }</a>
            <p class="fans">{ item.fansCount }</p>
          </li>;
        })
      }
      </ul>
    </div>;
  }
}

export default AuthorList;
