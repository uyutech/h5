/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

class Lyric extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod mod-lyric">
      <h5>{ this.props.datas.name }</h5>
      <ul class="c">
        {
          (this.props.datas.value || []).map(function(item) {
            return <li><pre>{ item.Text }</pre></li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Lyric;
