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
    self.on(migi.Event.DOM, function() {
      let $root = $(self.ref.element);
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
  render() {
    let data = this.props.data;
    return <div class={ 'mod-authorlist' + (this.props.last ? ' last' : '') }>
      <h3>{ data.Describe }</h3>
      <ul>
        {
          (data.authorlist || []).map(function(item) {
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
