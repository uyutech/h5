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
  render() {
    let url;
    if(this.props.type === 3) {
      url = '/image.html?albumId=' + this.data.content.id;
    }
    else if(this.props.type === 2) {
      url = '/music.html?albumId=' + this.data.content.id;
    }
    else {
      url = '/works.html?worksId=' + this.data.content.id;
    }
    return <div class="mod-works">
      <a class="pic"
         href={ url }
         title={ this.data.content.title }>
        <img src={ util.autoSsl(util.img250_250_80(this.data.content.cover))
          || '/src/common/blank.png' }/>
        <div class={ this.data.title ? '' : 'fn-hide' }>
          <span>{ this.data.title }</span>
        </div>
      </a>
      <div class="txt">
        <a href={ url }
           title={ this.data.content.title }
           class="name">{ this.data.content.title }</a>
        {
          this.data.content.author.length
            ? <dl>
                <dt>{ this.data.content.author[0].name }</dt>
                {
                  this.data.content.author[0].list.map(function(item) {
                    return <dd>
                      <a href={ '/author.html?id=' + item.id }
                         title={ item.name }>
                        <img src={ util.img(item.headUrl, 60, 60, 80) || '/src/common/head.png' }/>
                        <span>{ item.name }</span>
                      </a>
                    </dd>;
                  })
                }
              </dl>
            : ''
        }
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
