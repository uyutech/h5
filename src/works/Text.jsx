/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

class Text extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  render() {
    return <ul class={ 'mod-text' + (this.list && this.list.length ? '' : ' fn-hide') }>
      {
        (this.list || []).map(function(item) {
          return <li>
            <h5>{ item.typeName }</h5>
            <pre>{ item.content }</pre>
          </li>;
        })
      }
    </ul>;
  }
}

export default Text;
