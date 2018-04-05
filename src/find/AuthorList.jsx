/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class AuthorList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.index = 0;
    self.data = self.props.data;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', 'a', function(e) {
        e.preventDefault();
        let $a = $(this);
        let url = $a.attr('href');
        let title = $a.attr('title');
        util.openAuthor({
          url,
          title,
        });
      });
    });
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
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
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
               href={ '/author.html?authorId=' + item.id }
               title={ item.name }>
              <img src={ util.autoSsl(util.img120_120_80(item.headUrl)) || '/src/common/head.png' }/>
            </a>
            <a class="name"
               href={ '/author.html?authorId=' + item.id }
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
