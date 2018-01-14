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
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', 'a', function(e) {
        e.preventDefault();
        let $a = $(this);
        let url = $a.attr('href');
        let title = $a.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  @bind index
  click() {
    let data = this.props.data;
    let length = (data.authorlist || []).length;
    if(this.index > length - 6) {
      this.index = 0;
    }
    else {
      this.index += 6;
    }
  }
  render() {
    let data = this.props.data;
    return <div class={ 'mod-authorlist' + (this.props.last ? ' last' : '') }
                style={ data.coverpic ? `background-image:url(${data.coverpic})` : '' }>
      <h3>{ data.Describe }{ (data.authorlist || []).length > 6 ? <span onClick={ this.click }>换一换</span> : '' }</h3>
      <ul>
        {
          (data.authorlist || []).slice(this.index, this.index + 6).map(function(item) {
            return <li>
              <a href={ '/author.html?authorID=' + item.AuthorID } title={ item.AuthorName } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Head_url)) || '/src/common/blank.png' }/>
              </a>
              <a href={ '/author.html?authorID=' + item.AuthorID } title={ item.AuthorName } class="name">{ item.AuthorName }</a>
              <p class="fans">{ item.FansNumber }</p>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default AuthorList;
