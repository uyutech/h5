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
        util.openWorks({
          url,
          title,
        });
      });
      $root.on('click', 'dd a', function(e) {
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
    let url = util.getWorksUrl(works.WorksID, works.WorkType);
    return <div class={ 'mod-works' + (this.props.last ? ' last' : '') }>
      <a href={ url } title={ works.Title } class="pic">
        <img src={ util.autoSsl(util.img250_250_80(data.coverpic || works.cover_Pic)) || '/src/common/blank.png' }/>
        <div>
          <span>{ data.Describe }</span>
        </div>
      </a>
      <div class="txt">
        <a href={ url } title={ works.Title } class="name">{ works.Title }</a>
        <dl>
          <dt>{ author.Describe }</dt>
          {
            (author.AuthorInfo || []).map(function(item) {
              return <dd>
                <a href={ '/author.html?authorId=' + item.AuthorID }
                   title={ item.AuthorName }>
                  <img src={ util.autoSsl(util.img60_60_80(item.Head_url || '/src/common/head.png')) }/>
                  <span>{ item.AuthorName }</span>
                </a>
              </dd>;
            })
          }
        </dl>
        <a href={ url } title={ works.Title } class="intro"><pre>{ data.Intro }</pre></a>
      </div>
    </div>;
  }
}

export default Works;
