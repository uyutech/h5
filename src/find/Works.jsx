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
    self.data = self.props.data;
  }
  @bind data
  setData(data) {
    this.data = data;
  }
  clickWorks(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickAuthor(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="mod-works"
                onClick={ { '.pic,.name,.intro': this.clickWorks, 'dd a': this.clickAuthor } }>
      <a class="pic"
         href={ '/works.html?worksId=' + this.data.content.id }
         title={ this.data.content.title }>
        <img src={ util.autoSsl(util.img250_250_80(this.data.content.cover))
          || '/src/common/blank.png' }/>
        <div class={ this.data.title ? '' : 'fn-hide' }>
          <span>{ this.data.title }</span>
        </div>
      </a>
      <div class="txt">
        <a href={ '/works.html?worksId=' + this.data.content.id }
           title={ this.data.content.title }
           class="name">{ this.data.content.title }</a>
        <dl>
          <dt>{ ((this.data.content.author || [])[0] || {}).name }</dt>
          {
            (((this.data.content.author || [])[0] || {}).list || []).map(function(item) {
              return <dd>
                <a href={ '/author.html?authorId=' + item.id }
                   title={ item.name }>
                  <img src={ util.autoSsl(util.img60_60_80(item.headUrl || '/src/common/head.png')) }/>
                  <span>{ item.name }</span>
                </a>
              </dd>;
            })
          }
        </dl>
        <a href={ '/works.html?worksId=' + this.data.content.id }
           title={ this.data.content.title }
           class="intro">
          <pre>{ this.data.describe }</pre>
        </a>
      </div>
    </div>;
  }
}

export default Works;
