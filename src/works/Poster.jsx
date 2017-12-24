/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

import util from '../common/util';

class Poster extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    jsBridge.openUri(url);
  }
  render() {
    return <div class="mod mod-poster">
      <h5>{ this.props.datas.name }</h5>
      <ul class="c" onClick={ { a: this.click } }>
        {
          (this.props.datas.value || []).map(function(item) {
            return <li>
              <a href={ item.FileUrl || '/src/common/blank.png' }>
                <img src={ util.autoSsl(util.img720__80(item.FileUrl)) || '/src/common/blank.png' }/>
              </a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Poster;
