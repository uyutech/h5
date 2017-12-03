/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

class Poster extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="mod mod-poster">
      <h5>{ this.props.datas.name }</h5>
      <ul class="c">
        {
          (this.props.datas.value || []).map(function(item) {
            return <li><img src={ item.FileUrl || '//zhuanquan.xin/img/blank.png' }/></li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Poster;
