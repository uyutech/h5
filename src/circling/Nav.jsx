/**
 * Created by army8735 on 2018/6/8.
 */

'use strict';

import Background from '../component/background/Background.jsx';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    this.index = 0;
  }
  @bind index
  click(e, vd, tvd) {
    if(this.index === tvd.props.rel) {
      return;
    }
    this.index = tvd.props.rel;
    this.emit('change', this.index);
  }
  clickSearch() {
    jsBridge.pushWindow('/search.html', {
      hideBackButton: true,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="mod-nav">
      <b class="search"
         onClick={ this.clickSearch }/>
      <ul ref="list"
          onClick={ { li: this.click } }>
        <li class={ this.index === 0 ? 'cur' : '' }
            rel={ 0 }>发现</li>
        <li class={ this.index === 1 ? 'cur' : '' }
            rel={ 1 }>关注</li>
      </ul>
      <Background/>
    </div>;
  }
}

export default Nav;
