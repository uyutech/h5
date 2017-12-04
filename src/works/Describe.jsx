/**
 * Created by army8735 on 2017/10/19.
 */

'use strict';

class Describe extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod mod-describe">
      <h4>专辑简介</h4>
      <pre>{ this.props.data }</pre>
    </div>;
  }
}

export default Describe;
