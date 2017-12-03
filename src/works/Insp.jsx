/**
 * Created by army8735 on 2017/10/9.
 */

'use strict';

import util from '../common/util';

class Insp extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod mod-insp">
      <h5>创作灵感</h5>
      <ul class="c">
        {
          (this.props.commentData || []).map(function(item) {
            return <li>
              <div class="t">
                <div class="profile fn-clear">
                  <img class="pic" src={ item.Head_Url || '//zhuanquan.xin/img/blank.png' }/>
                  <div class="txt">
                    <div>
                      <a href={ `/author/${item.AuthorID}` } class="name">{ item.AuthorName }</a>
                      <small class="time">{ util.formatDate(item.LineDate) }</small>
                    </div>
                    <p>{ item.sign }</p>
                  </div>
                </div>
              </div>
              <div class="c">
                <pre>{ item.Content }<span class="placeholder"/></pre>
                <b class="arrow"/>
              </div>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Insp;
