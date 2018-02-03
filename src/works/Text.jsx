/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

class Text extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod-text">
      <h5>{ this.props.title }</h5>
      <pre>{ this.props.data }</pre>
    </div>;
  }
}

export default Text;
