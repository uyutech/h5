/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', 'a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        util.openAuthor({
          url,
          title,
        });
      });
    });
  }
  render() {
    let data = this.props.data;
    let works = data.worklist[0];
    let author = ((works.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    return <div class={ 'mod-works' + (this.props.last ? ' last' : '') }>
      <a href={ '/works.html?worksID=' + works.WorksID } title={ works.Title } class="pic">
        <img src={ util.autoSsl(util.img250_250_80(data.coverpic || works.cover_Pic)) || '/src/common/blank.png' }/>
        <div>
          <span>{ data.Describe }</span>
        </div>
      </a>
      <div class="txt">
        <a href={ '/works.html?worksID=' + works.WorksID } title={ works.Title } class="name">{ works.Title }</a>
        <dl>
          <dt>{ author.Describe }</dt>
          {
            (author.AuthorInfo || []).map(function(item) {
              return <dd>
                <a href={ '/author.html?authorId=' + item.AuthorID }
                   title={ item.AuthorName }>
                  <img src={ util.autoSsl(util.img60_60_80(item.Head_url || '/src/common/blank.png')) }/>
                  <span>{ item.AuthorName }</span>
                </a>
              </dd>;
            })
          }
        </dl>
        <a href={ '/works.html?worksID=' + works.WorksID } title={ works.Title } class="intro"><pre>{ data.Intro }</pre></a>
      </div>
    </div>;
  }
}

export default Works;
