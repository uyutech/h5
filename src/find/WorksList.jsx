/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class WorksList extends migi.Component {
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
  click() {
    let data = this.props.data;
    let length = (data.worklist || []).length;
    if(this.index >= length - 6) {
      this.index = 0;
    }
    else {
      this.index += 6;
    }
  }
  render() {
    return <div class="mod-workslist">
      <h3>
        { this.data.title }
        { (this.data.content || []).length > 6 ? <span onClick={ this.clickChange }>换一换</span> : '' }
      </h3>
      <ul onClick={ { a: this.click } }>
      {
        (this.data.content || []).slice(this.index, this.index + 6).map(function(item) {
          return <li>
            <a class="pic"
               href={ '/works.html?worksId=' + item.id }
               title={ item.title }>
              <img src={ util.img(item.cover, 170, 170, 80) || '/src/common/blank.png' }/>
              <span>{ item.CommentCount }</span>
            </a>
            <a class="name"
               href={ '/works.html?worksId=' + item.id }
               title={ item.title }>{ item.title }</a>
            {
              item.author.length
                ? <p class="author">{ item.author[0].list.map(function(item) {
                    return item.name;
                  }).join(' ') }</p>
                : ''
            }
          </li>;
        })
      }
      </ul>
    </div>;
  }
}

export default WorksList;
