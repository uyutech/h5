/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

import util from '../common/util';

class Timeline extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod mod-timeline">
      <ul class="c fn-clear">
        {
          (this.props.datas || []).map(function(item) {
            let date = util.formatDate(item.LineDate);
            return <li title={ item.LineDate.replace(/:\d{2}$/, '') }>
              <span>{ item.Describe }</span>
              <small>{ date }</small>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Timeline;
