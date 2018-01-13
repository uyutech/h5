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
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', 'a', function(e) {
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
    return <div class={ 'mod-workslist' + (this.props.last ? ' last' : '') }>
      <h3>{ data.Describe }<span>换一换</span></h3>
      <ul ref="list">
        {
          (data.worklist || []).map(function(item) {
            let author = item.GroupAuthorTypeHash.AuthorTypeHashlist[0] || {};
            return <li class={ 't' + item.WorkType }>
              <a href={ '/works.html?worksID=' + item.WorksID } title={ item.Title } class="pic">
                <img src={ util.autoSsl(util.img170_170_80(item.cover_Pic)) }/>
                <span>{ item.Popular }</span>
              </a>
              <a href={ '/works.html?worksID=' + item.WorksID } title={ item.Title } class="name">{ item.Title }</a>
              <p class="author">{ (author.AuthorInfo || []).map(function(item) {
                return item.AuthorName;
              }).join(' ') }</p>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default WorksList;
