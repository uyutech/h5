/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  clickWorks(e, vd, tvd) {
    e.preventDefault();
    util.openWorks({
      url: tvd.props.href,
      title: tvd.props.title,
    }, tvd.props.option);
  }
  clickAuthor(e, vd, tvd) {
    e.preventDefault();
    util.openAuthor({
      url: tvd.props.href,
      title: tvd.props.title,
    });
  }
  render() {
    let data = this.props.data;
    let works = data.worklist[0];
    let author = ((works.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    let url = util.getWorksUrl(works.WorksID, works.WorkType);
    let option = util.getWorksUrlOption(works.WorkType);
    return <div class="mod-works" onClick={ { '.pic,.name': this.clickWorks, 'dd a': this.clickAuthor } }>
      <a href={ url }
         title={ works.Title }
         option={ option }
         class="pic">
        <img src={ util.autoSsl(util.img250_250_80(data.coverpic || works.cover_Pic)) || '/src/common/blank.png' }/>
        <div class={ data.Describe ? '' : 'fn-hide' }>
          <span>{ data.Describe }</span>
        </div>
      </a>
      <div class="txt">
        <a href={ url }
           title={ works.Title }
           option={ option }
           class="name">{ works.Title }</a>
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
