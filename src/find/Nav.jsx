/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import Background from '../component/background/Background.jsx';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind tag
  setData(data) {
    this.tag = data[0].id;
    this.list = data;
  }
  clickSearch() {
    jsBridge.pushWindow('/search.html', {
      hideBackButton: true,
      transparentTitle: true,
    });
  }
  click(e, vd, tvd) {
    if(tvd.props.rel === this.tag) {
      return;
    }
    this.tag = tvd.props.rel;
    this.emit('change', this.tag);
  }
  render() {
    return <div class="mod-nav">
      <b class="search"
         onClick={ this.clickSearch }/>
      <ul ref="list"
          onClick={ { li: this.click } }>
      {
        (this.tag, this.list || []).map((item) => {
          return <li class={ item.id === this.tag ? 'cur' : '' }
                     rel={ item.id }>{ item.name }</li>;
        })
      }
      </ul>
      <Background/>
    </div>;
  }
}

export default Nav;
